import * as fs from "fs";
import * as path from "path";
import { MockData } from "./types";
import { log } from "./logger";

export function normalizeRoute(url: string): string {
  return "/" + url.split("?")[0].split("/").filter(Boolean).join("/");
}

export function buildMockRoute(
  mockDir: string,
  method: string,
  url: string,
): string {
  return path.join(
    mockDir,
    ...normalizeRoute(url).split("/").filter(Boolean),
    `${method.toLowerCase()}.json`,
  );
}

export function matchRoute(mockRoute: string, requestRoute: string): boolean {
  const mockSegments = mockRoute.split("/").filter(Boolean);
  const requestSegments = requestRoute.split("/").filter(Boolean);
  if (mockSegments.length !== requestSegments.length) return false;
  return mockSegments.every(
    (seg, i) =>
      (seg.startsWith("[") && seg.endsWith("]")) || seg === requestSegments[i],
  );
}

export function findMock(
  availableMocks: MockData[],
  method: string,
  url: string,
): MockData | undefined {
  const route = normalizeRoute(url);
  return availableMocks.find(
    (m) => m.method === method.toUpperCase() && matchRoute(m.route, route),
  );
}

export function loadMockFile(filePath: string): object {
  return JSON.parse(fs.readFileSync(filePath, "utf-8"));
}

export function collectMocks(
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

export function logAvailableMocks(mocks: MockData[]): void {
  if (mocks.length === 0) {
    log("No mock files found in mock directory.");
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
