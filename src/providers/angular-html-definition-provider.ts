import {
  CancellationToken, Position, DefinitionProvider,
  TextDocument, Definition, Location, Uri, workspace
} from 'vscode';
import * as fs from 'fs';
import * as ts from 'typescript';
import * as utils from '../utils';
import { TypescriptSyntaxParser } from '../parsers/typescript-syntax-parser';

export class AngularHtmlDefinitionProvider implements DefinitionProvider {

  provideDefinition(document: TextDocument, position: Position, token: CancellationToken) {
    const lineText = document.lineAt(position).text;

    const regexps = [
      // Interpolation. ex: {{ myProp }}
      /{{\s*(\w+)[\.\s\w]*}}/g,

      // Input attributes. ex: [...]="myProp"
      /\[\(?[\w\.\-?]*\)?\]=\"!?(\w+)[\.\w]*\"/g,

      // Output attributes. ex: (...)="myMethod(...)"
      /\([\w\.]*\)=\"(\w+)\([\S]*\)\"/g
    ];
    let propertyName: string = utils.parseByLocationRegexps(lineText, position.character, regexps);

    const componentFilePath = document.fileName.substr(0, document.fileName.lastIndexOf('.')) + '.ts';
    
    const possibleSyntaxKinds = [
      ts.SyntaxKind.PropertyDeclaration,
      ts.SyntaxKind.MethodDeclaration,
      ts.SyntaxKind.GetAccessor,
      ts.SyntaxKind.SetAccessor,
    ];
    return TypescriptSyntaxParser.parse(componentFilePath, propertyName, ...possibleSyntaxKinds);
  }
}