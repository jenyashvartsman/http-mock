import * as fs from "fs";
import * as http from "http";
import * as path from "path";
import { InterceptorOptions, MockData } from "./interceptor.models";
import { log, logRequest } from "../logger/logger";
import {
  DEFAULT_PORT,
  DEFAULT_MOCK_DIR,
  DEFAULT_PREFIX,
  APP_ROOT,
  RESPONSE_HEADERS,
} from "../config/config";

// Main function to create and start the HTTP interceptor server
export function createInterceptor(options: InterceptorOptions = {}): void {
  const port = options.port ?? DEFAULT_PORT;
  const mockDir = options.mockDir ?? DEFAULT_MOCK_DIR;
  const prefix = options.prefix ?? DEFAULT_PREFIX;

  // assemble available mocks and log them
  const availableMocks = collectMocks(prefix, path.join(APP_ROOT, mockDir));
  logAvailableMocks(availableMocks);

  // Create the HTTP server to intercept requests and serve mock data
  const server = http.createServer(
    async (req: http.IncomingMessage, res: http.ServerResponse) => {
      // Extract the request URL and method
      const url = req.url ?? "";
      const method = req.method ?? "GET";

      // Log the incoming request
      logRequest(method, url);

      // Validate the HTTP method
      if (!validateMethod(method)) {
        sendResponse(res, 405, { error: "Method Not Allowed" });
        return;
      }

      // Create the relative path for error reporting
      const relativePath = createRelativePath(mockDir, method, url);

      // Load mock data based on the request URL and method
      const mockData = loadMockData(availableMocks, method, url);

      // Send the response with the mock data or an error message if not found
      if (mockData) {
        sendResponse(res, 200, mockData);
      } else {
        sendResponse(res, 404, {
          error: "Mock data not found for this endpoint",
          path: relativePath,
        });
      }
    },
  );

  // Start the server and log the listening address
  server.listen(port, () => {
    logAppBanner(port, mockDir, prefix);
  });
}

/* Helper functions */

// Match request route with mock route, supporting dynamic segments like [id]
function matchRoute(mockRoute: string, requestRoute: string): boolean {
  const mockSegments = mockRoute.split("/").filter(Boolean);
  const requestSegments = requestRoute.split("/").filter(Boolean);
  if (mockSegments.length !== requestSegments.length) return false;
  return mockSegments.every(
    (seg, i) =>
      (seg.startsWith("[") && seg.endsWith("]")) || seg === requestSegments[i],
  );
}

// Load mock data from the file system based on the request method and URL
function loadMockData(
  availableMocks: MockData[],
  method: string,
  url: string,
): object | null {
  const route = "/" + url.split("?")[0].split("/").filter(Boolean).join("/");
  const mock = availableMocks.find(
    (m) => m.method === method.toUpperCase() && matchRoute(m.route, route),
  );
  if (!mock) return null;
  try {
    return JSON.parse(fs.readFileSync(mock.filePath, "utf-8"));
  } catch {
    return null;
  }
}

// Create a relative path for error reporting based on the mock directory, method, and URL
function createRelativePath(
  mockDir: string,
  method: string,
  url: string,
): string {
  return path.join(
    mockDir,
    ...url.split("/").filter(Boolean),
    `${method.toLowerCase()}.json`,
  );
}

// Validate that the HTTP method is one of the allowed methods
function validateMethod(method: string): boolean {
  const validMethods = ["GET", "POST", "PUT", "DELETE", "PATCH"];
  return validMethods.includes(method.toUpperCase());
}

// Recursively collect mock data from the specified directory and return an array of MockData objects
function collectMocks(
  prefix: string,
  baseDir: string,
  currentDir: string = baseDir,
): MockData[] {
  if (!fs.existsSync(baseDir)) return [];

  const results: MockData[] = [];
  const entries = fs.readdirSync(currentDir, { withFileTypes: true });

  for (const entry of entries) {
    const fullPath = path.join(currentDir, entry.name);
    if (entry.isDirectory()) {
      results.push(...collectMocks(prefix, baseDir, fullPath));
    } else if (entry.isFile() && entry.name.endsWith(".json")) {
      const method = entry.name.replace(".json", "").toUpperCase();
      const relativePath = path.relative(baseDir, currentDir);
      const route = "/" + relativePath.split(path.sep).join("/");
      results.push({ method, route: prefix + route, filePath: fullPath });
    }
  }

  return results;
}

function logAvailableMocks(mocks: MockData[]): void {
  if (mocks.length === 0) {
    log("[http-mock] No mock files found in mock directory.");
    return;
  }
  const methodWidth = Math.max(...mocks.map((m) => m.method.length));
  const routeWidth = Math.max(...mocks.map((m) => m.route.length));
  const lines = [
    `${mocks.length} mock(s) loaded:`,
    ...mocks.map(
      (m) =>
        `  ${m.method.padEnd(methodWidth + 2)}  ${m.route.padEnd(routeWidth + 4)} ${m.filePath}`,
    ),
  ];
  log(lines.join("\n"));
}

function logAppBanner(port: number, mockDir: string, prefix: string): void {
  const lines = [
    `Server running`,
    `  URL:      http://localhost:${port}`,
    `  Mock dir: ${mockDir}`,
    `  Prefix:   ${prefix || "(none)"}`,
  ].join("\n");
  log(lines);
}

// Send a JSON response with the specified status code and data
function sendResponse(
  res: http.ServerResponse,
  statusCode: number,
  data: object,
): void {
  res.writeHead(statusCode, RESPONSE_HEADERS);
  res.end(JSON.stringify(data));
}
