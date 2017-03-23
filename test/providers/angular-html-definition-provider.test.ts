import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';
import { openFileInVscode, workspaceFilePath } from '../helpers';

suite('AngularHtmlDefinitionProvider', () => {
  const templateFilePath = workspaceFilePath('foo.component.html');
  
  suiteSetup(async () => {
    await openFileInVscode(templateFilePath);
  });

  suite('should resolve property/method', () => {
    test('from interpolation', async () => {
      const result = await vscode.commands.executeCommand<vscode.Location[]>('vscode.executeDefinitionProvider',
        vscode.Uri.file(templateFilePath), new vscode.Position(1, 8));

      assert.notEqual(result[0], undefined, 'definition did not resolve');
      assert.equal(result[0].uri.fsPath, workspaceFilePath('foo.component.ts'), 'wrong file resolution');
      assert.equal(result[0].range.start.line, 6, 'wrong line position');
      assert.equal(result[0].range.start.character, 12, 'wrong character position');
    });

    test('from interpolation with pipe', async () => {
      const result = await vscode.commands.executeCommand<vscode.Location[]>('vscode.executeDefinitionProvider',
        vscode.Uri.file(templateFilePath), new vscode.Position(6, 9));

      assert.notEqual(result[0], undefined, 'definition did not resolve');
      assert.equal(result[0].uri.fsPath, workspaceFilePath('foo.component.ts'), 'wrong file resolution');
      assert.equal(result[0].range.start.line, 6, 'wrong line position');
      assert.equal(result[0].range.start.character, 12, 'wrong character position');
    });

    test('from one way binded input attribute', async () => {
      const result = await vscode.commands.executeCommand<vscode.Location[]>('vscode.executeDefinitionProvider',
        vscode.Uri.file(templateFilePath), new vscode.Position(2, 40));

      assert.notEqual(result[0], undefined, 'definition did not resolve');
      assert.equal(result[0].uri.fsPath, workspaceFilePath('foo.component.ts'), 'wrong file resolution');
      assert.equal(result[0].range.start.line, 11, 'wrong line position');
      assert.equal(result[0].range.start.character, 14, 'wrong character position');
    });

    test('from two way binded input attribute', async () => {
      const result = await vscode.commands.executeCommand<vscode.Location[]>('vscode.executeDefinitionProvider',
        vscode.Uri.file(templateFilePath), new vscode.Position(2, 62));

      assert.notEqual(result[0], undefined, 'definition did not resolve');
      assert.equal(result[0].uri.fsPath, workspaceFilePath('foo.component.ts'), 'wrong file resolution');
      assert.equal(result[0].range.start.line, 7, 'wrong line position');
      assert.equal(result[0].range.start.character, 25, 'wrong character position');
    });
    
    test('from output attribute', async () => {
      const result = await vscode.commands.executeCommand<vscode.Location[]>('vscode.executeDefinitionProvider',
        vscode.Uri.file(templateFilePath), new vscode.Position(2, 86));

      assert.notEqual(result[0], undefined, 'definition did not resolve');
      assert.equal(result[0].uri.fsPath, workspaceFilePath('foo.component.ts'), 'wrong file resolution');
      assert.equal(result[0].range.start.line, 15, 'wrong line position');
      assert.equal(result[0].range.start.character, 10, 'wrong character position');
    });
    
    test('from structural attribute', async () => {
      const result = await vscode.commands.executeCommand<vscode.Location[]>('vscode.executeDefinitionProvider',
        vscode.Uri.file(templateFilePath), new vscode.Position(4, 15));

      assert.notEqual(result[0], undefined, 'definition did not resolve');
      assert.equal(result[0].uri.fsPath, workspaceFilePath('foo.component.ts'), 'wrong file resolution');
      assert.equal(result[0].range.start.line, 19, 'wrong line position');
      assert.equal(result[0].range.start.character, 6, 'wrong character position');
    });
  });
});
