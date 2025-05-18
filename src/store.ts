import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface Store {
    loggedIn: boolean
    login: () => void
    logout: () => void
    username: string
    setUsername: (username: string) => void
}

const useStore = create<Store>()(
    persist(
        (set) => ({
            loggedIn: false,
            login: () => set({ loggedIn: true }),
            logout: () => set({ loggedIn: false }),
            username: '',
            setUsername: (username: string) => set({ username }),
        }),
        { name: 'store' }
    ))

export const { getState, setState } = useStore;
export default useStore
