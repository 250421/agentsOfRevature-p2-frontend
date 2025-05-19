import { createFileRoute, Navigate, Outlet } from "@tanstack/react-router";
import useStore from "@/store";

export const Route = createFileRoute("/(public)/_public")({
  component: PublicLayout,
});

function PublicLayout() {
  const loggedIn = useStore((state) => state.loggedIn);

  if (loggedIn) {
    return <Navigate to="/" />;
  }

  return <Outlet />;
}
