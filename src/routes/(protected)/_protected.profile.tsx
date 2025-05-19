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
import { useUserSelections } from '@/features/results/hooks/useUserSelections'

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

    const {
            data: selections,
            isLoading: selLoading,
    } = useUserSelections(results)

    if (resultsLoading || selLoading) return <div>Loading your stats…</div>

    const totalPrestige = results.reduce((sum, r) => sum + r.repGained, 0)
    const calamitiesResolved = results.filter((r) => r.didWin).length
    const calamitiesFailed = results.filter((r) => !r.didWin).length
    const totalCalamities = calamitiesResolved + calamitiesFailed
    let resolutionRate = 0.00;
    if (totalCalamities != 0) { // to avoid NaN
        resolutionRate = (Math.round((calamitiesResolved / totalCalamities) * 100)).toFixed(2) as unknown as number;
    } 

    const freqMap = new Map<string, number>()
    selections?.forEach(s => {
        [s.hero1, s.hero2, s.hero3].forEach(name => {
        freqMap.set(name, (freqMap.get(name) ?? 0) + 1)
        })
    })

    // sort by descending frequency, take top 3
    const top3 = Array.from(freqMap.entries())
        .sort((a, b) => b[1] - a[1])
        .slice(0, 3)
        .map(([name]) => name)

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
                <CardTitle>Your Top 3 Heroes</CardTitle>
            </CardHeader>
            <CardContent>
            {top3.length ? (
                <ol className="list-decimal list-inside space-y-1">
                {top3.map(name => (
                    <li key={name} className="font-medium">{name}</li>
                ))}
                </ol>
            ) : (
                <p className="text-sm text-gray-600">
                You haven’t deployed any heroes yet.
                </p>
            )}
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
