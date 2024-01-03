// Copyright Red Hat
import assert from 'node:assert';

const expectedTypes = new Map([
  [ 'arch', 'string' ],
  [ 'commandLine', 'object' ],
  [ 'date', 'string' ],
  [ 'id', 'string' ],
  [ 'nodejsVersion', 'string' ],
  [ 'processId', 'number' ],
  [ 'startTime', 'number' ],
  [ 'rhInsightsVersion', 'string' ],
]);

function validate(stringData) {
  // type checks
  for (const [ name, type ] of expectedTypes) {
    assert.strictEqual(typeof stringData[name], type, `typeof ${name}`);
  }
}

export default { validate };
