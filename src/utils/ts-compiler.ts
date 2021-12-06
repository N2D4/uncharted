import * as ts from 'typescript';
import type { Parameter } from './parameters';
import type { Result } from './results';
import { throwErr } from './utils';
import tsLibDTS from 'typescript/lib/lib.d.ts?raw';
import tsLibDOMDTS from 'typescript/lib/lib.d.ts?raw';
import tsLibES5DTS from 'typescript/lib/lib.d.ts?raw';
import tsLibWebWorkerImportScriptsDTS from 'typescript/lib/lib.d.ts?raw';
import tsLibScriptHostDTS from 'typescript/lib/lib.scripthost.d.ts?raw';

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
	compilerOptions.lib = ['lib.d.ts'];

	// Create file system
	const rootFileName = 'main.ts';
	const defaultLibFolder = 'lib';
	const defaultLibFileName = `${defaultLibFolder}/${ts.getDefaultLibFileName(compilerOptions)}`;
	const files = new Map([
		[rootFileName, source],
		[`${defaultLibFolder}/lib.d.ts`, tsLibDTS],
		[`${defaultLibFolder}/lib.dom.d.ts`, tsLibDOMDTS],
		[`${defaultLibFolder}/lib.es5.d.ts`, tsLibES5DTS],
		[`${defaultLibFolder}/lib.webworker.importscripts.d.ts`, tsLibWebWorkerImportScriptsDTS],
		[`${defaultLibFolder}/lib.scripthost.d.ts`, tsLibScriptHostDTS]
	]);
	const sourceFiles = new Map(
		[...files].map(([fileName, source]) => [
			fileName,
			ts.createSourceFile(fileName, source, compilerOptions.target ?? ts.ScriptTarget.ES3)
		])
	);
	console.log({ files, sourceFiles });

	// Check whether source is a single statement
	const rootFile = sourceFiles.get(rootFileName) ?? throwErr('No root file (huh?)');
	if (rootFile.statements.length !== 1) {
		throwErr('Source code must be a single expression.');
	}

	// Create program
	const program = ts.createProgram({
		rootNames: [rootFileName],
		options: compilerOptions,
		host: {
			getSourceFile: (fileName) =>
				(console.log('get source', fileName), sourceFiles.get(fileName)) ??
				throwErr(`TS compiler tried to read unexpected source file ${fileName}`),
			getDefaultLibFileName: () => defaultLibFileName,
			writeFile: () => throwErr('Trying to write to file!'),
			getCurrentDirectory: () => '',
			getDirectories: () => ['', defaultLibFolder],
			getCanonicalFileName: (fileName) => fileName,
			getNewLine: () => '\n',
			useCaseSensitiveFileNames: () => false,
			fileExists: (fileName) => (console.log('file exists?', fileName), files.has(fileName)),
			readFile: (fileName) =>
				(console.log('read file', fileName), files.get(fileName)) ??
				throwErr(`TS compiler tried to read unexpected file ${fileName}`)
		}
	});
	const typechecker = program.getTypeChecker();

	// Check for errors
	throwIfDiagnosticsNonEmpty(ts.getPreEmitDiagnostics(program));

	// Transpile to JS
	const transpiledJS = await new Promise<string>((resolve) =>
		program.emit(rootFile, (_, data) => resolve(data))
	);
	const evaluatedFunction = new Function(`return ${transpiledJS}`)();

	// Check whether there is exactly one expression statement
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
		throwErr('Expression must be a function with exactly one call signature!');
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
			`Type of parameter ${parameter.getName()} must be number or string! (is: ${typeName})`,
			{
				parameter,
				parameterType
			}
		);
	});

	// Map results
	const returnType = callSignatures[0].getReturnType();
	if (returnType.getFlags() !== ts.TypeFlags.Object) {
		throwErr(`Return type must be a plain object!`, { returnType });
	}
	const functionResults = returnType.getProperties();
	const results: Result[] = functionResults.map((result) => {
		const resultType = typechecker.getTypeOfSymbolAtLocation(result, expression);

		// in results, we also accept inherited number types
		if (resultType.getFlags() & ts.TypeFlags.Number) {
			return { name: result.name, type: ['number'] };
		}

		const typeName = typechecker.typeToString(resultType);
		throwErr(`Type of result variable ${result.getName()} must be number! (is: ${typeName})`, {
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
