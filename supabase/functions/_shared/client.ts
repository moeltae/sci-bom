import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/// <reference types="https://deno.land/x/deno@v1.40.0/lib.deno.d.ts" />

import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

export default function getClient(context: RequestContext) {
  // Create a Supabase client for auth, not for data access
  const client = createClient({
    global: {
      headers: { Authorization: context.request.headers.get("Authorization") },
    },
  });

  return client;
}
