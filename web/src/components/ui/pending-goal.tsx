import { OutlineButton } from './outline-button.tsx'
import { Plus } from 'lucide-react'
import { useQuery } from '@tanstack/react-query'
import { createGoalCompletion, getPending } from '../../http/goals.ts'

export const PendingGoal = () => {
  const { data } = useQuery({
    queryKey: ['getPending'],
    queryFn: async () => getPending(),
    staleTime: 1000 * 60,
  })

  if (!data) {
    return null
  }

  const handlerCompletedGoal = async (goalId: string) => {
    await createGoalCompletion(goalId)
  }

  return (
    <div className={'flex flex-wrap gap-3'}>
      {data.map((meta, index) => (
        <OutlineButton
          key={`metas-${index + 1}`}
          onClick={() => handlerCompletedGoal(meta.id)}
          disabled={meta.completionCount >= meta.desireWeeklyFrequency}
        >
          <Plus className={'size-4 text-zinc-600'} />
          {meta.title}
        </OutlineButton>
      ))}
    </div>
  )
}
