import axios, { AxiosResponse } from "axios";
import path from "path";
import { Args } from "./arguments";
import { clearStaticMessaging, writeOnTheSameLine } from "./log";
import { saveFile } from "./saveFile";
import { AnyValue } from "./types";

let counter = 0;

const staticMessage = "Progress: ";

const urlsToDownload: string[] = [];

function anotherOne() {
  counter += 1;
  writeOnTheSameLine(
    staticMessage.length,
    `${counter} files saved of ${urlsToDownload.length}`,
  );
}

async function downloadFile(
  fileUrl: string,
): Promise<AxiosResponse<AnyValue, unknown>> {
  return axios({
    method: "get",
    url: fileUrl,
    responseType: "stream",
    timeout: 4000,
  });
}

function getPath(args: Args, url: string) {
  const fileName = (url.split("/").pop()?.split("?")[0]?.split(".")[0] +
    ".ts") as string;

  const filePath = path.join(args.targetFolder, fileName);

  return filePath;
}

export async function download(urls: string[], args: Args) {
  process.stdout.write(staticMessage);

  for await (const url of urls) {
    const r = await downloadFile(url);

    await saveFile(r, getPath(args, url), anotherOne);
  }

  clearStaticMessaging();
  // eslint-disable-next-line no-console -- required
  console.log("Files downloaded.");

  // eslint-disable-next-line no-console -- required
  console.log("Files saved.");

  return urlsToDownload.map((url) => {
    return path.join(
      args.targetFolder,
      (url.split("/").pop()?.split("?")[0]?.split(".")[0] + ".ts") as string,
    );
  });
}
