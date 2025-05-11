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
import { Button } from "@/components/ui/button"
import { useSignOut } from '@/features/auth/hooks/use-sign-out'

export const Route = createFileRoute('/profile')({
  component: ProfilePage,
})

function ProfilePage() {
    const { data: user, isLoading } = useAuth()
    const { mutate: signOut } = useSignOut();

    if (isLoading) {
        return <div className="p-4 text-center">Loading profile…</div>
    }

    // If not logged in, redirect to sign‑in
    if (!user) {
        return <Navigate to="/sign-in" />
    }

    return (
        <>
        <div className="min-h-screen bg-gray-50 py-8 flex flex-col items-center gap-6 px-4">
        <Card className="w-1/2">
            <CardHeader>
                <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
                <dl className="grid grid-cols-1 gap-2">
                    <dt>Display Name</dt>
                    <dd>{user.username}</dd>
                    <dt>Prestige Points</dt>
                    <dd>#</dd>
                </dl>
                <Button onClick={() => signOut()} variant="outline" className="bg-red-500 text-gray-50">Logout</Button>
            </CardContent>
        </Card>
        <Card className="w-1/2">
            <CardHeader>
                <CardTitle>Your Favorite Heroes</CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col md:flex-row gap-6 text-center px-4 py-2">
                <Card className="w-max whitespace-nowrap text-center px-4 py-2">
                    <CardHeader><CardTitle>Hero 1</CardTitle></CardHeader>
                    <CardContent><p>Statistics</p></CardContent>
                </Card>
                <Card className="w-max whitespace-nowrap text-center px-4 py-2">
                    <CardHeader><CardTitle>Hero 2</CardTitle></CardHeader>
                    <CardContent><p>Statistics</p></CardContent>
                </Card>
                <Card className="w-max whitespace-nowrap text-center px-4 py-2">
                    <CardHeader><CardTitle>Hero 3</CardTitle></CardHeader>
                    <CardContent><p>Statistics</p></CardContent>
                </Card>
            </CardContent>
        </Card>
        <Card className="w-1/2">
            <CardHeader>
                <CardTitle>Game Stats</CardTitle>
            </CardHeader>
            <CardContent>
                <dl className="grid grid-cols-1 gap-2">
                    <dt>Calamities Resolved</dt>
                    <dd>#</dd>
                    <dt>Calamities Resolved</dt>
                    <dd>#</dd>
                    <dt>Calamaties Failed</dt>
                    <dd>#</dd>
                    <dt>Calamity Resolution Rate</dt>
                    <dd>%</dd>
                </dl>
            </CardContent>
        </Card>
        </div>
        </>
    )
}
