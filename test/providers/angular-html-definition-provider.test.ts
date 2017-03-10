import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';
import { openFileInVscode, workspaceFilePath, catchAsync } from '../helpers';

suite('AngularHtmlDefinitionProvider', () => {
  const templateFilePath = workspaceFilePath('foo.component.html');
  
  suiteSetup(catchAsync(async (done) => {
    await openFileInVscode(templateFilePath);
    done();
  }));

  test('should resolve interpolation', catchAsync(async (done) => {    
    const result = await vscode.commands.executeCommand<vscode.Location[]>('vscode.executeDefinitionProvider',
      vscode.Uri.file(templateFilePath), new vscode.Position(1, 8));

    assert.notEqual(result[0], undefined, 'file did not resolve');
    assert.equal(result[0].uri.fsPath, workspaceFilePath('foo.component.ts'), 'wrong file resolution');
    assert.equal(result[0].range.start.line, 6, 'wrong line position');
    assert.equal(result[0].range.start.character, 7, 'wrong character position');
    done();
  }));

  test('should resolve one way binded input', catchAsync(async (done) => {
    const result = await vscode.commands.executeCommand<vscode.Location[]>('vscode.executeDefinitionProvider',
      vscode.Uri.file(templateFilePath), new vscode.Position(2, 40));

    assert.notEqual(result[0], undefined, 'file did not resolve');
    assert.equal(result[0].uri.fsPath, workspaceFilePath('foo.component.ts'), 'wrong file resolution');
    assert.equal(result[0].range.start.line, 7, 'wrong line position');
    assert.equal(result[0].range.start.character, 10, 'wrong character position');
    done();
  }));

  test('should resolve two way binded input', catchAsync(async (done) => {
    const result = await vscode.commands.executeCommand<vscode.Location[]>('vscode.executeDefinitionProvider',
      vscode.Uri.file(templateFilePath), new vscode.Position(2, 62));

    assert.notEqual(result[0], undefined, 'file did not resolve');
    assert.equal(result[0].uri.fsPath, workspaceFilePath('foo.component.ts'), 'wrong file resolution');
    assert.equal(result[0].range.start.line, 8, 'wrong line position');
    assert.equal(result[0].range.start.character, 7, 'wrong character position');
    done();
  }));
});
