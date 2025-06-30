import { useState, useRef } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Upload, FileText, AlertCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { useAuth } from "@/contexts/AuthContext";

interface BomItem {
  id: string;
  name: string;
  quantity: number;
  unit: string;
  estimatedCostUSD?: number;
  supplier?: string;
  catalog?: string;
}

export const BomUploader = () => {
  const [file, setFile] = useState<File | null>(null);
  const [bomData, setBomData] = useState<BomItem[]>([]);
  const [experimentName, setExperimentName] = useState("");
  const [experimentDescription, setExperimentDescription] = useState("");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const { toast } = useToast();
  const { session } = useAuth();

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFile = event.target.files?.[0];
    if (uploadedFile && uploadedFile.type === "text/csv") {
      setFile(uploadedFile);
      processCsvFile(uploadedFile);
    } else {
      toast({
        title: "Invalid file format",
        description: "Please upload a CSV file.",
        variant: "destructive",
      });
    }
  };

  const processCsvFile = async (csvFile: File) => {
    setIsProcessing(true);
    const text = await csvFile.text();
    const lines = text.split("\n");
    const headers = lines[0].split(",").map((h) => h.trim());

    const parsedData: BomItem[] = lines
      .slice(1)
      .filter((line) => line.trim())
      .map((line, index) => {
        const values = line.split(",").map((v) => v.trim());
        return {
          id: `item_${index}`,
          name: values[0] || `Material ${index + 1}`,
          quantity: parseInt(values[1]) || 1,
          unit: values[2] || "each",
          estimatedCostUSD: values[3] ? parseFloat(values[3]) : undefined,
          supplier: values[4] || "TBD",
          catalog: values[5] || "TBD",
        };
      });

    setBomData(parsedData);
    setIsProcessing(false);

    toast({
      title: "CSV processed successfully",
      description: `Found ${parsedData.length} materials to analyze.`,
    });
  };

  const handleSaveBom = async () => {
    if (!experimentName.trim()) {
      toast({
        title: "Experiment name required",
        description: "Please enter a name for this experiment.",
        variant: "destructive",
      });
      return;
    }

    if (!experimentDescription.trim()) {
      toast({
        title: "Experiment description required",
        description: "Please enter a description for this experiment.",
        variant: "destructive",
      });
      return;
    }

    setIsSaving(true);

    try {
      // Transform the data to match the backend schema
      const items = bomData.map((item) => ({
        name: item.name,
        quantity: item.quantity,
        unit: item.unit,
        estimatedCostUSD: item.estimatedCostUSD,
        supplier: item.supplier,
        catalog: item.catalog,
      }));

      const response = await fetch(
        `${import.meta.env.VITE_SUPABASE_URL}/functions/v1/create-experiment`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            name: experimentName,
            description: experimentDescription,
            items,
          }),
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to save experiment");
      }

      const result = await response.json();

      toast({
        title: "Experiment saved successfully",
        description: `"${experimentName}" has been created with ${bomData.length} materials.`,
      });

      // Reset form
      setFile(null);
      setBomData([]);
      setExperimentName("");
      setExperimentDescription("");
      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }
    } catch (error) {
      console.error("Error saving experiment:", error);
      toast({
        title: "Failed to save experiment",
        description:
          error instanceof Error
            ? error.message
            : "An unexpected error occurred.",
        variant: "destructive",
      });
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Upload Bill of Materials</CardTitle>
          <CardDescription>
            Import your experiment materials from a CSV file to get started with
            cost analysis
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="experiment-name">Experiment Name</Label>
            <Input
              id="experiment-name"
              value={experimentName}
              onChange={(e) => setExperimentName(e.target.value)}
              placeholder="e.g., Cell Culture Media Optimization"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="experiment-description">
              Experiment Description
            </Label>
            <Input
              id="experiment-description"
              value={experimentDescription}
              onChange={(e) => setExperimentDescription(e.target.value)}
              placeholder="Brief description of your experiment"
            />
          </div>

          <div className="space-y-4">
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-gray-400 transition-colors">
              <input
                ref={fileInputRef}
                type="file"
                accept=".csv"
                onChange={handleFileUpload}
                className="hidden"
                id="csv-upload"
              />
              <label htmlFor="csv-upload" className="cursor-pointer">
                <Upload className="mx-auto h-12 w-12 text-gray-400 mb-4" />
                <p className="text-lg font-medium text-gray-900 mb-2">
                  {file ? file.name : "Upload CSV File"}
                </p>
                <p className="text-gray-600">
                  Click to browse or drag and drop your BoM CSV file
                </p>
              </label>
            </div>

            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Expected CSV format: Material Name, Quantity, Unit, Estimated
                Cost, Supplier, Catalog Number
              </AlertDescription>
            </Alert>
          </div>

          {bomData.length > 0 && (
            <div className="space-y-4">
              <h3 className="text-lg font-medium">
                Preview Materials ({bomData.length} items)
              </h3>
              <div className="max-h-64 overflow-y-auto border rounded-lg">
                <table className="w-full text-sm">
                  <thead className="border-b bg-gray-50">
                    <tr>
                      <th className="text-left p-3">Material</th>
                      <th className="text-left p-3">Quantity</th>
                      <th className="text-left p-3">Unit</th>
                      <th className="text-left p-3">Est. Cost</th>
                    </tr>
                  </thead>
                  <tbody>
                    {bomData.slice(0, 5).map((item) => (
                      <tr key={item.id} className="border-b">
                        <td className="p-3 font-medium">{item.name}</td>
                        <td className="p-3">{item.quantity}</td>
                        <td className="p-3">{item.unit}</td>
                        <td className="p-3">
                          {item.estimatedCost
                            ? `$${item.estimatedCost.toFixed(2)}`
                            : "TBD"}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                {bomData.length > 5 && (
                  <div className="p-3 text-center text-gray-500 border-t bg-gray-50">
                    ... and {bomData.length - 5} more items
                  </div>
                )}
              </div>

              <div className="flex justify-end">
                <Button
                  onClick={handleSaveBom}
                  disabled={
                    isProcessing ||
                    isSaving ||
                    !experimentName.trim() ||
                    !experimentDescription.trim()
                  }
                  className="flex items-center gap-2"
                >
                  <FileText className="h-4 w-4" />
                  {isSaving ? "Saving..." : "Save Experiment BoM"}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
