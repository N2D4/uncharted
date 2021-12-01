import * as ts from 'typescript';

export function compileTypeScript(source: string): ["success", { js: string }] {
    const transpiledJS = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ES2015 }}).outputText;
    return ["success", { js: transpiledJS }]
}
