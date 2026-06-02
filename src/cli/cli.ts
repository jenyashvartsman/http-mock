import {
  DEFAULT_PORT,
  DEFAULT_MOCK_DIR,
  DEFAULT_PREFIX,
} from "../config/config";

export function printHelp() {
  console.log(`
    Usage: http-mock [options]
    Options:
        --port <number>       Specify the port to listen on (default: ${DEFAULT_PORT})
        --mock-dir <path>     Specify the directory to load mock files from (default: "${DEFAULT_MOCK_DIR}")
        --prefix <string>     Optional prefix to add to all mock routes (default: "${DEFAULT_PREFIX}")
        --help                Display this help message
    `);
}
