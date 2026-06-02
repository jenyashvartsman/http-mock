import * as fs from "fs";
import * as http from "http";
import * as path from "path";
import { InterceptorOptions } from "./interceptor.models";
import { logRequest } from "../logger/logger";

// Default configuration values
const DEFAULT_PORT = 8080;
const DEFAULT_MOCK_DIR = "mocks";
const APP_ROOT = process.cwd();
const RESPONSE_HEADERS = { "Content-Type": "application/json" };

export function createInterceptor(
  options: InterceptorOptions = {},
): http.Server {
  const port = options.port ?? DEFAULT_PORT;
  const mockDir = options.mockDir ?? DEFAULT_MOCK_DIR;

  const server = http.createServer(
    async (req: http.IncomingMessage, res: http.ServerResponse) => {
      // Extract the request URL and method
      const url = req.url ?? "";
      const method = req.method ?? "GET";

      // Validate the HTTP method
      if (!validateMethod(method)) {
        res.writeHead(405, RESPONSE_HEADERS);
        res.end(JSON.stringify({ error: "Method Not Allowed" }));
        return;
      }

      // Create the full path to the mock file based on the request URL and method
      const relativePath = createRelativePath(mockDir, method, url);
      const fullPath = path.join(APP_ROOT, relativePath);

      // Log the incoming request
      logRequest(method, url);

      // Load mock data based on the request URL and method
      const mockData = loadMockData(fullPath);

      // Send the response with the mock data or an error message if not found
      res.writeHead(200, RESPONSE_HEADERS);
      if (mockData) {
        res.end(mockData);
      } else {
        res.end(
          JSON.stringify({
            error: "Mock data not found for this endpoint",
            path: relativePath,
          }),
        );
      }
    },
  );

  server.listen(port, () => {
    console.log(`[http-interceptor] Listening on http://localhost:${port}`);
  });

  return server;
}

/* Helper functions */

function loadMockData(mockFilePath: string): string | null {
  try {
    const mockData = JSON.parse(fs.readFileSync(mockFilePath, "utf-8"));
    return JSON.stringify(mockData);
  } catch (error) {
    return null;
  }
}

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

function validateMethod(method: string): boolean {
  const validMethods = ["GET", "POST", "PUT", "DELETE", "PATCH"];
  return validMethods.includes(method.toUpperCase());
}
