import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';
import { openFileInVscode, workspaceFilePath } from '../helpers';

suite('AngularHtmlDefinitionProvider', () => {
  const templateFilePath = workspaceFilePath('foo.component.html');
  
  suiteSetup(async () => {
    await openFileInVscode(templateFilePath);
  });

  test('should resolve interpolation', async () => {
    const result = await vscode.commands.executeCommand<vscode.Location[]>('vscode.executeDefinitionProvider',
      vscode.Uri.file(templateFilePath), new vscode.Position(1, 8));

    assert.notEqual(result[0], undefined, 'definition did not resolve');
    assert.equal(result[0].uri.fsPath, workspaceFilePath('foo.component.ts'), 'wrong file resolution');
    assert.equal(result[0].range.start.line, 6, 'wrong line position');
    assert.equal(result[0].range.start.character, 12, 'wrong character position');
  });

  test('should resolve one way binded input', async () => {
    const result = await vscode.commands.executeCommand<vscode.Location[]>('vscode.executeDefinitionProvider',
      vscode.Uri.file(templateFilePath), new vscode.Position(2, 40));

    assert.notEqual(result[0], undefined, 'definition did not resolve');
    assert.equal(result[0].uri.fsPath, workspaceFilePath('foo.component.ts'), 'wrong file resolution');
    assert.equal(result[0].range.start.line, 11, 'wrong line position');
    assert.equal(result[0].range.start.character, 14, 'wrong character position');
  });

  test('should resolve two way binded input', async () => {
    const result = await vscode.commands.executeCommand<vscode.Location[]>('vscode.executeDefinitionProvider',
      vscode.Uri.file(templateFilePath), new vscode.Position(2, 62));

    assert.notEqual(result[0], undefined, 'definition did not resolve');
    assert.equal(result[0].uri.fsPath, workspaceFilePath('foo.component.ts'), 'wrong file resolution');
    assert.equal(result[0].range.start.line, 7, 'wrong line position');
    assert.equal(result[0].range.start.character, 16, 'wrong character position');
  });
  
  test('should resolve output', async () => {
    const result = await vscode.commands.executeCommand<vscode.Location[]>('vscode.executeDefinitionProvider',
      vscode.Uri.file(templateFilePath), new vscode.Position(2, 86));

    assert.notEqual(result[0], undefined, 'definition did not resolve');
    assert.equal(result[0].uri.fsPath, workspaceFilePath('foo.component.ts'), 'wrong file resolution');
    assert.equal(result[0].range.start.line, 15, 'wrong line position');
    assert.equal(result[0].range.start.character, 10, 'wrong character position');
  });
});
