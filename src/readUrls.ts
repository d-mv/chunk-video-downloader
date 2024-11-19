import { createReadStream } from "node:fs";
import { URL } from "node:url";

export async function readUrls(sourceFile: string): Promise<string[]> {
  return new Promise((resolve) => {
    const urls: string[] = [];

    const readStream = createReadStream(sourceFile, {
      encoding: "utf8",
      mode: 0o666, // 0o666 is the default value
    }).on("data", (chunk: string) => {
      const lines = chunk.split(/\r?\n/);

      for (const line of lines) {
        try {
          const url = new URL(line);

          urls.push(url.toString());
        } catch (_) {
          continue;
        }
      }
    });

    readStream.on("end", () => {
      // eslint-disable-next-line no-console -- required
      console.log(`Found ${urls.length} URLs in the source file`);
      resolve(urls);
    });

    readStream.on("error", (err) => {
      console.error(err);
      process.exit(1);
    });
  });
}
