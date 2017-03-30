import {
  CancellationToken, Position, DefinitionProvider,
  TextDocument, Definition, Location, Uri, workspace
} from 'vscode';
import * as fs from 'fs';
import * as ts from 'typescript';
import * as utils from '../utils';
import { TypescriptSyntaxParser } from '../parsers/typescript-syntax-parser';

export class AngularHtmlDefinitionProvider implements DefinitionProvider {

  async provideDefinition(document: TextDocument, position: Position, token: CancellationToken) {
    const lineText = document.lineAt(position).text;

    const regexps = [
      // Interpolation. ex: {{ myProp }}
      /({{)([^}]+)}}/g,

      // Input attributes. ex: [(...)]="myProp"
      /(\[\(?[\w\.\-?]*\)?\]=")([^"]+)"/g,

      // Output attributes. ex: (...)="myMethod(...)"
      /(\([\w\.]*\)=")([^"]+)"/g,

      // Structural attributes. ex: *ngIf="myProp"
      /(\*\w+=")([^"]+)"/g
    ];
    const expressionMatch: string = utils.parseByLocationRegexps(lineText, position.character, regexps);
    if (!expressionMatch) return null;

    const range = document.getWordRangeAtPosition(position, /[$\w]+/);
    if (!range) return null;

    const propertyName = document.getText(range);
    const componentFilePath = document.fileName.substr(0, document.fileName.lastIndexOf('.')) + '.ts';

    const sourceFile = await TypescriptSyntaxParser.parseSourceFile(componentFilePath);
    if (!sourceFile) return null;

    const recursiveSyntaxKinds = [ts.SyntaxKind.ClassDeclaration, ts.SyntaxKind.Constructor];
    const foundNode = TypescriptSyntaxParser.findNode<ts.Declaration>(sourceFile, (node) => {
      let declaration = node as ts.Declaration;
      switch (node.kind) {
        case ts.SyntaxKind.PropertyDeclaration:
        case ts.SyntaxKind.MethodDeclaration:
        case ts.SyntaxKind.GetAccessor:
        case ts.SyntaxKind.SetAccessor:
          return declaration.name.getText() === propertyName;
        case ts.SyntaxKind.Parameter:
          const publicAccessor = TypescriptSyntaxParser.findNode(node, (cn) => cn.kind === ts.SyntaxKind.PublicKeyword);
          return node.parent.kind == ts.SyntaxKind.Constructor
            && declaration.name.getText() === propertyName
            && !!publicAccessor;
      }

      return false;
    }, recursiveSyntaxKinds);

    if (!foundNode) return null;

    const declarationPos = TypescriptSyntaxParser.parsePosition(sourceFile, foundNode.name.getStart());
    if (!declarationPos) return null;

    return new Location(Uri.file(componentFilePath), declarationPos);
  }
}