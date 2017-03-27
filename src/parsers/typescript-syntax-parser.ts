import * as vscode from 'vscode';
import * as fs from 'fs';
import * as ts from 'typescript';
import * as path from 'path';

type FindNodePredicate = (node: ts.Node) => boolean;

export class TypescriptSyntaxParser {

  static async parseSourceFile(sourceFilePath: string): Promise<ts.SourceFile> {
    if (fs.existsSync(sourceFilePath)) {
      const document = await vscode.workspace.openTextDocument(sourceFilePath);
      const text = document.getText();
      return this.getSourceFile(sourceFilePath, text);
    }

    return null;
  }

  static findNode<T>(rootNode: ts.Node, predicate: FindNodePredicate, recursiveNodes?: ts.SyntaxKind[]): T {
    let result = null;
    ts.forEachChild(rootNode, (child) => {
      // Already found, skip.
      if (result) return;

      if (recursiveNodes && recursiveNodes.indexOf(child.kind) !== -1) {
        result = this.findNode(child, predicate, recursiveNodes)
      } else {
        result = predicate(child) ? child : null;
      }
    });

    return result;
  }

  static parsePosition(sourceFile: ts.SourceFile, position: number): vscode.Position {
    // Parse position
    const lineAndChar = ts.getLineAndCharacterOfPosition(sourceFile, position);
    if (!lineAndChar) return null;

    return new vscode.Position(lineAndChar.line, lineAndChar.character);
  }

  static getSourceFile(fileName: string, source: string) {
    let sourceFile: ts.SourceFile = this.decompileFile(fileName, source);
    if (sourceFile === undefined) {
      const INVALID_SOURCE_ERROR = `Invalid source file: ${fileName}. Ensure that the files supplied to lint have a .ts, .tsx, .js or .jsx extension.`;
      throw new Error(INVALID_SOURCE_ERROR);
    }
    return sourceFile;
  }

  static decompileFile(fileName: string, source: string): ts.SourceFile {
    const normalizedName = path.normalize(fileName).replace(/\\/g, '/');
    const compilerOptions = {
      allowJs: true,
      noResolve: true,
      target: ts.ScriptTarget.ES5,
    };

    const compilerHost: ts.CompilerHost = {
      fileExists: () => true,
      getCanonicalFileName: (filename: string) => filename,
      getCurrentDirectory: () => "",
      getDefaultLibFileName: () => "lib.d.ts",
      getDirectories: (_path: string) => [],
      getNewLine: () => "\n",
      getSourceFile: (filenameToGet: string) => {
        const target = compilerOptions.target == null ? ts.ScriptTarget.ES5 : compilerOptions.target;
        return ts.createSourceFile(filenameToGet, source, target, true);
      },
      readFile: (x: string) => x,
      useCaseSensitiveFileNames: () => true,
      writeFile: (x: string) => x,
    };

    const program = ts.createProgram([normalizedName], compilerOptions, compilerHost);
    return program.getSourceFile(normalizedName);
  }
}
