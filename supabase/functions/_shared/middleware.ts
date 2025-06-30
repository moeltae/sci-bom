export interface RequestContext {
  request: Request;
  user?: any;
  params?: Record<string, string>;
}

export type MiddlewareHandler = (
  context: RequestContext
) => Promise<RequestContext | Response>;

export type Handler = (context: RequestContext) => Promise<Response>;

export async function getContext(
  request: Request,
  middlewares: MiddlewareHandler[]
): Promise<RequestContext | Response> {
  let context: RequestContext = { request };

  for (const middleware of middlewares) {
    const result = await middleware(context);
    if (result instanceof Response) {
      console.log(`Early exit from ${middleware.name}`);
      return result; // Early return for auth failures, etc.
    }
    context = { ...context, ...result };
  }

  return context;
}

export const compose = (...middlewares: MiddlewareHandler[]) => {
  return async (handler: Handler) => {
    return async (request: Request) => {
      let context: RequestContext = { request };

      for (const middleware of middlewares) {
        const result = await middleware(context);
        if (result instanceof Response) {
          return result; // Early return for auth failures, etc.
        }
        context = result;
      }

      return handler(context);
    };
  };
};
