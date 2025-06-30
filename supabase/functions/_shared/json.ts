import { MiddlewareHandler } from "./middleware.ts";

const parseJSON: MiddlewareHandler = async (context) => {
  if (context.request.method === "POST" || context.request.method === "PUT") {
    try {
      const body = await context.request.json();
      return { ...context, body };
    } catch {
      return new Response("Invalid JSON", { status: 400 });
    }
  }
  return context;
};

export default parseJSON;
