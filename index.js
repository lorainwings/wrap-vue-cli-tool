#!/usr/bin/env node

'use strict';
/**
 *  A command line tool to help vue-server-cli build projects
 */
const argvs = process.argv.slice(2);
const buildTask = require('./bin/build.js');
const selectTask = require('./bin/serve.js');
const createTask = require('./bin/start.js');
/**
 * Client interfaces
 */
if (argvs[0] === 'build') {
  buildTask();
} else if (argvs[0] === 'serve') {
  selectTask();
} else if (argvs[0] === 'start') {
  createTask();
}
