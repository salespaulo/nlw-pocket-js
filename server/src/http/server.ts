import fastify from "fastify";
import { createGoalSchema, createGoal, getWeekPendingGoal } from '../goal'

const app = fastify()

app.post('/goals', async req => {
    const goal = createGoalSchema.parse(req.body)
    await createGoal({
        title: goal.title,
        desireWeeklyFrequency: goal.desireWeeklyFrequency
    })
})

app.get('/goals/pending', async () => {
    return await getWeekPendingGoal()
})

app.listen({ port: 3333 })
    .then(() => console.log("HTTP Server Running"))
    .catch(err => console.error(err))