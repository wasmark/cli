#!/usr/bin/env node  
import yargs from 'yargs/yargs';
import { createApp } from './create-app';
import { Argv, storeArgv } from './argv';

const argv = yargs(process.argv.slice(2)).options({
  c: { type: 'array', aliias: 'contract' },
  d: { type: 'string', aliias: 'dir' },
  e: { type: 'string', aliias: 'endpoint' },
  m: { type: 'array', aliias: 'mnemonic' },
  p: { type: 'number', default: 4000, aliias: 'port' },
}).parseSync();

console.log('argv', argv);

function checkArgv(argv: Argv): boolean {
  return true
}

storeArgv({
  contractPaths: argv.c === undefined ? undefined : argv.c.map(c => `${c}`),
  contractsDir: argv.d,
  endpoint: argv.e,
  mnemonics: argv.m === undefined ? undefined : argv.m.map(m => `${m}`),
  port: argv.p,
  _: argv._,
  $0: argv.$0,
});

createApp(argv.p);