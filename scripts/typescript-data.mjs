import ts from "typescript";

export async function evaluateTypeScriptData(source) {
  const javascript = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.ESNext, target: ts.ScriptTarget.ESNext } }).outputText;
  return import("data:text/javascript;base64," + Buffer.from(javascript).toString("base64"));
}
