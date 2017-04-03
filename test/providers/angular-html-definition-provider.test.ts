import * as assert from 'assert';
import * as vscode from 'vscode';
import * as path from 'path';
import { openFileInVscode, workspaceFilePath, assertGoToDefinition } from '../helpers';

suite('AngularHtmlDefinitionProvider', () => {
  const templateFilePath = workspaceFilePath('foo.component.html');
  
  suiteSetup(async () => {
    await openFileInVscode(templateFilePath);
  });

  suite('should resolve property/method', () => {
    test('from interpolation', async () => {
      const inputPosition = new vscode.Position(1, 8);
      const expectedFile = workspaceFilePath('foo.component.ts');
      const expectedPosition = new vscode.Position(6, 2);

      await assertGoToDefinition(templateFilePath, inputPosition, expectedFile, expectedPosition);
    });

    test('from interpolation with pipe', async () => {
      const inputPosition = new vscode.Position(6, 9);
      const expectedFile = workspaceFilePath('foo.component.ts');
      const expectedPosition = new vscode.Position(6, 2);

      await assertGoToDefinition(templateFilePath, inputPosition, expectedFile, expectedPosition);
    });

    test('from interpolation with elvis operator', async () => {
      const inputPosition = new vscode.Position(8, 8);
      const expectedFile = workspaceFilePath('foo.component.ts');
      const expectedPosition = new vscode.Position(20, 2);

      await assertGoToDefinition(templateFilePath, inputPosition, expectedFile, expectedPosition);
    });

    test('from one way binded input attribute', async () => {
      const inputPosition = new vscode.Position(2, 40);
      const expectedFile = workspaceFilePath('foo.component.ts');
      const expectedPosition = new vscode.Position(11, 6);

      await assertGoToDefinition(templateFilePath, inputPosition, expectedFile, expectedPosition);
    });

    test('from two way binded input attribute', async () => {
      const inputPosition = new vscode.Position(2, 62);
      const expectedFile = workspaceFilePath('foo.component.ts');
      const expectedPosition = new vscode.Position(7, 11);

      await assertGoToDefinition(templateFilePath, inputPosition, expectedFile, expectedPosition);
    });
    
    test('from output attribute', async () => {
      const inputPosition = new vscode.Position(2, 86);
      const expectedFile = workspaceFilePath('foo.component.ts');
      const expectedPosition = new vscode.Position(15, 2);

      await assertGoToDefinition(templateFilePath, inputPosition, expectedFile, expectedPosition);
    });
    
    test('from structural attribute', async () => {
      const inputPosition = new vscode.Position(4, 15);
      const expectedFile = workspaceFilePath('foo.component.ts');
      const expectedPosition = new vscode.Position(19, 2);

      await assertGoToDefinition(templateFilePath, inputPosition, expectedFile, expectedPosition);
    });
  });

  test('should resolve constructors public parameter', async () => {
    const inputPosition = new vscode.Position(7, 7);
    const expectedFile = workspaceFilePath('foo.component.ts');
    const expectedPosition = new vscode.Position(9, 21);

    await assertGoToDefinition(templateFilePath, inputPosition, expectedFile, expectedPosition);
  });
});
