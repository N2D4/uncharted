import * as ts from 'typescript';
import { throwErr } from './utils';

export async function evalTypeScript(
	source: string
): Promise<{ function: (...args: any[]) => Record<string, number> }> {
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

	const transpiledJS = await new Promise<string>((resolve) =>
		program.emit(rootFile, (_, data) => resolve(data))
	);
	const type = program.getTypeChecker().getTypeAtLocation(expression);
	const callSignatures = type.getCallSignatures();
	if (callSignatures.length !== 1) {
		throwErr('Expression must be a function with exactly one call signature!');
	}
	const returnType = callSignatures[0].getReturnType();
	const parameters = callSignatures[0].getParameters();
	console.log({ parameters, returnType });

	const evaluatedFunction = (() => eval(transpiledJS))();

	return { function: evaluatedFunction };
}
