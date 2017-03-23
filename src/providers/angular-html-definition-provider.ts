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
      /{{(.*)}}/g,

      // Input attributes. ex: [(...)]="myProp"
      /\[\(?[\w\.\-?]*\)?\]=\"(.*)"/g,

      // Output attributes. ex: (...)="myMethod(...)"
      /\([\w\.]*\)=\"(.*)\"/g,

      // Structural attributes. ex: *ngIf="myProp"
      /\*\w+=\"(.*)\"/g
    ];
    let expressionMatch: string = utils.parseByLocationRegexps(lineText, position.character, regexps);
    if (!expressionMatch) return false;

    let range = document.getWordRangeAtPosition(position);
    if (!range) return false;

    let propertyName = document.getText(range);

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