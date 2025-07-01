import { useAuth } from "@/contexts/AuthContext";
import { useQuery } from "@tanstack/react-query";
import { Experiment } from "generated/prisma";

export function useExperiments(): {
  isPending: boolean;
  isError: boolean;
  experiments: Experiment[];
  error: Error;
} {
  const { session } = useAuth();

  const fetchExperiments = async () => {
    const response = await fetch(
      `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/list-experiments`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
          apikey: import.meta.env.VITE_SUPABASE_ANON_KEY,
        },
      }
    );
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to fetch experiments");
    }
    const data = await response.json();
    return data.experiments || [];
  };

  const {
    isPending,
    isError,
    data: experiments = [],
    error,
  } = useQuery({
    queryKey: ["experiments"],
    queryFn: fetchExperiments,
  });

  return { isPending, isError, experiments, error };
}
