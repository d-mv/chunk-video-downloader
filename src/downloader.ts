import axios, { AxiosResponse } from "axios";
import path from "path";
import { Args } from "./arguments";
import { clearStaticMessaging, writeOnTheSameLine } from "./log";
import { saveFile } from "./saveFile";
import { AnyValue } from "./types";

let counter = 0;

const staticMessage = "Progress: ";

let urlsToDownload: string[] = [];

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
  return await axios({
    method: "get",
    url: fileUrl,
    responseType: "stream",
  });
}

function getPath(args: Args, url: string) {
  const fileName = (url.split("/").pop()?.split("?")[0]?.split(".")[0] +
    ".ts") as string;

  const filePath = path.join(args.targetFolder, fileName);

  return filePath;
}

export async function download(urls: string[], args: Args) {
  // download promises
  const promises: Promise<AxiosResponse<AnyValue, unknown>>[] = [];

  // urls that have been added
  const urlsAdded: string[] = [];

  urlsToDownload = urls;

  // create download promises
  urlsToDownload.forEach((url) => {
    promises.push(downloadFile(url));
    urlsAdded.push(url);
  });

  const results = await Promise.all(promises);

  // eslint-disable-next-line no-console -- required
  console.log("Files downloaded.");
  process.stdout.write(staticMessage);

  await Promise.all(
    results.map((result, index) => {
      return saveFile(
        result,
        getPath(args, String(urlsAdded[index])),
        anotherOne,
      );
    }),
  );

  clearStaticMessaging();

  // eslint-disable-next-line no-console -- required
  console.log("Files saved.");

  return urlsToDownload.map((url) => {
    return path.join(
      args.targetFolder,
      (url.split("/").pop()?.split("?")[0]?.split(".")[0] + ".ts") as string,
    );
  });
}
