import { createFileRoute, Navigate, Outlet } from '@tanstack/react-router'
import { useAuth } from '@/features/auth/hooks/use-auth'
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

function ProfilePage() {
  const { data: user, isLoading } = useAuth()

  if (isLoading) {
    return <div className="p-4 text-center">Loading profile…</div>
  }

  // If not logged in, redirect to sign‑in
  if (!user) {
    return <Navigate to="/sign-in" />
  }

  return (
    <>
    <Card className="flex justify-center items-center w-1/2">
        <CardHeader>
            <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
            <dl className="grid grid-cols-1 gap-2">
                <dt>Display Name</dt>
                <dd>Jane Doe</dd>
                <dt>Email</dt>
                <dd>test@email.com</dd>
                <dt>Prestige Points</dt>
                <dd>#</dd>
            </dl>
        </CardContent>
    </Card>
    <Card className="flex justify-center items-center w-1/2">
        <CardHeader>
            <CardTitle>Your Profile</CardTitle>
        </CardHeader>
        <CardContent>
            <dl className="grid grid-cols-1 gap-2">
                <dt>Calamities Resolved</dt>
                <dd>#</dd>
                <dt>Calamaties Failed</dt>
                <dd>#</dd>
                <dt>Calamity Restoration Rate</dt>
                <dd>%</dd>
            </dl>
        </CardContent>
    </Card>
    
    </>
  )
}
