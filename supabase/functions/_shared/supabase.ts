import { createClient } from "https://esm.sh/@supabase/supabase-js@2";
import { MiddlewareHandler } from "./middleware.ts";

export const withSupabase: MiddlewareHandler = async (context) => {
  const authHeader = context.request.headers.get("Authorization");

  // Create client with service role key for admin operations
  const supabase = createClient(
    Deno.env.get("SUPABASE_URL")!,
    Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
  );

  // If we have an auth header, create a client with the user's token
  if (authHeader) {
    const userSupabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_ANON_KEY")!,
      {
        global: {
          headers: {
            Authorization: authHeader,
          },
        },
      }
    );
    return { ...context, supabase, userSupabase };
  }

  return { ...context, supabase };
};
