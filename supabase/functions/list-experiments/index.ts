// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { getContext } from "../_shared/middleware.ts";
import { cors } from "../_shared/cors.ts";
import parseJSON from "../_shared/json.ts";
import { withSupabase } from "../_shared/supabase.ts";
import { jsonResponse, errorResponse } from "../_shared/response.ts";
import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { requireAuth } from "../_shared/auth.ts";

const handler = async (context) => {
  try {
    const { supabase, user } = context;

    // Query experiments for the current user
    const { data: experiments, error } = await context.userSupabase
      .from("experiments")
      .select(
        `
        id,
        name,
        description,
        status,
        estimatedCostUSD,
        createdAt,
        updatedAt,
        items (
          id,
          name,
          quantity,
          unit,
          estimatedCostUSD,
          supplier,
          catalog
        )
      `
      )
      .eq("userId", user.id)
      .order("createdAt", { ascending: false });

    if (error) {
      console.error("Error fetching experiments:", error);
      return errorResponse("Failed to fetch experiments", 500);
    }

    return jsonResponse({ experiments });
  } catch (error) {
    console.error("Unexpected error:", error);
    return errorResponse("Internal server error", 500);
  }
};

serve(async (request: Request) => {
  const context = await getContext(request, [
    cors,
    parseJSON,
    withSupabase,
    requireAuth,
  ]);

  if (context instanceof Response) {
    return context;
  }
  return handler(context);
});
