// Follow this setup guide to integrate the Deno language server with your editor:
// https://deno.land/manual/getting_started/setup_your_environment
// This enables autocomplete, go to definition, etc.

// Setup type definitions for built-in Supabase Runtime APIs
import "jsr:@supabase/functions-js/edge-runtime.d.ts";

/// <reference types="https://deno.land/x/deno@v1.40.0/lib.deno.d.ts" />

import { serve } from "https://deno.land/std@0.203.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2";

import type {
  Experiment,
  ExperimentStatus,
} from "../../../generated/prisma/index.js";

interface CreateExperimentRequest {
  name: string;
  description: string;
  items: {
    name: string;
    quantity: number;
    unit: string;
    estimatedCostUSD?: number;
    supplier?: string;
    catalog?: string;
  }[];
}

serve(async (req) => {
  // Handle CORS
  if (req.method === "OPTIONS") {
    return new Response(null, {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    });
  }

  try {
    const { name, description, items }: CreateExperimentRequest =
      await req.json();

    // Validate input
    if (
      !name ||
      !description ||
      !items ||
      !Array.isArray(items) ||
      items.length === 0
    ) {
      return new Response(
        JSON.stringify({
          error:
            "Invalid input. Name, description, and items array are required.",
        }),
        {
          status: 400,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Get the authorization header
    const authHeader = req.headers.get("Authorization");
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return new Response(
        JSON.stringify({ error: "Missing or invalid authorization header:" }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
            authHeader,
          },
        }
      );
    }

    // Create a Supabase client for auth, not for data access
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL")!,
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY")!
    );

    // Verify the user token and get user info
    const token = authHeader.replace("Bearer ", "");
    const {
      data: { user },
      error: authError,
    } = await supabase.auth.getUser(token);

    if (authError || !user) {
      return new Response(
        JSON.stringify({ error: "Invalid or expired token" }),
        {
          status: 401,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Calculate total estimated cost
    const totalEstimatedCost = items.reduce((sum, item) => {
      return sum + (item.estimatedCostUSD || 0);
    }, 0);

    const experimentId = crypto.randomUUID();

    // Create the experiment
    const { data: experiment, error: experimentError } = await supabase
      .from("experiments")
      .insert({
        id: experimentId,
        name,
        description,
        estimatedCostUSD: totalEstimatedCost,
        userId: user.id,
        status: "draft",
        updatedAt: new Date().toISOString(),
        createdAt: new Date().toISOString(),
      })
      .select()
      .single();

    if (experimentError) {
      console.error("Error creating experiment:", experimentError);
      return new Response(
        JSON.stringify({ error: "Failed to create experiment" }),
        {
          status: 500,
          headers: {
            "Content-Type": "application/json",
            "Access-Control-Allow-Origin": "*",
          },
        }
      );
    }

    // Create the items
    const itemsWithExperimentId = items.map((item) => ({
      ...item,
      id: crypto.randomUUID(),
      experimentId,
      updatedAt: new Date().toISOString(),
      createdAt: new Date().toISOString(),
    }));

    const { data: createdItems, error: itemsError } = await supabase
      .from("items")
      .insert(itemsWithExperimentId)
      .select();

    if (itemsError) {
      console.error("Error creating items:", itemsError);
      // If items creation fails, we should clean up the experiment
      await supabase.from("experiments").delete().eq("id", experimentId);

      return new Response(JSON.stringify({ error: "Failed to create items" }), {
        status: 500,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      });
    }

    return new Response(
      JSON.stringify({
        success: true,
        ...experiment,
        items: createdItems,
      }),
      {
        status: 201,
        headers: {
          "Content-Type": "application/json",
          "Access-Control-Allow-Origin": "*",
        },
      }
    );
  } catch (error) {
    console.error("Unexpected error:", error);
    return new Response(error, {
      status: 500,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*",
      },
    });
  }
});
