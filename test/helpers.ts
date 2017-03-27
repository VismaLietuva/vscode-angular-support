import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';

export async function openFileInVscode(filePath: string) {
  const success = await vscode.workspace.openTextDocument(vscode.Uri.file(filePath));
  return await vscode.window.showTextDocument(success);
}

export function workspaceFilePath(filePath: string) {
  return path.join(vscode.workspace.rootPath, filePath);
}

export async function assertGoToDefinition(sourceFilePath: string, inputPos: vscode.Position,
  expectedFilePath: string, expectedDefinitonPos: vscode.Position) {
  const result = await vscode.commands.executeCommand<vscode.Location[]>('vscode.executeDefinitionProvider',
    vscode.Uri.file(sourceFilePath), inputPos);

  assert.notEqual(result[0], undefined, 'definition did not resolve');
  assert.equal(result[0].uri.fsPath, expectedFilePath, 'wrong file resolution');
  assert.equal(result[0].range.start.line, expectedDefinitonPos.line, 'wrong line position');
  assert.equal(result[0].range.start.character, expectedDefinitonPos.character, 'wrong character position');
}
