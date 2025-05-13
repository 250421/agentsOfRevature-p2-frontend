export interface NavItem {
    label: string,
    href: string,
}

export const navItems: NavItem[] = [
    {
        label: 'Calamities',
        href: '/',
    },
    {
        label: 'Game',
        href: '/game',
    },
    {
        label: 'Leaderboard',
        href: '/leaderboard',
    },
    {
        label: 'Profile',
        href: '/profile',
    },
]
