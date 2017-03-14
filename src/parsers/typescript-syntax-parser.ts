import * as vscode from 'vscode';
import * as fs from 'fs';
import * as ts from 'typescript';
import * as path from 'path';

export class TypescriptSyntaxParser {

  static async parse(sourceFilePath: string, nodeName: string, ...nodeKind: ts.SyntaxKind[]) {
    if (!nodeName) return;
    
    if (fs.existsSync(sourceFilePath)) {
      const document = await vscode.workspace.openTextDocument(sourceFilePath);
      const text = document.getText();
      const sourceFile = this.getSourceFile(sourceFilePath, text);
      const position = this.getNodePosition(sourceFile, nodeName, ...nodeKind);
      return position ? new vscode.Location(vscode.Uri.file(sourceFilePath), position) : null;
    }

    return null;
  }

  static getNodePosition(sourceFile: ts.SourceFile, nodeName: string, ...nodeKind: ts.SyntaxKind[]): vscode.Position {
    // Find node by its name and kind
    const node = this.findNode(sourceFile, nodeName, nodeKind);
    if (!node) return null;

    // Parse position
    const position = ts.getLineAndCharacterOfPosition(sourceFile, node.name.end);
    if (!position) return null;

    return new vscode.Position(position.line, position.character);
  }

  static findNode(sourceNode: ts.Node, nodeName: string, nodeKind: ts.SyntaxKind[]) {
    if (nodeKind.indexOf(sourceNode.kind) === -1) {
      return this.walkChildren(sourceNode, nodeName, nodeKind);
    }

    switch (sourceNode.kind) {
      case ts.SyntaxKind.PropertyDeclaration:
      case ts.SyntaxKind.MethodDeclaration:
      case ts.SyntaxKind.GetAccessor:
      case ts.SyntaxKind.SetAccessor:
        let declaration = sourceNode as ts.ClassElement;
        if (declaration.name.getText() === nodeName) return declaration;
        break;
      default:
        throw `Search node by '${sourceNode.kind}' type is not supported in syntax-walker.`;
    }

    return null;
  }

  static walkChildren(node: ts.Node, nodeName: string, nodeKind: ts.SyntaxKind[]) {
    let result = null;
    ts.forEachChild(node, (child) => {
      const found = this.findNode(child, nodeName, nodeKind);
      if (found) result = found;
    });
    return result;
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
