import fastify from 'fastify'
import cors from '@fastify/cors'
import {
    createGoal,
    createGoalCompletion,
    createGoalCompletionSchema,
    createGoalSchema,
    getWeekPendingGoal,
    getWeekSummary,
} from '../goal'

const app = fastify()
app.register(cors, { origin: '*' })

app.post('/goals', async req => {
  const goal = createGoalSchema.parse(req.body)
  await createGoal({
    title: goal.title,
    desireWeeklyFrequency: goal.desireWeeklyFrequency,
  })
})

app.post('/goals/complete', async req => {
  try {
    const goal = createGoalCompletionSchema.parse(req.body)
    return createGoalCompletion(goal)
  } catch (error) {
    console.error(error)
  }
})

app.get('/goals/pending', async () => {
  return await getWeekPendingGoal()
})

app.get('/goals/summary', async () => {
  return await getWeekSummary()
})

app
  .listen({ port: 3333 })
  .then(() => console.log('HTTP Server Running'))
  .catch(err => console.error(err))
