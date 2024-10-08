export type SummaryResponse = {
  total: number
  completed: number
  goalsPerDay: Record<
    string,
    {
      id: string
      title: string
      createAt: string
    }[]
  >
}

export type PendingGoalsResponse = {
  id: string
  title: string
  desireWeeklyFrequency: number
  completionCount: number
}[]

export const getSummary = async (): Promise<SummaryResponse> => {
  const res = await fetch('http://localhost:3333/goals/summary')
  const data = await res.json()
  return data.summary
}

export const getPending = async (): Promise<PendingGoalsResponse> => {
  const res = await fetch('http://localhost:3333/goals/pending')
  const data = await res.json()
  return data.pendingGoals
}

export const createGoal = async (
  title: string,
  desireWeeklyFrequency: number
): Promise<void> => {
  await fetch('http://localhost:3333/goals', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      title,
      desireWeeklyFrequency,
    }),
  })
}
export const createGoalCompletion = async (goalId: string): Promise<void> => {
  await fetch('http://localhost:3333/goals/complete', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ goalId }),
  })
}
