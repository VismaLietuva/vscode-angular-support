import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';
import { openFileInVscode, workspaceFilePath, assertGoToDefinition } from '../helpers';

suite('AngularTsDefinitionProvider', () => {
  const componentFilePath = workspaceFilePath('foo.component.ts');

  suiteSetup(async () => {
    await openFileInVscode(componentFilePath);
  });

  test('should go to templateUrl declaration', async () => {
    const inputPosition = new vscode.Position(2, 22);
    const expectedFile = workspaceFilePath('foo.component.html');
    const expectedPosition = new vscode.Position(0, 0);

    assertGoToDefinition(componentFilePath, inputPosition, expectedFile, expectedPosition);
  });

  test('should go to styleUrls declaration', async () => {
    const inputPosition = new vscode.Position(3, 22);
    const expectedFile = workspaceFilePath('foo.component.css');
    const expectedPosition = new vscode.Position(0, 0);

    assertGoToDefinition(componentFilePath, inputPosition, expectedFile, expectedPosition);
  });
});
