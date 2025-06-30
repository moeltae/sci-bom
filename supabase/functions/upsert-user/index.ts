// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { compose } from "../_shared/middleware.ts";
import { cors } from "../_shared/cors.ts";
import parseJSON from "../_shared/json.ts";
import { withSupabase } from "../_shared/supabase.ts";
import { jsonResponse, errorResponse } from "../_shared/response.ts";

const handler = async (context) => {
  // Extract data from the parsed JSON body
  const { id, email, name } = context.body;

  // Validate required fields
  if (!id || !email || !name) {
    return errorResponse("Missing required fields: id, email, name", 400);
  }

  // Use the Supabase client from middleware
  const { error } = await context.supabase.from("users").upsert([
    {
      id,
      email,
      name,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    },
  ]);

  if (error) {
    return errorResponse(error.message);
  }

  return jsonResponse({ success: true });
};

// Compose middleware and handler
const withMiddleware = compose(
  cors, // Handle CORS preflight
  parseJSON, // Parse JSON body
  withSupabase // Initialize Supabase client
)(handler);

// Serve the function
serve(withMiddleware);
