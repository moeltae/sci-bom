import React from "react";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
} from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";
import Spinner from "@/components/ui/Spinner";
import Header from "@/components/dashboard/Header";

const Account: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spinner />
      </div>
    );
  }

  return (
    <main>
      <Header />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Account</CardTitle>
            <CardDescription>Manage your account information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <div className="text-sm text-muted-foreground mb-1">Email</div>
              <div className="font-medium">{user?.email || "-"}</div>
            </div>
            <div>
              <div className="text-sm text-muted-foreground mb-1">
                Pricing Tier
              </div>
              <div className="font-medium">Free</div>
            </div>
          </CardContent>
        </Card>
      </div>
    </main>
  );
};

export default Account;
