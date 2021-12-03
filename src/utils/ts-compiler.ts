import * as ts from 'typescript';
import type { Parameter } from './parameters';
import type { Result } from './results';
import { throwErr } from './utils';

export type EvalResult = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function: (...args: any[]) => Record<string, number>;
	parameters: Parameter[];
	results: Result[];
};

export async function evalTypeScript(source: string): Promise<EvalResult> {
	const rootFileName = 'main.ts';
	const compilerOptions = {
		module: ts.ModuleKind.ES2015
	};

	const rootFile = ts.createSourceFile(rootFileName, source, ts.ScriptTarget.ES2015);
	if (
		rootFile.statements.length !== 1 ||
		rootFile.statements[0].kind !== ts.SyntaxKind.ExpressionStatement
	) {
		throwErr('Source code may only consist of a single expression!');
	}
	const expression = (rootFile.statements[0] as ts.ExpressionStatement).expression;

	const program = ts.createProgram({
		rootNames: [rootFileName],
		options: compilerOptions,
		host: {
			getSourceFile: (fileName) => (fileName === rootFileName ? rootFile : undefined),
			getDefaultLibFileName: () => 'lib.d.ts',
			writeFile: () => throwErr('Trying to write to file!'),
			getCurrentDirectory: () => '.',
			getDirectories: () => ['.'],
			getCanonicalFileName: (fileName) => fileName,
			getNewLine: () => '\n',
			useCaseSensitiveFileNames: () => false,
			fileExists: (fileName) => fileName === rootFileName,
			readFile: (fileName) => (fileName === rootFileName ? source : undefined)
		}
	});
	const typechecker = program.getTypeChecker();

	const transpiledJS = await new Promise<string>((resolve) =>
		program.emit(rootFile, (_, data) => resolve(data))
	);

	const functionType = typechecker.getTypeAtLocation(expression);
	const callSignatures = functionType.getCallSignatures();
	if (callSignatures.length !== 1) {
		throwErr('Expression must be a function with exactly one call signature!');
	}

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

		throwErr(`Type of parameter ${parameter.getName()} must be number or string!`, {
			parameter,
			parameterType
		});
	});

	const returnType = callSignatures[0].getReturnType();
	if (returnType.getFlags() !== ts.TypeFlags.Object) {
		throwErr(`Return type must be a plain object!`, { returnType });
	}
	const functionResults = returnType.getProperties();
	const results: Result[] = functionResults.map((result) => {
		const resultType = typechecker.getTypeOfSymbolAtLocation(result, expression);

		// in results, we also accept inherited/number-like types
		if (resultType.getFlags() & ts.TypeFlags.NumberLike) {
			return { name: result.name, type: ['number'] };
		}

		throwErr(`Type of result variable ${result.getName()} must be number!`, {
			result,
			resultType
		});
	});

	const evaluatedFunction = (() => eval(transpiledJS))();

	return {
		function: evaluatedFunction,
		parameters,
		results
	};
}
