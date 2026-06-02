import { parseArgs, printHelp } from "./cli/cli";
import { createServer } from "./core/server";

const args = parseArgs(process.argv.slice(2));

if (args.help) {
  printHelp();
  process.exit(0);
}

createServer(args);
