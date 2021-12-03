import * as ts from 'typescript';
import { throwErr } from './utils';

export type Parameter = readonly ['number'] | readonly ['string'];

export type Result = Map<string, ['number']>;

export type EvalResult = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	function: (...args: any[]) => Record<string, number>;
	parameters: Parameter[];
	result: Result;
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
	const returnType = callSignatures[0].getReturnType();
	const functionParameters = callSignatures[0].getParameters();
	console.log({ expression, callSignatures, functionParameters, returnType });

	const parameters = functionParameters.map((parameter) => {
		const parameterType = typechecker.getTypeOfSymbolAtLocation(parameter, expression);
		console.log({ parameter, parameterType });

		switch (parameterType.getFlags()) {
			// we don't check for inheritance (using &) as we want types to be exact
			case ts.TypeFlags.Number: {
				return ['number'] as const;
			}
			case ts.TypeFlags.String: {
				return ['string'] as const;
			}
		}

		throwErr(`Type of parameter ${parameter.getName()} must be number or string!`, {
			parameter,
			parameterType
		});
	});
	const result = new Map();

	const evaluatedFunction = (() => eval(transpiledJS))();

	return {
		function: evaluatedFunction,
		parameters,
		result
	};
}
