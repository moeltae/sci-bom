import { Button } from "@/components/ui/button";
import { Eye } from "lucide-react";
import { AuthForm } from "@/components/auth/AuthForm";
import { Link, useNavigate } from "react-router-dom";

function AuthPage() {
  const navigate = useNavigate();
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
        <AuthForm onAuthenticated={() => navigate("/")} />
        <div className="mt-6 text-center">
          <Link to="/demo">
            <Button
              variant="outline"
              className="flex items-center gap-2 mx-auto"
            >
              <Eye className="h-4 w-4" />
              View UI Demo
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
}

export default AuthPage;
