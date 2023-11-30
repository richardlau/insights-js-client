// Copyright Red Hat
import test from 'node:test';
import assert from 'node:assert';
import { spawnSync } from 'node:child_process';

test('client code is loaded', () => {
  const opts = {
    encoding: 'utf8',
    env: { ...process.env, 'NODE_DEBUG': 'rh-insights' },
  }
  const cp = spawnSync(process.execPath, [ '-p', '"hello"' ], opts);
  assert.match(cp.stderr, /RH-INSIGHTS .+: Red Hat Insights/);
  assert.strictEqual(cp.status, 0);
});
