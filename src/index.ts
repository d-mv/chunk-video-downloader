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
    await validateArgPaths(args.unwrap());

    const urls = await readUrls(args.unwrap().sourceFile);

    const r = await download(urls, args.unwrap());

    await stitch(args.unwrap(), r);

    // eslint-disable-next-line no-console
    console.log("All done.");
  }
})();

// read urls from file (identify, verify)
//  download to target folder
//  join files
//  remove source files
