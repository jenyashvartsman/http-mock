export interface ServerOptions {
  port?: number;
  mockDir?: string;
  prefix?: string;
}

export interface MockData {
  method: string;
  route: string;
  filePath: string;
}
