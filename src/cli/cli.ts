import {
  DEFAULT_DELAY,
  DEFAULT_MOCK_DIR,
  DEFAULT_PORT,
  DEFAULT_PREFIX,
} from "../config/config";
import { ServerOptions } from "../core/types";

export interface ParsedArgs extends ServerOptions {
  help?: boolean;
}

export function parseArgs(args: string[]): ParsedArgs {
  const parsed: ParsedArgs = {};

  if (args.includes("--help")) {
    parsed.help = true;
    return parsed;
  }

  const port = extractArg(args, "--port");
  if (port) {
    parsed.port = parseInt(port, 10);
  }

  const mockDir = extractArg(args, "--mock-dir");
  if (mockDir) {
    parsed.mockDir = mockDir;
  }

  const prefix = extractArg(args, "--prefix");
  if (prefix) {
    parsed.prefix = prefix;
  }

  const delay = extractArg(args, "--delay");
  if (delay) {
    parsed.delay = parseInt(delay, 10);
  }

  return parsed;
}

export function printHelp(): void {
  console.log(`
Usage: http-mock [options]

Options:
    --port <number>       Port to listen on (default: ${DEFAULT_PORT})
    --mock-dir <path>     Directory to load mock files from (default: "${DEFAULT_MOCK_DIR}")
    --prefix <string>     Optional prefix for all mock routes (default: "${DEFAULT_PREFIX || "(none)"}")
    --delay <number>      Optional delay for responses in milliseconds (default: ${DEFAULT_DELAY})
    --help                Display this help message
  `);
}

function extractArg(args: string[], flag: string): string | undefined {
  const index = args.indexOf(flag);
  if (index !== -1 && index + 1 < args.length) {
    return args[index + 1];
  }
  return undefined;
}
