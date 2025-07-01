import React, { useState, useEffect, ReactNode } from "react";
import { Alert, AlertDescription, AlertTitle } from "./alert";
import { Button } from "./button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./card";
import formatError from "@/lib/formatError";

interface ErrorBoundaryProps {
  children: ReactNode;
  fallback?: ReactNode;
  onError?: (error: Error, errorInfo: React.ErrorInfo) => void;
}

interface ErrorState {
  hasError: boolean;
  error: Error | null;
  errorInfo: React.ErrorInfo | null;
}

const ErrorBoundary: React.FC<ErrorBoundaryProps> = ({
  children,
  fallback,
  onError,
}) => {
  const [errorState, setErrorState] = useState<ErrorState>({
    hasError: false,
    error: null,
    errorInfo: null,
  });

  useEffect(() => {
    const handleError = (error: ErrorEvent) => {
      const errorInfo: React.ErrorInfo = {
        componentStack: error.error?.stack || "",
      };

      setErrorState({
        hasError: true,
        error: error.error || new Error(error.message),
        errorInfo,
      });

      // Call the onError callback if provided
      if (onError) {
        onError(error.error || new Error(error.message), errorInfo);
      }

      // Log the error to console in development
      console.error("Error caught by ErrorBoundary:", error.error);
      console.error("Error info:", errorInfo);
    };

    const handleUnhandledRejection = (event: PromiseRejectionEvent) => {
      const error =
        event.reason instanceof Error
          ? event.reason
          : new Error(String(event.reason));
      const errorInfo: React.ErrorInfo = {
        componentStack: error.stack || "",
      };

      setErrorState({
        hasError: true,
        error,
        errorInfo,
      });

      // Call the onError callback if provided
      if (onError) {
        onError(error, errorInfo);
      }

      // Log the error to console in development
      console.error(
        "Unhandled promise rejection caught by ErrorBoundary:",
        error
      );
      console.error("Error info:", errorInfo);
    };

    // Add global error listeners
    window.addEventListener("error", handleError);
    window.addEventListener("unhandledrejection", handleUnhandledRejection);

    return () => {
      // Cleanup listeners
      window.removeEventListener("error", handleError);
      window.removeEventListener(
        "unhandledrejection",
        handleUnhandledRejection
      );
    };
  }, [onError]);

  const handleRetry = () => {
    setErrorState({
      hasError: false,
      error: null,
      errorInfo: null,
    });
  };

  const handleReload = () => {
    window.location.reload();
  };

  if (errorState.hasError) {
    // If a custom fallback is provided, use it
    if (fallback) {
      return <>{fallback}</>;
    }

    // Default error UI
    const errorMessage = formatError(errorState.error);
    const errorStack = errorState.error?.stack;

    return (
      <div className="min-h-screen flex items-center justify-center p-4">
        <Card className="w-full max-w-2xl">
          <CardHeader>
            <CardTitle className="text-destructive">
              Something went wrong
            </CardTitle>
            <CardDescription>
              An unexpected error occurred. Please try again or reload the page.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <Alert variant="destructive">
              <AlertTitle>Error Details</AlertTitle>
              <AlertDescription className="font-mono text-sm">
                {errorMessage}
              </AlertDescription>
            </Alert>

            {errorStack && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium">
                  Stack Trace (Development)
                </h4>
                <pre className="text-xs bg-muted p-3 rounded-md overflow-auto max-h-40">
                  {errorStack}
                </pre>
              </div>
            )}
          </CardContent>
          <CardFooter className="flex gap-2">
            <Button onClick={handleRetry} variant="default">
              Try Again
            </Button>
            <Button onClick={handleReload} variant="outline">
              Reload Page
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return <>{children}</>;
};

export default ErrorBoundary;
