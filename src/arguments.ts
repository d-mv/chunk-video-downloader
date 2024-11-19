import { Err, Ok, Result } from "@sniptt/monads";

export type Args = {
  sourceFile: string;
  targetFolder: string;
  targetFileName: string;
  overwrite: boolean;
};

const ARGUMENTS = ["-s", "-t", "-f", "-o"];

export function getArguments(): Result<Args, Error> {
  const externalArguments = process.argv.slice(2);

  if (externalArguments.length < 2) {
    // eslint-disable-next-line no-console -- required
    console.log(`
    Usage: node index.js -s source-folder -t target-folder -f target-file-name -o, where:

    -s - source file with links, required
    -t - target folder
    -f - target file name
    -o - overwrite existing target file

    `);

    process.exit(0);
  }

  const args: Args = {
    targetFileName: "",
    targetFolder: "",
    sourceFile: "",
    overwrite: false,
  };

  const sourceFileArgument = externalArguments.indexOf("-s");

  if (sourceFileArgument === -1)
    return Err(new Error("Source file is not defined"));
  else args.sourceFile = externalArguments[sourceFileArgument + 1] ?? "";

  const targetFolderArgument = externalArguments.indexOf("-t");

  const targetFileNameArgument = externalArguments.indexOf("-f");

  const overwriteArgument = externalArguments.indexOf("-o");

  if (targetFolderArgument < 0)
    return Err(new Error("Target folder is not defined"));
  else {
    const targetFolder = externalArguments[targetFolderArgument + 1];

    if (targetFolder && !ARGUMENTS.includes(targetFolder))
      args.targetFolder = targetFolder;
  }

  if (targetFileNameArgument < 0) args.targetFileName = "video.ts";
  else {
    const targetFileName = externalArguments[targetFileNameArgument + 1];

    if (targetFileName && !ARGUMENTS.includes(targetFileName))
      args.targetFileName = targetFileName;
    else args.targetFileName = "video.ts";
  }

  if (overwriteArgument > 0) args.overwrite = true;

  return Ok(args);
}
