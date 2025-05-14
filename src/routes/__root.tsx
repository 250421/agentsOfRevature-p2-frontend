import { Outlet, createRootRoute } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import { Toaster } from 'sonner'
import { NavBar } from '@/components/shared/NavBar'

export const Route = createRootRoute({
  component: () => (
    <>
      <NavBar />

      <Toaster />
      <Outlet />
      <TanStackRouterDevtools />
    </>
  ),
})
