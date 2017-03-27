import { parseByLocationRegexp } from '../src/utils';
import * as assert from 'assert';

suite('Utils Tests', () => {
  suite('parseByLocationRegexp', () => { 
    test('should match group only in given position', () => {
      const regexp = /({{ )(\w+) }}/g;
      const input = '<span>{{ myVar1 }} {{ myVar2 }}</span>';

      assert.equal(parseByLocationRegexp(input, 8, regexp), null);
      assert.equal(parseByLocationRegexp(input, 10, regexp), 'myVar1');
      assert.equal(parseByLocationRegexp(input, 23, regexp), 'myVar2');
      assert.equal(parseByLocationRegexp(input, 29, regexp), null);
    });
  });
});