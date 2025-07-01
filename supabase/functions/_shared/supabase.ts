// @deno-types="npm:@supabase/supabase-js@2"
import {
  createClient,
  SupabaseClient,
} from "https://esm.sh/@supabase/supabase-js@2";
import { MiddlewareHandler } from "./middleware.ts";

export const withSupabase: MiddlewareHandler = async (context) => {
  const authHeader = context.request.headers.get("Authorization");

  // If we have an auth header, create a client with the user's token

  if (!authHeader) {
    throw new Error("No auth header found");
  }

  const userSupabase: SupabaseClient = createClient(
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
  return { ...context, userSupabase };
};
