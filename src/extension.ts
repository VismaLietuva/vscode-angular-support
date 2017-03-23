'use strict';

import { ExtensionContext, DocumentFilter, languages } from 'vscode';
import { AngularTsDefinitionProvider } from './providers/angular-ts-definition-provider';
import { AngularHtmlDefinitionProvider } from './providers/angular-html-definition-provider';

export function activate(context: ExtensionContext) {
  console.log('Congratulations, extension "vscode-angular-support" is now active!');

  context.subscriptions.push(languages.registerDefinitionProvider(
    { language: 'typescript', scheme: 'file' },
    new AngularTsDefinitionProvider()
  ));

  context.subscriptions.push(languages.registerDefinitionProvider(
    { language: 'html', scheme: 'file' },
    new AngularHtmlDefinitionProvider()
  ));
}

export function deactivate() { }