// Copyright Red Hat
'use strict';

const RH_INSIGHTS_VERSION = "0.1.0";

const debug = require('util').debuglog('rh-insights');
const { createWriteStream } = require('fs');
const path = require('path');
let constantData = { rhInsightsVersion: RH_INSIGHTS_VERSION };
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
    const file = path.join(uploadArchiveDir, "insights-data.json");
    fs.mkdir(uploadArchiveDir, { recursive: true }, (err) => {
      if (err) throw err;
      const stream = createWriteStream(file, { encoding: 'utf8' });
      stream.end(data);
    });
  }
}

function initializeInsights() {
  const { processId, commandLine, nodejsVersion, arch } = process.report.getReport().header;
  constantData = { ...constantData, processId, commandLine, nodejsVersion, arch };
  uploadArchiveDir = process.env['RHT_INSIGHTS_JS_ARCHIVE_UPLOAD_DIR'];
  initializeImmediate = setImmediate(() => { writeInsightsData(); });
  process.once('beforeExit', () => { clearImmediate(initializeImmediate); });
};

module.exports = {
  initializeInsights,
};
