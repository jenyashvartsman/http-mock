import * as http from "http";
import * as path from "path";
import { ServerOptions } from "./types";
import { log, logRequest } from "./logger";
import {
  APP_ROOT,
  DEFAULT_MOCK_DIR,
  DEFAULT_PORT,
  DEFAULT_PREFIX,
  RESPONSE_HEADERS,
  VALID_METHODS,
} from "../config/config";
import {
  buildMockRoute,
  collectMocks,
  findMock,
  loadMockFile,
  logAvailableMocks,
} from "./mocks";

export function createServer(options: ServerOptions = {}): void {
  // get config values with defaults
  const port = options.port ?? DEFAULT_PORT;
  const mockDir = options.mockDir ?? DEFAULT_MOCK_DIR;
  const prefix = options.prefix ?? DEFAULT_PREFIX;

  // collect all available mocks
  const availableMocks = collectMocks(prefix, path.join(APP_ROOT, mockDir));
  logAvailableMocks(availableMocks);

  // create and start the HTTP server
  const server = http.createServer(
    (req: http.IncomingMessage, res: http.ServerResponse) => {
      const url = req.url ?? "";
      const method = req.method ?? "GET";

      logRequest(method, url);

      if (!VALID_METHODS.includes(method.toUpperCase())) {
        sendResponse(res, 405, { error: "Method Not Allowed" });
        return;
      }

      const mock = findMock(availableMocks, method, url);

      if (!mock) {
        sendResponse(res, 404, {
          error: "Mock not found",
          path: buildMockRoute(mockDir, method, url),
        });
        return;
      }

      try {
        const data = loadMockFile(mock.filePath);
        sendResponse(res, 200, data);
      } catch (err) {
        log(`Error reading mock file "${mock.filePath}": ${err}`);
        sendResponse(res, 500, { error: "Failed to read mock file" });
      }
    },
  );

  server.listen(port, () => {
    logBanner(port, mockDir, prefix);
  });
}

function logBanner(port: number, mockDir: string, prefix: string): void {
  const lines = [
    "Server running",
    `  URL:      http://localhost:${port}`,
    `  Mock dir: ${mockDir}`,
    `  Prefix:   ${prefix || "(none)"}`,
  ].join("\n");
  log(lines);
}

function sendResponse(
  res: http.ServerResponse,
  statusCode: number,
  data: object,
): void {
  res.writeHead(statusCode, RESPONSE_HEADERS);
  res.end(JSON.stringify(data));
}
