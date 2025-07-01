import { MiddlewareHandler } from "./middleware.ts";

export const requireAuth: MiddlewareHandler = async (context) => {
  const authHeader = context.request.headers.get("Authorization");
  if (!authHeader) {
    return new Response("Unauthorized", { status: 401 });
  }

  // Use the userSupabase client if available, otherwise fall back to the service role client
  const supabase = context.userSupabase || context.supabase;

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    return new Response("Invalid token", { status: 401 });
  }

  return { ...context, user };
};
