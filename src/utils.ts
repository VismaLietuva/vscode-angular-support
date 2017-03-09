import { Position } from 'vscode';

/**
 * Parse word by regexp and location. Only works with one match group.
 * @param text - Text to parse from.
 * @param position - Position used in case of multiple occurrences.
 * @param regexp - Regexp to match.
 */
export function parseByLocationRegexp(text: string, position: number, regexp: RegExp) {
  let propertyName: string = null;
  let match: RegExpMatchArray;
  while (match = regexp.exec(text)) {
    // Check if position is in whole regexp match
    if (match.index <= position && regexp.lastIndex >= position) {
      // Check if position is in concrete first group match
      const matchedGroupIndex = match.index + match[0].indexOf(match[1]);
      const matchedGroupLastIndex = matchedGroupIndex + match[1].length;
      if (matchedGroupIndex <= position && matchedGroupLastIndex >= position)
      {
        propertyName = match[1];
      }
    }
  }

  return propertyName;
}
