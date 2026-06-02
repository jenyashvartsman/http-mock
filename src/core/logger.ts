export const log = (message: string): void => {
  const currentTime = new Date().toISOString();
  process.stdout.write(`[${currentTime}] ${message}\n`);
};

export const logRequest = (method: string, url: string): void => {
  log(`${method} ${url}`);
};
