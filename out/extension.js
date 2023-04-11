"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.activate = void 0;
const vscode = require("vscode");
function generateDataClass() {
    const editor = vscode.window.activeTextEditor;
    if (!editor) {
        return; // No open text editor
    }
    const { document } = editor;
    const className = document.fileName.match(/\/(\w+)\.dart$/)?.[1];
    if (!className) {
        return vscode.window.showErrorMessage('Unable to extract class name from file name');
    }
    const text = document.getText();
    const fields = text.match(/final\s+(\w+)\s+(\w+)\s*;/g)
        ?.map((line) => line.match(/final\s+(\w+)\s+(\w+)\s*;/))
        ?.map((match) => ({ name: match?.[2], type: match?.[1] }));
    if (!fields || fields.length === 0) {
        return vscode.window.showErrorMessage('Unable to extract fields from class');
    }
    const constructorParams = fields.map(({ name, type }) => `this.${name}`);
    const dataClassTemplate = `
@DataClass()
class ${className} {
${fields.map(({ name, type }) => `  final ${type} ${name};`).join('\n')}
  
  ${className}({
${constructorParams.join(',\n')}
  });
}
`.trim();
    const newFileName = `${className}_data.dart`;
    const newFilePath = document.fileName.replace(/\/(\w+)\.dart$/, `/${newFileName}`);
    vscode.workspace.fs.writeFile(vscode.Uri.file(newFilePath), Buffer.from(dataClassTemplate));
    vscode.window.showInformationMessage(`Data class generated: ${newFileName}`);
}
function activate(context) {
    context.subscriptions.push(vscode.commands.registerCommand('dcg.generateDataClass', generateDataClass));
}
exports.activate = activate;
//# sourceMappingURL=extension.js.map