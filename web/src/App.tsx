import { Dialog } from './components/ui/dialog'
import { CreateGoal } from './components/ui/create-goal.tsx'
import { SummaryGoal } from './components/ui/summary-goal.tsx'

export const App = () => {
  return (
    <Dialog>
      {/*<EmptyGoal />*/}
      <SummaryGoal />
      <CreateGoal />
    </Dialog>
  )
}
