import { existsSync, mkdir, stat, unlinkSync } from "fs";
import { Args } from "./arguments";

export function validateArgPaths(args: Args) {
  const argsToUse = args;

  return new Promise<Args>((resolve) => {
    const checkIfSourceFileExists = existsSync(`${argsToUse.sourceFile}`);

    // should exist!
    if (!checkIfSourceFileExists) {
      console.error(`File ${argsToUse.sourceFile} does not exist`, "\n");
      process.exit(1);
    }

    stat(argsToUse.targetFolder, (err, stats) => {
      if (err || !stats?.isDirectory()) {
        console.warn(
          `Folder ${argsToUse.targetFolder} does not exist, creating...`,
          "\n",
        );

        // if (!stats.isDirectory()) {
        //   const folderName =
        //     (argsToUse.targetFolder.split("/").pop() || "unknown") + "_video";

        //   const path = argsToUse.targetFolder.split("/").slice(0, -1).join("/");

        //   argsToUse.targetFolder = path + "/" + folderName;
        // }

        mkdir(argsToUse.targetFolder, { recursive: true }, (err) => {
          if (err) {
            console.error(err);
            process.exit(1);
          }
        });
      }
    });

    const checkIfTargetFileExists = existsSync(
      `${argsToUse.targetFolder}/${args.targetFileName}`,
    );

    //  should NOT exist
    if (checkIfTargetFileExists) {
      if (argsToUse.overwrite) {
        unlinkSync(`${argsToUse.targetFolder}/${argsToUse.targetFileName}`);
      } else {
        console.error(
          `File ${argsToUse.targetFileName} already exists in ${argsToUse.targetFolder} folder`,
          "\n",
        );

        process.exit(1);
      }
    }

    resolve(argsToUse);
  });
}
