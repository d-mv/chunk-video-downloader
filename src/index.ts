#!/usr/bin/env node

import { createWriteStream, readdirSync } from 'node:fs';
import process from 'node:process';

import { getArguments } from './arguments';
import { addFile } from './async';
import { checkExistingOutputFile } from './check';
import { writeOnTheSameLine } from './log';

const IGNORED_FILES = ['.DS_Store'];

(async function main() {
  const args = getArguments();

  await checkExistingOutputFile(args);

  const fileNames: string[] = [];

  readdirSync(args.sourceFolder).forEach(file => {
    if (!IGNORED_FILES.includes(file)) fileNames.push(file);
  });

  // eslint-disable-next-line no-console
  console.log(`Found ${fileNames.length} files in ${args.sourceFolder}`);

  const writableStream = createWriteStream(`${args.targetFolder}/${args.targetFileName}`);

  const staticMessage = 'Processing file: ';

  process.stdout.write(staticMessage);

  for await (const fileName of fileNames.sort((a, b) => parseInt(a) - parseInt(b))) {
    writeOnTheSameLine(staticMessage.length, fileName);
    await addFile(`${args.sourceFolder}/${fileName}`, writableStream);
  }

  // eslint-disable-next-line no-console
  console.log(`\nI am done! Joined ${fileNames.length} files into ${args.targetFileName}`);
  writableStream.end();
})();
