import { MiddlewareHandler } from "./middleware.ts";

export const requireAuth: MiddlewareHandler = async (context) => {
  const authHeader = context.request.headers.get("Authorization");
  if (!authHeader) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = context.supabase;

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    return new Response("Invalid token", { status: 401 });
  }

  return { ...context, user };
};
