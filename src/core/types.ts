export interface ServerOptions {
  port?: number;
  mockDir?: string;
  prefix?: string;
  delay?: number;
}

export interface MockData {
  method: string;
  route: string;
  filePath: string;
}
