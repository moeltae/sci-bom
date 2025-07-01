import { MiddlewareHandler } from "./middleware.ts";

const parseJSON: MiddlewareHandler = async (context) => {
  if (context.request.method === "POST" || context.request.method === "PUT") {
    try {
      console.log("Parsing JSON from request...");
      const body = await context.request.json();
      console.log("Parsed body:", JSON.stringify(body, null, 2));
      return { ...context, body };
    } catch (error) {
      console.error("JSON parsing error:", error);
      return new Response("Invalid JSON", { status: 400 });
    }
  }
  return context;
};

export default parseJSON;
