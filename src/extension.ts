'use strict';

import { ExtensionContext, DocumentFilter, languages } from 'vscode';
import { AngularDefinitionTsProvider } from './angular-definition-ts-provider';
import { AngularDefinitionHtmlProvider } from './angular-definition-html-provider';

export function activate(context: ExtensionContext) {
  console.log('Congratulations, your extension "vscode-angular-editor" is now active!');

  context.subscriptions.push(languages.registerDefinitionProvider(
    { language: 'typescript', scheme: 'file' },
    new AngularDefinitionTsProvider()
  ));

  context.subscriptions.push(languages.registerDefinitionProvider(
    { language: 'html', scheme: 'file' },
    new AngularDefinitionHtmlProvider()
  ));
}

// this method is called when your extension is deactivated
export function deactivate() {
}