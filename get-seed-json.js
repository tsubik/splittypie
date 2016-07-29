#!/usr/bin/env node

const dumpName = process.argv[2];
const dump = require(`./tests/fixtures/${dumpName}`).default;

console.log(JSON.stringify(dump));
