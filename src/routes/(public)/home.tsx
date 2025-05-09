import { CalamityContainer } from '@/features/calamities/components/CalamityContainer'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/(public)/home')({
  component: RouteComponent,
})

function RouteComponent() {
  
  return (
    <div className=''>
      <div className='text-center'>
        <h1 className='text-4xl mt-5'><strong>Active Calamities</strong></h1>
        <p className='text-md p-6'>Greetings, agent 'username'. Choose your next assignment wisely.</p>
        <hr></hr>
      </div>
      <CalamityContainer/>
    </div>
  )
}
