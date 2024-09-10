import fastify from "fastify";
import cors from "@fastify/cors"
import {
    createGoalSchema,
    createGoal,
    getWeekPendingGoal,
    createGoalCompletionSchema,
    createGoalCompletation,
    getWeekSummary
} from '../goal'

const app = fastify()
app.register(cors, { origin: "*" })

app.post('/goals', async req => {
    const goal = createGoalSchema.parse(req.body)
    await createGoal({
        title: goal.title,
        desireWeeklyFrequency: goal.desireWeeklyFrequency
    })
})

app.post('/goals/complete', async req => {
    const goal = createGoalCompletionSchema.parse(req.body)
    return createGoalCompletation(goal)
})

app.get('/goals/pending', async () => {
    return await getWeekPendingGoal()
})

app.get('/goals/summary', async () => {
    const summary = await getWeekSummary()
    return summary
})

app.listen({ port: 3333 })
    .then(() => console.log("HTTP Server Running"))
    .catch(err => console.error(err))