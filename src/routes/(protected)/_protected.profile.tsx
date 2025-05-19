import { createFileRoute, Navigate } from '@tanstack/react-router'
import { useAuth } from '@/features/auth/hooks/use-auth'
import {
    Card,
    CardContent,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useSignOut } from '@/features/auth/hooks/use-sign-out'
import { useConfirm } from '@/hooks/use-confirm'
import { useUserResults } from '@/features/results/hooks/useUserResults'

export const Route = createFileRoute('/(protected)/_protected/profile')({
  component: ProfilePage,
})

function ProfilePage() {
    const { data: user, isLoading } = useAuth()
    
    // methods for confirm dialog
    const [logOutConfirm, LogOutDialog] = useConfirm();
    const { mutate: signOut } = useSignOut();
    const handleLogOut =  async () => {
        const ok = await logOutConfirm();
        if (!ok) return;
        signOut();
    }

    if (isLoading) {
        return <div className="p-4 text-center">Loading profile…</div>
    }

    if (!user) {
        return <Navigate to="/sign-in" />
    }

    const { data: results = [], isLoading: resultsLoading } =
    useUserResults(user.id)

    if (resultsLoading) return <div>Loading your stats…</div>

    const totalPrestige = results.reduce((sum, r) => sum + r.repGained, 0)
    const calamitiesResolved = results.filter((r) => r.didWin).length
    const calamitiesFailed = results.filter((r) => !r.didWin).length
    const totalCalamities = calamitiesResolved + calamitiesFailed
    let resolutionRate = 0.00;
    if (totalCalamities != 0) { // to avoid NaN
        resolutionRate = (Math.round((calamitiesResolved / totalCalamities) * 100)).toFixed(2) as unknown as number;
    } 

    return (
        <>
        <div className="min-h-screen bg-slate-900 py-8 flex flex-col items-center gap-6 px-4">
        <Card className="w-1/2">
            <CardHeader>
                <CardTitle>Your Profile</CardTitle>
            </CardHeader>
            <CardContent>
                <dl className="grid grid-cols-1 gap-2">
                    <div className="flex flex-row"><dt>Display Name:&nbsp;</dt>
                    <dd>{user.username}</dd></div>
                    <div className="flex flex-row"><dt>Prestige Points:&nbsp;</dt>
                    <dd>{totalPrestige}</dd></div>
                </dl>
                <Button onClick={handleLogOut} variant="outline" className="bg-red-500 text-gray-50 mt-3">Logout</Button>
            </CardContent>
        </Card>

        {/* confirm dialog */}
        <LogOutDialog 
            title={'Log Out'} 
            description={'Are you sure you want to log out?'} 
            destructive={true}
        /> 

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
                    <div className="flex flex-row"><dt>Total Calamities Attempted:&nbsp;</dt>
                    <dd>{totalCalamities}</dd></div>
                    <div className="flex flex-row"><dt>Calamities Resolved:&nbsp;</dt>
                    <dd>{calamitiesResolved}</dd></div>
                    <div className="flex flex-row"><dt>Calamaties Failed:&nbsp;</dt>
                    <dd>{calamitiesFailed}</dd></div>
                    <div className="flex flex-row"><dt>Calamity Resolution Rate:&nbsp;</dt>
                    <dd>{resolutionRate}%</dd></div>
                </dl>
            </CardContent>
        </Card>
        </div>
        </>
    )
}
