'use strict';

import { ExtensionContext, DocumentFilter, languages } from 'vscode';
import { AngularDefinitionProvider } from './angular-definition-provider';

export function activate(context: ExtensionContext) {
  console.log('Congratulations, your extension "vscode-angular-editor" is now active!');

  const angularFilter: DocumentFilter[] = [
    { language: 'typescript', scheme: 'file' },
    { language: 'javascript', scheme: 'file' },
  ];
  context.subscriptions.push(languages.registerDefinitionProvider(angularFilter, new AngularDefinitionProvider()));
}

// this method is called when your extension is deactivated
export function deactivate() {
}