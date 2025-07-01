import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Upload, FileText, DollarSign, Users, TrendingUp, Eye } from "lucide-react";
import { AuthForm } from "@/components/auth/AuthForm";
import { Dashboard } from "@/components/dashboard/Dashboard";
import { useAuth } from "@/contexts/AuthContext";
import { Link } from "react-router-dom";

const Index = () => {
  const { user, loading } = useAuth();

  // Show loading state while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Show auth form if not authenticated
  if (!user) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              BoM Generator
            </h1>
            <p className="text-gray-600">
              Streamline your biotech experiment planning
            </p>
          </div>
          <AuthForm onAuthenticated={() => {}} />
          <div className="mt-6 text-center">
            <Link to="/demo">
              <Button variant="outline" className="flex items-center gap-2 mx-auto">
                <Eye className="h-4 w-4" />
                View UI Demo
              </Button>
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Show dashboard if authenticated
  return <Dashboard />;
};

export default Index;
