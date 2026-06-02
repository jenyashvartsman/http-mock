export const logRequest = (method: string, url: string) => {
  log(`${method} ${url}`);
};

export const log = (message: string): void => {
  const currentTime = new Date().toISOString();
  process.stdout.write(`[${currentTime}] ${message}\n`);
};
