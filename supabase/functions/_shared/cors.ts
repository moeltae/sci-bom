import { MiddlewareHandler } from "./middleware.ts";

const allowedOrigins = ["https://sci-bom.vercel.app", "http://localhost:8080"];

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "POST, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, Apikey, apikey",
};

export const cors: MiddlewareHandler = async (context) => {
  if (context.request.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: corsHeaders,
    });
  }
  return context;
};

export { corsHeaders };
