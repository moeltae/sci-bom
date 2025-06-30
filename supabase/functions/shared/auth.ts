import getClient from "./client";
import { MiddlewareHandler } from "./middleware";

export const requireAuth: MiddlewareHandler = async (context) => {
  const authHeader = context.request.headers.get("Authorization");
  if (!authHeader) {
    return new Response("Unauthorized", { status: 401 });
  }

  const supabase = getClient(context);

  const {
    data: { user },
    error,
  } = await supabase.auth.getUser();
  if (error || !user) {
    return new Response("Invalid token", { status: 401 });
  }

  return { ...context, user };
};
