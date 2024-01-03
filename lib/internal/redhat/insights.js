// Copyright Red Hat
'use strict';

const RH_INSIGHTS_VERSION = "0.2.0";

const debug = require('util').debuglog('rh-insights');
const { createWriteStream, mkdir } = require('fs');
const path = require('path');
const uuid = require('crypto').randomUUID();
let constantData = { id: uuid, rhInsightsVersion: RH_INSIGHTS_VERSION };
let initializeImmediate;
let uploadArchiveDir;

function writeInsightsData() {
  const date = new Date().toISOString();
  const data = JSON.stringify({ date, ...constantData});
  if (debug.enabled) {
    debug(`Red Hat Insights ${RH_INSIGHTS_VERSION}`);
    debug(`Payload ${data}`);
  }
  if (uploadArchiveDir) {
    const file = path.join(uploadArchiveDir, `${uuid}_connect.json`);
    try {
      mkdir(uploadArchiveDir, { recursive: true }, (err) => {
        if (err) {
          if (debug.enabled) {
            debug(`Error writing '${file}': ${err}`);
          }
          return;
        }
        const stream = createWriteStream(file, { encoding: 'utf8' });
        stream.once('error', (err) => {
          if (debug.enabled) {
            debug(`Error writing '${file}': ${err}`);
          }
        });
        stream.end(data);
      });
    } catch (err) {
      if (debug.enabled) {
        debug(`Error writing '${file}': ${err}`);
      }
    }
  }
}

function initializeInsights() {
  if (initializeImmediate) return;
  const startTime = Date.now();
  const { processId, commandLine, nodejsVersion, arch } = process.report.getReport().header;
  constantData = { ...constantData, processId, commandLine, nodejsVersion, arch, startTime };
  uploadArchiveDir = process.env['RHT_INSIGHTS_JS_ARCHIVE_UPLOAD_DIR'];
  initializeImmediate = setImmediate(() => { writeInsightsData(); });
  process.once('beforeExit', () => { clearImmediate(initializeImmediate); });
  return uuid;
};

module.exports = {
  initializeInsights,
};
