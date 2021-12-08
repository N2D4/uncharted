import * as ts from 'typescript';
import type { Parameter } from './parameters';
import type { Result } from './results';
import { throwErr } from './utils';
import { createDefaultMapFromCDN, createSystem, createVirtualCompilerHost } from '@typescript/vfs';
import lzstring from 'lz-string';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EvalFunction = (...args: any[]) => Record<string, number>;

export type EvalResult = {
	function: EvalFunction;
	parameters: Parameter[];
	results: Result[];
};

export async function evalTypeScript(
	source: string,
	compilerOptions: ts.CompilerOptions
): Promise<EvalResult> {
	// Create file system
	const rootFileName = '/main.ts';
	const files = await createDefaultMapFromCDN(compilerOptions, ts.version, true, ts, lzstring);
	files.set(rootFileName, source);
	const vfs = createVirtualCompilerHost(createSystem(files), compilerOptions, ts);

	// There is a bug in TSVFS where if it will throw when a non-existing source-file is requested instead of simply
	// returning undefined
	const oldGetSourceFile = vfs.compilerHost.getSourceFile;
	vfs.compilerHost.getSourceFile = (...args: Parameters<typeof oldGetSourceFile>) => {
		if (!vfs.compilerHost.fileExists(args[0])) return undefined;
		return oldGetSourceFile.apply(vfs.compilerHost, args);
	};

	// Create program
	const program = ts.createProgram({
		rootNames: [rootFileName],
		options: compilerOptions,
		host: vfs.compilerHost
	});
	const typechecker = program.getTypeChecker();
	const rootFile =
		program.getSourceFile(rootFileName) ?? throwErr('Assertion failed: No root file');

	// Check for errors
	throwIfDiagnosticsNonEmpty(ts.getPreEmitDiagnostics(program));

	// Transpile to JS
	const transpiledJS = await new Promise<string>((resolve, reject) => {
		let written = false;
		const emitResult = program.emit(rootFile, (fileName, data) => {
			if (fileName !== rootFileName.replace(/\.ts$/, '.js')) {
				const msg = `Assertion failed: Tried to write file that wasn't root file: ${fileName}`;
				reject(new Error(msg));
				throwErr(msg, { fileName, data });
			}
			written = true;
			resolve(data);
		});
		throwIfDiagnosticsNonEmpty(emitResult.diagnostics);
		if (!written) throwErr(`Assertion failed: TypeScript compiler didn't write a file`, emitResult);
	});
	const evaluatedFunction = eval.call(globalThis, transpiledJS);

	// Check whether source is a single expression
	if (rootFile.statements.length !== 1) {
		throwErr('Source code must be a single expression.');
	}
	const statement = rootFile.statements[0];
	if (statement.kind !== ts.SyntaxKind.ExpressionStatement) {
		throwErr(
			`The statement must be an expression (a statement was found, but it does not resolve to a value).\n\n`,
			{ statement: statement }
		);
	}
	const expression = (statement as ts.ExpressionStatement).expression;

	// Check that the expression resolves to a function
	const functionType = typechecker.getTypeAtLocation(expression);
	const callSignatures = functionType.getCallSignatures();
	if (callSignatures.length !== 1) {
		throwErr('Expression must be a function with exactly one call signature.');
	}

	// Map parameters
	const functionParameters = callSignatures[0].getParameters();
	const parameters: Parameter[] = functionParameters.map((parameter) => {
		const parameterType = typechecker.getTypeOfSymbolAtLocation(parameter, expression);

		switch (parameterType.getFlags()) {
			// we don't check for inheritance (using &) as we want types to be exact
			case ts.TypeFlags.Number: {
				return { name: parameter.name, type: ['number'] };
			}
			case ts.TypeFlags.String: {
				return { name: parameter.name, type: ['string'] };
			}
		}

		const typeName = typechecker.typeToString(parameterType);
		throwErr(
			`Type of parameter ${parameter.getName()} must be number or string. (is: ${typeName})`,
			{
				parameter,
				parameterType
			}
		);
	});

	// Map results
	const returnType = awaitType(typechecker, callSignatures[0].getReturnType());
	if (returnType.getFlags() !== ts.TypeFlags.Object) {
		throwErr(`Return type must be a plain object or Promise of a plain object.`, { returnType });
	}
	const functionResults = returnType.getProperties();
	const results: Result[] = functionResults.map((result) => {
		const resultType = typechecker.getTypeOfSymbolAtLocation(result, expression);

		// in results, we also accept inherited number types
		if (resultType.getFlags() & ts.TypeFlags.Number) {
			return { name: result.name, type: ['number'] };
		}

		const typeName = typechecker.typeToString(resultType);
		throwErr(`Type of result variable ${result.getName()} must be number. (is: ${typeName})`, {
			result,
			resultType
		});
	});

	return {
		function: evaluatedFunction,
		parameters,
		results
	};
}

function awaitType(typechecker: ts.TypeChecker, type: ts.Type): ts.Type {
	if (type.getSymbol()?.getName() !== 'Promise') return type;
	if (!(type.getFlags() & ts.TypeFlags.Object)) return type;

	const object = type as ts.ObjectType;
	if (object.objectFlags !== ts.ObjectFlags.Reference) return type;

	const typeArg = typechecker.getTypeArguments(object as ts.TypeReference)?.[0];
	if (!typeArg) return type;

	return typeArg;
}

function throwIfDiagnosticsNonEmpty(diagnostics: readonly ts.Diagnostic[]) {
	if (diagnostics.length === 0) return;

	throwErr(new TSCompilerError(diagnostics), diagnostics);
}

class TSCompilerError extends Error {
	constructor(public diagnostics: readonly ts.Diagnostic[]) {
		super(
			`${diagnostics.length === 1 ? '' : `Multiple errors\n\n`}${formatDiagnostics(diagnostics)}`
		);
		this.name = 'TSCompilerError';
	}
}

function formatDiagnostics(diagnostics: readonly ts.Diagnostic[]) {
	return ts.formatDiagnostics(diagnostics, {
		getCanonicalFileName: (fileName) => fileName,
		getCurrentDirectory: () => '.',
		getNewLine: () => '\n'
	});
}
