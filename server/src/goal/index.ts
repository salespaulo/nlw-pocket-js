import z from "zod"
import { db } from "../db"
import { goalCompletions, goals } from "../db/schema"
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { and, count, eq, gte, lte } from "drizzle-orm"

dayjs.extend(weekOfYear)

interface CreateGoal {
    title: string,
    desireWeeklyFrequency: number
}

export const createGoalSchema = z.object({
    title: z.string(),
    desireWeeklyFrequency: z.number().int().min(1).max(7)
})

export const createGoal = async ({ title, desireWeeklyFrequency }: CreateGoal) => {
    const result = await db.insert(goals).values({ title, desireWeeklyFrequency }).returning()
    const goal = result[0]

    return {
        goal
    }
}

export const getWeekPendingGoal = async () => {
    const firstDayOfWeek = dayjs().startOf('week').toDate()
    const lastDayOfWeek = dayjs().endOf('week').toDate()

    const goalsCreateUpToWeek = db.$with('goals_created_up_to_week').as(
        db.select({
            id: goals.id,
            title: goals.title,
            desireWeeklyFrequency: goals.desireWeeklyFrequency,
            createAt: goals.createAt

        }).from(goals)
            .where(lte(goals.createAt, lastDayOfWeek))
    )

    const goalsCompletionCount = db.$with('goal_completion_count').as(
        db.select({
            goalId: goalCompletions.goalId,
            completationCount: count(goalCompletions.id).as('completationCount')
        }).from(goalCompletions)
            .where(and(lte(goalCompletions.createAt, lastDayOfWeek), gte(goalCompletions.createAt, firstDayOfWeek)))
            .groupBy(goalCompletions.goalId)
    )

    const pendingGoals = await db
        .with(goalsCreateUpToWeek, goalsCompletionCount)
        .select({
            id: goalsCreateUpToWeek.id,
            title: goalsCreateUpToWeek.title,
            desireWeeklyFrequency: goalsCreateUpToWeek.desireWeeklyFrequency,
            completationCount: goalsCompletionCount.completationCount
        })
        .from(goalsCreateUpToWeek)
        .leftJoin(goalsCompletionCount, eq(goalsCompletionCount.goalId, goalsCreateUpToWeek.id))

    return {
        pendingGoals
    }
}