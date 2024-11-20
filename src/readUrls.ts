// @ts-ignore -- req
import readline from "linebyline";

export async function readUrls(sourceFile: string): Promise<string[]> {
  return new Promise((resolve) => {
    const urls: string[] = [];

    const rl = readline(sourceFile);

    rl.on("line", (line: string) => {
      try {
        new URL(line);

        urls.push(line.toString());
      } catch (_) {}
    });

    rl.on("end", () => {
      // eslint-disable-next-line no-console -- required
      console.log(`Found ${urls.length} URLs in the source file`);
      resolve(urls);
    });

    rl.on("error", (err: unknown) => {
      console.error(err);
      process.exit(1);
    });
  });
}
