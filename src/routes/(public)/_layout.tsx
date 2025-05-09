import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router'
import { useAuth } from '@/features/auth/hooks/use-auth'
import { Loader2 } from 'lucide-react'

export const Route = createFileRoute('/(public)/_layout')({
  component: PublicLayout,
})

function PublicLayout() {
  const { data: user, isLoading } = useAuth()

  if (isLoading) return <Loader2 className="animate-spin" />

  if (user) {
    return <Navigate to="/" />
  }

  return <Outlet />
}
