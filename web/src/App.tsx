import { CreateGoal } from './components/ui/create-goal.tsx'
import { Dialog } from './components/ui/dialog'
import { SummaryGoal } from './components/ui/summary-goal.tsx'
import { EmptyGoal } from './components/ui/empty-goal.tsx'
import { useQuery } from '@tanstack/react-query'
import { getSummary } from './http/goals.ts'

export const App = () => {
  const { data } = useQuery({
    queryKey: ['getSummary'],
    queryFn: async () => getSummary(),
    staleTime: 1000 * 60,
  })

  return (
    <Dialog>
      {data?.total && data.total > 0 ? <SummaryGoal /> : <EmptyGoal />}
      <CreateGoal />
    </Dialog>
  )
}
