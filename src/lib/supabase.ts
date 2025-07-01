import { createClient } from "@supabase/supabase-js";
import type {
  Session,
  AuthResponse,
  AuthError,
  User,
} from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Missing Supabase environment variables");
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Auth helper functions
export const auth = {
  // Sign up with email and password
  signUp: async (
    email: string,
    password: string,
    name: string,
    institution: string
  ): Promise<{ data: AuthResponse["data"]; error: AuthError | null }> => {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/signup`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          apikey: supabaseAnonKey,
        },
        body: JSON.stringify({
          email,
          password,
          name,
          institution,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create user");
    }

    const { data, error } = await response.json();

    // If we have session data from the Edge Function, set it in the Supabase client
    if (data?.session) {
      const { error: setSessionError } = await supabase.auth.setSession(
        data.session
      );
      if (setSessionError) {
        console.error("Failed to set session:", setSessionError);
        return { data: null, error: setSessionError };
      }
    }

    return { data, error };
  },

  // Sign in with email and password
  signIn: async (
    email: string,
    password: string
  ): Promise<{ data: AuthResponse["data"]; error: AuthError | null }> => {
    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });
    return { data, error };
  },

  // Sign out
  signOut: async (): Promise<{ error: AuthError | null }> => {
    const { error } = await supabase.auth.signOut();
    return { error };
  },

  // Get current user
  getCurrentUser: async (): Promise<{
    user: User | null;
    error: AuthError | null;
  }> => {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser();
    return { user, error };
  },

  // Listen to auth state changes
  onAuthStateChange: (
    callback: (event: string, session: Session | null) => void
  ) => {
    return supabase.auth.onAuthStateChange(callback);
  },
};
