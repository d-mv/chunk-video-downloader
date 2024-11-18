export type Args = {
  sourceFolder: string;
  targetFolder: string;
  targetFileName: string;
  overwrite: boolean;
};

const ARGUMENTS = ['-s', '-t', '-f', '-o'];

export function getArguments(): Args {
  const customArguments = process.argv.slice(2);

  if (customArguments.length < 2) throw new Error('Not enough arguments');

  const args: Args = { targetFileName: '', targetFolder: '', sourceFolder: '', overwrite: false };

  const sourceFolderArgument = customArguments.indexOf('-s');

  if (sourceFolderArgument === -1) throw new Error('Source folder is not defined');

  const targetFolderArgument = customArguments.indexOf('-t');

  const targetFileNameArgument = customArguments.indexOf('-f');

  const overwriteArgument = customArguments.indexOf('-o');

  const sourceFolder = customArguments[sourceFolderArgument + 1];

  if (sourceFolder) args.sourceFolder = sourceFolder;
  else throw new Error('Source folder is not defined');

  if (targetFolderArgument < 0) args.targetFolder = args.sourceFolder;
  else {
    const targetFolder = customArguments[targetFolderArgument + 1];

    if (targetFolder && !ARGUMENTS.includes(targetFolder)) args.targetFolder = targetFolder;
    else args.targetFolder = args.sourceFolder;
  }

  if (targetFileNameArgument < 0) args.targetFileName = 'output.ts';
  else {
    const targetFileName = customArguments[targetFileNameArgument + 1];

    if (targetFileName && !ARGUMENTS.includes(targetFileName)) args.targetFileName = targetFileName;
    else args.targetFileName = 'output.ts';
  }

  if (overwriteArgument > 0) args.overwrite = true;

  return args;
}
