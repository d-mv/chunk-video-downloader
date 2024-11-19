import { AxiosResponse } from "axios";
import { createWriteStream } from "fs";
import { AnyValue } from "./types";

export async function saveFile(
  response: AxiosResponse<AnyValue, unknown>,
  outputLocationPath: string,
  cb: () => void,
) {
  const writer = createWriteStream(outputLocationPath);

  return new Promise((resolve, reject) => {
    response.data.pipe(writer);
    let error: Error | null = null;
    writer.on("error", (err) => {
      error = err;
      writer.close();
      reject();
    });

    writer.on("close", () => {
      if (!error) {
        cb();
        resolve(true);
      }
      // no need to call the reject here, as it will have been called in the
      // 'error' stream;
    });
  });
}
