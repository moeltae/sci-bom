import { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";

interface ExperimentItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  estimatedCostUSD: number;
  supplier: string;
  catalog: string;
  thermoFisherPrice?: number;
  thermoFisherCatalog?: string;
  analysisStatus?: 'pending' | 'completed';
}

interface Experiment {
  id: string;
  name: string;
  description: string;
  status: string;
  estimatedCostUSD: number;
  createdAt: string;
  updatedAt: string;
  items: ExperimentItem[];
}

interface UseExperimentsReturn {
  experiments: Experiment[];
  loading: boolean;
  error: string | null;
  refetch: () => Promise<void>;
}

export const useExperiments = (): UseExperimentsReturn => {
  const [experiments, setExperiments] = useState<Experiment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { session } = useAuth();

  const fetchExperiments = async () => {
    if (!session?.access_token) {
      setError("No authentication token available");
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      setError(null);

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
      setExperiments(data.experiments || []);
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Failed to fetch experiments";
      setError(errorMessage);
      console.error("Error fetching experiments:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (session?.access_token) {
      fetchExperiments();
    } else {
      setLoading(false);
    }
  }, [session?.access_token]);

  return {
    experiments,
    loading,
    error,
    refetch: fetchExperiments,
  };
};
