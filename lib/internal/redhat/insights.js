// Copyright Red Hat
'use strict';

const RH_INSIGHTS_VERSION = "0.1.0";

const debug = require('util').debuglog('rh-insights');
const { createWriteStream } = require('fs');
let constantData = { rhInsightsVersion: RH_INSIGHTS_VERSION };
let initializeImmediate;

function writeInsightsData() {
  const date = new Date().toISOString();
  const data = JSON.stringify({ date, ...constantData});
  const file = "insights-data.json";
  if (debug.enabled) {
    debug(`Red Hat Insights ${RH_INSIGHTS_VERSION}`);
    debug(`Payload ${data}`);
    debug(`paths ${module.paths}`);
  }
  const stream = createWriteStream(file, { encoding: 'utf8' });
  stream.end(data);
}

function initializeInsights() {
  const { processId, commandLine, nodejsVersion, arch } = process.report.getReport().header;
  constantData = { ...constantData, processId, commandLine, nodejsVersion, arch };
  initializeImmediate = setImmediate(() => { writeInsightsData(); });
  process.once('beforeExit', () => { clearImmediate(initializeImmediate); });
};

module.exports = {
  initializeInsights,
};
