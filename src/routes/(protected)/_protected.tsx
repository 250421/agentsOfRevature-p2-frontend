import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import { useAuth } from "@/features/auth/hooks/use-auth";
import { Loader2 } from "lucide-react";

export const Route = createFileRoute("/(protected)/_protected")({
  component: ProtectedLayout,
});

function ProtectedLayout() {
  const { data: user, isLoading } = useAuth();

  if (isLoading)
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="animate-spin" />
      </div>
    );

  if (!user) {
    return <Navigate to="/sign-in" />;
  }

  return <Outlet />;
}
