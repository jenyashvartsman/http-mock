import { DEFAULT_MOCK_DIR, DEFAULT_PORT, DEFAULT_PREFIX } from "../config/config";
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

  const portIndex = args.indexOf("--port");
  if (portIndex !== -1 && portIndex + 1 < args.length) {
    parsed.port = parseInt(args[portIndex + 1], 10);
  }

  const mockDirIndex = args.indexOf("--mock-dir");
  if (mockDirIndex !== -1 && mockDirIndex + 1 < args.length) {
    parsed.mockDir = args[mockDirIndex + 1];
  }

  const prefixIndex = args.indexOf("--prefix");
  if (prefixIndex !== -1 && prefixIndex + 1 < args.length) {
    parsed.prefix = args[prefixIndex + 1];
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
    --help                Display this help message
  `);
}
