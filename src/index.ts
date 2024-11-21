import { getArguments } from "./arguments";
import { download } from "./downloader";
import { readUrls } from "./readUrls";
import { stitch } from "./stitch";
import { validateArgPaths } from "./validateArgPaths";

(async function main() {
  const args = getArguments();

  if (args.isErr()) {
    console.error(args.unwrapErr().message, "\n");
    process.exit(0);
  } else {
    const argsToUse = await validateArgPaths(args.unwrap());

    const urls = await readUrls(argsToUse.sourceFile);

    const r = await download(urls, argsToUse);

    await stitch(argsToUse, r);

    // eslint-disable-next-line no-console
    console.log("All done.");
  }
})();
