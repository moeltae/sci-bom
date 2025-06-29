
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, DollarSign, Users, TrendingUp } from "lucide-react";
import { AuthForm } from "@/components/auth/AuthForm";
import { Dashboard } from "@/components/dashboard/Dashboard";

const Index = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">BoM Generator</h1>
            <p className="text-gray-600">Streamline your biotech experiment planning</p>
          </div>
          <AuthForm onAuthenticated={() => setIsAuthenticated(true)} />
        </div>
      </div>
    );
  }

  return <Dashboard />;
};

export default Index;
