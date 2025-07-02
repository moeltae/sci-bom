import {
  AuthenticatedRequestContext,
  getContext,
} from "../_shared/middleware.ts";
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

import { jsonResponse, errorResponse } from "../_shared/response.ts";
import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { requireAuth } from "../_shared/auth.ts";
import { cors } from "../_shared/cors.ts";
import parseJSON from "../_shared/json.ts";
import { withSupabase } from "../_shared/supabase.ts";

type ExperimentItem = {
  name: string;
  quantity: number;
  unit: string;
  estimatedCostUSD?: number;
  supplier?: string;
  catalog?: string;
};

// TODO: Use a schema validator or better typing
interface CreateExperimentRequest {
  name: string;
  description: string;
  items: ExperimentItem[];
}

async function createExperiment(
  context: AuthenticatedRequestContext
): Promise<{ createdItems: ExperimentItem[]; experiment: any }> {
  const { user, body, userSupabase } = context;

  const { name, description, items }: CreateExperimentRequest = body;

  // // Validate input
  if (
    !name ||
    !description ||
    !items ||
    !Array.isArray(items) ||
    items.length === 0
  ) {
    throw new Error(
      "Invalid input. Name, description, and items array are required."
    );
  }

  // Calculate total estimated cost
  const totalEstimatedCost = items.reduce((sum, item) => {
    return sum + (item.estimatedCostUSD || 0);
  }, 0);

  const experimentId = crypto.randomUUID();

  // Create the experiment
  const { data: experiment, error: experimentError } = await userSupabase
    .from("experiments")
    .insert({
      id: experimentId,
      name,
      description,
      estimatedCostUSD: totalEstimatedCost,
      userId: user.id,
      status: "submitted",
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    })
    .select()
    .single();

  if (experimentError) {
    console.error("Error creating experiment:", experimentError);
    throw new Error("Failed to create experiment");
  }

  // Create the items
  const itemsWithExperimentId = items.map((item) => ({
    ...item,
    id: crypto.randomUUID(),
    experimentId,
    updatedAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
  }));

  const { data: createdItems, error: itemsError } = await userSupabase
    .from("items")
    .insert(itemsWithExperimentId)
    .select();

  if (itemsError) {
    console.error("Error creating items:", itemsError);
    // If items creation fails, we should clean up the experiment
    await userSupabase.from("experiments").delete().eq("id", experimentId);

    throw new Error("Failed to create items");
  }

  return { experiment, createdItems };
}

const handler = async (context: AuthenticatedRequestContext) => {
  try {
    const { experiment, createdItems } = await createExperiment(context);

    // TODO(Mo): I think we should kick off web scraping here
    // Some notes:
    // - the experiment was created with status "submitted" above
    // - we should update the status once the web scraping finishes
    return jsonResponse({ success: true, ...experiment, items: createdItems });
  } catch (error) {
    console.error("Unexpected error:", error);
    return errorResponse("Internal server error", 500);
  }
};

serve(async (request: Request) => {
  const contextOrResponse = await getContext(request, [
    cors,
    parseJSON,
    withSupabase,
    requireAuth,
  ]);

  if (contextOrResponse instanceof Response) {
    return contextOrResponse;
  }

  return handler(contextOrResponse as AuthenticatedRequestContext);
});
