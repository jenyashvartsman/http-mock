export function printHelp() {
  console.log(`
    Usage: http-mock [options]
    Options:
        --port <number>       Specify the port to listen on (default: 3000)
        --mock-dir <path>     Specify the directory to load mock files from (default: "mocks")
        --help                Display this help message
        --prefix <string>     Optional prefix to add to all mock routes (default: "")
    `);
}
