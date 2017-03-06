import {
  CancellationToken, Position, DefinitionProvider,
  TextDocument, Definition, Location, Uri, workspace
} from 'vscode';
import * as path from 'path';
import * as fs from 'fs';
import * as ts from 'typescript';

export class AngularDefinitionHtmlProvider implements DefinitionProvider {

  provideDefinition(document: TextDocument, position: Position, token: CancellationToken) {
    const lineText = document.lineAt(position).text;
    
    let propertyName: string;

    // Parse interpolation
    if (!propertyName) propertyName = this.parseByRegexp(lineText, position, /{{\s*(\w+)[\.\s\w]*}}/g);

    // Parse attribute
    if (!propertyName) propertyName = this.parseByRegexp(lineText, position, /\[[\w\.\-?]*\]=\"!?(\w+)[\.\w]*\"/g);

    if (propertyName)
    {
      const componentFilePath = document.fileName.substr(0, document.fileName.lastIndexOf('.')) + '.ts';
      console.log('## Potential findings ##');
      console.log('Property name: ' + propertyName);
      console.log('Component: ' + componentFilePath);

      if (fs.existsSync(componentFilePath)) {
        return workspace.openTextDocument(componentFilePath).then((document) => {
          const text = document.getText();
          const sourceFile = this.getSourceFile(componentFilePath, text);
          const position = this.getPropertyPosition(sourceFile, propertyName);
          return position ? new Location(Uri.file(componentFilePath), position) : null;
        });
      }
    }

    return null;
  }

  private parseByRegexp(text: string, position: Position, regexp: RegExp) {
    const pos = position.character - 1;
    let propertyName: string = null;
    let match: RegExpMatchArray;
    while (match = regexp.exec(text)) {
      if (match.index <= pos && regexp.lastIndex >= pos) {
        propertyName = match[1];
      }
    }

    return propertyName;
  }

  private getPropertyPosition(sourceFile: ts.SourceFile, propertyName: string): Position {
    const property = this.visitNode(sourceFile, propertyName);
    if (!property) return null;

    const position = ts.getLineAndCharacterOfPosition(sourceFile, property.name.end);
    if (!position) return null;

    return new Position(position.line, position.character);
  }

  private visitNode(node: ts.Node, propertyName: string): ts.PropertyDeclaration {
    switch (node.kind) {
      case ts.SyntaxKind.SourceFile:
        return this.walkChildren(node as ts.SourceFile, propertyName);
      case ts.SyntaxKind.ClassDeclaration:
        return this.walkChildren(node as ts.ClassDeclaration, propertyName);
      case ts.SyntaxKind.PropertyDeclaration:
        let property = node as ts.PropertyDeclaration;
        if (property.name.getText() === propertyName) return property;
        break;
    }

    return null;
  }

  private walkChildren(node: ts.Node, propertyName): ts.PropertyDeclaration {
    let result: ts.PropertyDeclaration = null;
    ts.forEachChild(node, (child) => {
      const found = this.visitNode(child, propertyName);
      if (found) result = found;
    });
    return result;
  }

  private getSourceFile(fileName: string, source: string) {
    let sourceFile: ts.SourceFile = this.decompileFile(fileName, source);
    if (sourceFile === undefined) {
      const INVALID_SOURCE_ERROR = `Invalid source file: ${fileName}. Ensure that the files supplied to lint have a .ts, .tsx, .js or .jsx extension.`;
      throw new Error(INVALID_SOURCE_ERROR);
    }
    return sourceFile;

  }

  private decompileFile(fileName: string, source: string): ts.SourceFile {
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