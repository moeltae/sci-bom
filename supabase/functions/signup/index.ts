// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { getContext } from "../_shared/middleware.ts";
import { cors } from "../_shared/cors.ts";
import parseJSON from "../_shared/json.ts";
import { withSupabase } from "../_shared/supabase.ts";
import { jsonResponse, errorResponse } from "../_shared/response.ts";
import { serve } from "https://deno.land/std@0.203.0/http/server.ts";

const handler = async (context) => {
  // Extract data from the parsed JSON body
  const { email, name, password } = context.body;

  // Validate required fields
  if (!email || !name || !password) {
    return errorResponse(
      "Missing required fields: id, email, name, password",
      400
    );
  }

  // Create the user in supabase auth
  const { data, authError } = await context.supabase.auth.signUp({
    email,
    password,
  });

  if (authError) {
    return errorResponse(authError.message);
  }

  // Create the user record
  const { error } = await context.supabase.from("users").upsert([
    {
      id: data.user.id,
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

serve(async (request: Request) => {
  console.log("x0");
  const context = await getContext(request, [cors, parseJSON, withSupabase]);
  console.log("context keys:", Object.keys(context));
  console.log("context:", context);

  if (context instanceof Response) {
    console.log("early return");
    return context;
  }
  return handler(context);
});
