
import { defineConfig, loadEnv } from "vite";
import react from "@vitejs/plugin-react";

export default defineConfig(({ mode }) => {
  Object.assign(process.env, loadEnv(mode, process.cwd(), ""));

  return {
    plugins: [
      react(),
      {
        name: "local-api",

        configureServer(server) {
          server.middlewares.use("/api", async (req, res) => {
            try {
              const url = new URL(req.url, "http://localhost");

              const name = url.pathname
                .replace(/^\/+/, "")
                .replace(/[^a-z0-9-]/gi, "");

              req.query = Object.fromEntries(url.searchParams);

              let body = "";
              for await (const chunk of req) {
                body += chunk;
              }

              req.body = body ? JSON.parse(body) : {};

              res.status = (code) => {
                res.statusCode = code;
                return res;
              };

              res.json = (data) => {
                res.setHeader("Content-Type", "application/json");
                res.end(JSON.stringify(data));
              };

              const module = await server.ssrLoadModule(
                `/api/${name}.js`
              );

              const handler = module.default;

              if (typeof handler !== "function") {
                throw new Error(`Invalid API handler: ${name}.js`);
              }

              await handler(req, res);

            } catch (err) {
              console.error(err);

              res.statusCode = 500;
              res.setHeader("Content-Type", "application/json");

              res.end(JSON.stringify({
                error: "Local API error. Check the terminal."
              }));
            }
          });
        },
      },
    ],
  };
});
