import * as http from "http";

export const logRequest = (req: http.IncomingMessage) => {
  const method = req.method;
  const url = req.url ?? "/";
  const currentTime = new Date().toISOString();
  console.log(`[${currentTime}] ${method} ${url}`);
};
