import { existsSync, unlinkSync } from 'fs';
import { Args } from './arguments';

export function checkExistingOutputFile(args: Args) {
  return new Promise(resolve => {
    const checkExisting = existsSync(`${args.targetFolder}/${args.targetFileName}`);

    if (checkExisting) {
      if (args.overwrite) {
        unlinkSync(`${args.targetFolder}/${args.targetFileName}`);
      } else {
        console.error(`File ${args.targetFileName} already exists in ${args.targetFolder} folder`);
        process.exit(1);
      }
    }

    resolve(true);
  });
}
