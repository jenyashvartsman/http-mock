import { printHelp } from "./cli/cli";
import { createInterceptor } from "./core/interceptor";
import { InterceptorOptions } from "./core/interceptor.models";

const args = process.argv.slice(2);
if (args.includes("--help")) {
  printHelp();
  process.exit(0);
} else {
  const options: InterceptorOptions = {};

  // extract port
  const portIndex = args.findIndex((arg) => arg === "--port");
  if (portIndex !== -1 && portIndex + 1 < args.length) {
    options.port = parseInt(args[portIndex + 1], 10);
  }

  // extract mock directory
  const mockDirIndex = args.findIndex((arg) => arg === "--mock-dir");
  if (mockDirIndex !== -1 && mockDirIndex + 1 < args.length) {
    options.mockDir = args[mockDirIndex + 1];
  }

  // extract prefix
  const prefixIndex = args.findIndex((arg) => arg === "--prefix");
  if (prefixIndex !== -1 && prefixIndex + 1 < args.length) {
    options.prefix = args[prefixIndex + 1];
  }

  createInterceptor(options);
}
