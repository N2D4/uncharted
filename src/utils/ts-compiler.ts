import * as ts from 'typescript';
import type { Parameter } from './parameters';
import type { Result } from './results';
import { throwErr } from './utils';
import { createDefaultMapFromCDN, createSystem, createVirtualCompilerHost } from '@typescript/vfs';
import lzstring from 'lz-string';

export type EvalResult = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function: (...args: any[]) => Record<string, number>;
	parameters: Parameter[];
	results: Result[];
};

export async function evalTypeScript(
	source: string,
	compilerOptions: ts.CompilerOptions
): Promise<EvalResult> {
	// Let the UI do its stuff before doing heavy blocking work
	await new Promise((resolve) => setTimeout(resolve, 0));

	// Create file system
	const rootFileName = '/main.ts';
	const files = await createDefaultMapFromCDN(compilerOptions, ts.version, true, ts, lzstring);
	files.set(rootFileName, source);
	const vfs = createVirtualCompilerHost(createSystem(files), compilerOptions, ts).compilerHost;
	console.log({ files, vfs });

	// Create program
	const program = ts.createProgram({
		rootNames: [rootFileName],
		options: compilerOptions,
		host: vfs
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
	const evaluatedFunction = new Function(`return ${transpiledJS}`)();

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
	const returnType = callSignatures[0].getReturnType();
	if (returnType.getFlags() !== ts.TypeFlags.Object) {
		throwErr(`Return type must be a plain object.`, { returnType });
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

function throwIfDiagnosticsNonEmpty(diagnostics: readonly ts.Diagnostic[]) {
	if (diagnostics.length === 0) return;

	const str = ts.formatDiagnostics(diagnostics, {
		getCanonicalFileName: (fileName) => fileName,
		getCurrentDirectory: () => '.',
		getNewLine: () => '\n'
	});
	throwErr(`TypeScript compile errors\n\n${str}`, diagnostics);
}
