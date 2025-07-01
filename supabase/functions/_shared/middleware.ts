import { requireAuth } from "./auth.ts";
import { cors } from "./cors.ts";
import parseJSON from "./json.ts";
import { withSupabase } from "./supabase.ts";
import {
  SupabaseClient,
  type User,
} from "https://esm.sh/@supabase/supabase-js@2";

export interface RequestContext {
  request: Request;
  params?: Record<string, string>;
  body?: unknown;
}

export interface AuthenticatedRequestContext extends RequestContext {
  user: User;
  userSupabase: SupabaseClient;
}

export type MiddlewareHandler = (
  context: RequestContext
) => Promise<RequestContext | Response>;

export type Handler = (context: RequestContext) => Promise<Response>;

export async function getContext(
  request: Request,
  middlewares: MiddlewareHandler[]
): Promise<RequestContext | Response> {
  let context: RequestContext = { request };

  for (const middleware of middlewares) {
    console.log(`Executing middleware: ${middleware.name}`);
    const result = await middleware(context);
    if (result instanceof Response) {
      console.log(`Early exit from ${middleware.name || "anonymous"}`);
      return result; // Early return for auth failures, etc.
    }
    context = { ...context, ...result };
    console.log(
      `Context after ${middleware.name || "anonymous"}:`,
      Object.keys(context)
    );
  }

  return context;
}
