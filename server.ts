import { serve } from "bun";
import { join } from "path";

const PORT = 8000;

serve({
  port: PORT,
  async fetch(req) {
    const url = new URL(req.url);
    console.log(`${req.method} ${url.pathname}`);

    const headers = {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
      "Access-Control-Allow-Headers": "Content-Type, Authorization",
    };

    if (req.method === "OPTIONS") {
      return new Response(null, { status: 200, headers });
    }

    try {
      if (url.pathname === "/registry.json") {
        const registryPath = join(process.cwd(), "registry.json");
        const file = Bun.file(registryPath);

        if (await file.exists()) {
          return new Response(file, {
            headers: {
              ...headers,
              "Content-Type": "application/json",
            },
          });
        }
      }

      if (url.pathname.startsWith("/")) {
        const filePath = join(process.cwd(), "public", url.pathname);
        const file = Bun.file(filePath);

        if (await file.exists()) {
          const contentType = getContentType(filePath);
          return new Response(file, {
            headers: {
              ...headers,
              "Content-Type": contentType,
            },
          });
        }
      }

      return new Response("Not Found", {
        status: 404,
        headers: {
          ...headers,
          "Content-Type": "text/plain",
        },
      });
    } catch (error) {
      console.error("Server error:", error);
      return new Response("Internal Server Error", {
        status: 500,
        headers: {
          ...headers,
          "Content-Type": "text/plain",
        },
      });
    }
  },
});

function getContentType(filePath: string): string {
  const ext = filePath.split(".").pop()?.toLowerCase();
  switch (ext) {
    case "json":
      return "application/json";
    case "js":
      return "application/javascript";
    case "ts":
      return "application/typescript";
    case "tsx":
      return "text/typescript";
    case "css":
      return "text/css";
    case "html":
      return "text/html";
    case "txt":
      return "text/plain";
    default:
      return "text/plain";
  }
}
