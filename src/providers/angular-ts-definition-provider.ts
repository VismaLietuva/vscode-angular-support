import {
  CancellationToken, Position, DefinitionProvider,
  TextDocument, Definition, Location, Uri
} from 'vscode';
import * as path from 'path';
import * as fs from 'fs';

export class AngularTsDefinitionProvider implements DefinitionProvider {

  provideDefinition(document: TextDocument, position: Position, token: CancellationToken): Definition {
    // Apply this provider only on specific lines
    const linesFilter = ['templateUrl', 'styleUrls'];
    const lineText = document.lineAt(position).text;
    if (linesFilter.every(l => lineText.indexOf(l) === -1)) {
      return null;
    }

    // Parse potential file name
    const fileNameRegex = /([\w\.\/\-]+)/;
    const potentialFileNameRange = document.getWordRangeAtPosition(position, fileNameRegex);
    if (!potentialFileNameRange) {
      return null;
    }

    const potentialFileName = document.getText(potentialFileNameRange);
    const workingDir = path.dirname(document.fileName);
    const fullPath = path.resolve(workingDir, potentialFileName);

    if (fs.existsSync(fullPath)) {
      return new Location(Uri.file(fullPath), new Position(0, 0));
    }

    return null;
  }
}