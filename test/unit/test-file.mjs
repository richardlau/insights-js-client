// Copyright Red Hat
import { afterEach, beforeEach, test } from 'node:test';
import assert from 'node:assert';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import utils from '../common/utils.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const expectedClientVersion = JSON.parse(await fs.readFile(path.join(__dirname, '../../package.json'))).version;
let sandbox;
beforeEach(async () => {
  sandbox = await fs.mkdtemp(path.join(tmpdir(), 'rh-insights-test-'));
});
afterEach(async () => {
  if (sandbox) {
    await fs.rm(sandbox, { force: true, recursive: true });
  }
});

test('no files are written if RHT_INSIGHTS_JS_ARCHIVE_UPLOAD_DIR is unset', async () => {
  const opts = {
    encoding: 'utf8',
    env: { ...process.env },
  }
  delete opts.env.RHT_INSIGHTS_JS_ARCHIVE_UPLOAD_DIR;
  const cp = spawnSync(process.execPath,
    [ '-e', `require('${path.join(__dirname, "../../lib/internal/redhat/insights.js")}').initializeInsights();` ],
    opts);
  assert.strictEqual(cp.stderr, '');
  assert.strictEqual(cp.status, 0);
  const files = await fs.readdir(sandbox);
  assert.strictEqual(files.length, 0, `unexpected files found in ${sandbox}: ${files}`);
});
test('file is written', async () => {
  const opts = {
    encoding: 'utf8',
    env: { ...process.env, 'RHT_INSIGHTS_JS_ARCHIVE_UPLOAD_DIR': sandbox },
  }
  const cp = spawnSync(process.execPath,
    [ '-p', `require('${path.join(__dirname, "../../lib/internal/redhat/insights.js")}').initializeInsights();` ],
    opts);
  assert.strictEqual(cp.stderr, '');
  assert.strictEqual(cp.status, 0);
  const expectedUUID = cp.stdout.trim();
  const expectedFilename = `${expectedUUID}_connect.json`;
  const allFiles = await fs.readdir(sandbox);
  const files = allFiles.filter((f) => f === expectedFilename);
  // If the `node` binary running this test has the client embedded, we might get an extra file.
  for (const f of files) {
    assert.match(f, /^[\da-f]{8}-(?:[\da-f]{4}-){3}[\da-f]{12}_connect\.json/); // Expected filename.
  }
  assert.strictEqual(files.length, 1, `expected one file to be written. Found in ${sandbox}: [${allFiles}]`);

  const data = JSON.parse(await fs.readFile(path.join(sandbox, files[0])));
  assert.strictEqual(data.rhInsightsVersion, expectedClientVersion);
  assert.strictEqual(data.id, expectedUUID);
  assert.strictEqual(data.nodejsVersion, process.version);
  assert.strictEqual(data.arch, process.arch);
  utils.validate(data);
  assert(data.startTime <= data.reportTime);
  // Timestamps should be time in milliseconds since UNIX epoch.
  assert.strictEqual(new Date(data.startTime).valueOf(), data.startTime);
  assert.strictEqual(new Date(data.reportTime).valueOf(), data.reportTime);
});
test('upload dir cannot be created', async () => {
  const opts = {
    encoding: 'utf8',
    env: { ...process.env, 'RHT_INSIGHTS_JS_ARCHIVE_UPLOAD_DIR': '/dev/null' },
  }
  const cp = spawnSync(process.execPath,
    [ '-e', `require('${path.join(__dirname, "../../lib/internal/redhat/insights.js")}').initializeInsights();` ],
    opts);
  assert.strictEqual(cp.stderr, '');
  assert.strictEqual(cp.status, 0);
  const files = await fs.readdir(sandbox);
  assert.strictEqual(files.length, 0, `unexpected files found in ${sandbox}: ${files}`);
});

