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

export function catchAsync(suite: (done: MochaDone) => any) {
  return async (done) => {
    try {
      await suite(done);
    } catch (e) {
      done(e);
    }
  }
}
