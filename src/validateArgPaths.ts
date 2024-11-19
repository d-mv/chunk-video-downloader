import { existsSync, mkdir, unlinkSync } from "fs";
import { Args } from "./arguments";

export function validateArgPaths(args: Args) {
  return new Promise((resolve) => {
    const checkIfSourceFileExists = existsSync(`${args.sourceFile}`);

    // should exist!
    if (!checkIfSourceFileExists) {
      console.error(`File ${args.sourceFile} does not exist`, "\n");
      process.exit(1);
    }

    const checkIfTargetFolderExists = existsSync(`${args.targetFolder}`);

    if (!checkIfTargetFolderExists) {
      console.warn(
        `Folder ${args.targetFolder} does not exist, creating...`,
        "\n",
      );

      mkdir(args.targetFolder, { recursive: true }, (err) => {
        if (err) {
          console.error(err);
          process.exit(1);
        }
      });
    }

    const checkIfTargetFileExists = existsSync(
      `${args.targetFolder}/${args.targetFileName}`,
    );

    //  should NOT exist
    if (checkIfTargetFileExists) {
      if (args.overwrite) {
        unlinkSync(`${args.targetFolder}/${args.targetFileName}`);
      } else {
        console.error(
          `File ${args.targetFileName} already exists in ${args.targetFolder} folder`,
          "\n",
        );

        process.exit(1);
      }
    }

    resolve(true);
  });
}
