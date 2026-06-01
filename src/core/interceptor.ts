import * as http from "http";
import { InterceptorOptions } from "./interceptor.models";
import { logRequest } from "../logger/logger";

export function createInterceptor(
  options: InterceptorOptions = {},
): http.Server {
  const port = options.port ?? 8080;

  const server = http.createServer(
    async (req: http.IncomingMessage, res: http.ServerResponse) => {
      logRequest(req);

      // return a simple response (todo)
      res.writeHead(200, { "Content-Type": "text/plain" });
      res.end("OK");
    },
  );

  server.listen(port, () => {
    console.log(`[http-interceptor] Listening on http://localhost:${port}`);
  });

  return server;
}
