// Copyright Red Hat
import test from 'node:test';
import assert from 'node:assert';
import { spawnSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

test('client code is loaded', () => {
  const opts = {
    encoding: 'utf8',
    env: { ...process.env, 'NODE_DEBUG': 'rh-insights' },
  }
  const cp = spawnSync(process.execPath,
    [ '-e', `require('${path.join(__dirname, "../../lib/internal/redhat/insights.js")}').initializeInsights();` ],
    opts);
  assert.match(cp.stderr, /RH-INSIGHTS .+: Red Hat Insights/);
  assert.strictEqual(cp.status, 0);
});
