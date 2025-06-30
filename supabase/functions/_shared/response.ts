// functions/_shared/response.ts
import { corsHeaders } from "./cors.ts";

export const jsonResponse = (data: any, status = 200) => {
  return new Response(JSON.stringify(data), {
    status,
    headers: {
      ...corsHeaders,
      "Content-Type": "application/json",
    },
  });
};

export const errorResponse = (message: string, status = 500) => {
  return jsonResponse({ error: message }, status);
};
