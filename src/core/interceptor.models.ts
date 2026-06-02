export interface InterceptorOptions {
  port?: number;
  mockDir?: string;
}

export interface MockData {
  method: string;
  route: string;
  filePath: string;
}
