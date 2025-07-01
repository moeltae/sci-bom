import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { getContext } from "../_shared/middleware.ts";
import { cors } from "../_shared/cors.ts";
import parseJSON from "../_shared/json.ts";
import { withSupabase } from "../_shared/supabase.ts";
import { jsonResponse, errorResponse } from "../_shared/response.ts";
import { serve } from "https://deno.land/std@0.203.0/http/server.ts";

const handler = async (context) => {
  // Extract data from the parsed JSON body
  const { email, name, password, institution } = context.body;

  // Validate required fields
  if (!email || !name || !password || !institution) {
    return errorResponse(
      "Missing required fields: id, email, name, password",
      400
    );
  }

  // Create the user in supabase auth with session data
  const { data: authData, error: authError } =
    await context.supabase.auth.signUp({
      email,
      password,
      options: {
        data: {
          name: name,
        },
      },
    });

  if (authError) {
    return errorResponse(authError.message);
  }

  // Create the user record
  const { userData, error } = await context.supabase.from("users").upsert([
    {
      id: authData.user.id,
      email,
      name,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
      institution,
    },
  ]);

  if (error) {
    return errorResponse(error.message);
  }

  console.log("Created user");

  // Return session data along with user data
  return jsonResponse({
    user: userData,
    session: authData.session,
    success: true,
  });
};

serve(async (request: Request) => {
  const context = await getContext(request, [cors, parseJSON, withSupabase]);

  if (context instanceof Response) {
    return context;
  }
  return handler(context);
});
