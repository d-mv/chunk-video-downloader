import { createWriteStream, unlinkSync } from "node:fs";
import { Args } from "./arguments";
import { addFile } from "./async";
import { clearStaticMessaging, writeOnTheSameLine } from "./log";

function removeFiles(fileNames: string[]) {
  for (const fileName of fileNames) {
    unlinkSync(fileName);
  }
}

export async function stitch(args: Args, fileNames: string[]) {
  const writableStream = createWriteStream(
    `${args.targetFolder}/${args.targetFileName}`,
  );

  const staticMessage = "Stitching file: ";

  process.stdout.write(staticMessage);

  for await (const fileName of fileNames.sort(
    (a, b) => parseInt(a) - parseInt(b),
  )) {
    writeOnTheSameLine(staticMessage.length, fileName);
    await addFile(fileName, writableStream);
  }

  clearStaticMessaging();

  writableStream.end();

  removeFiles(fileNames);
}
