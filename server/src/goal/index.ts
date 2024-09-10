import z from "zod"
import { db } from "../db"
import { goalCompletions, goals } from "../db/schema"
import dayjs from 'dayjs'
import weekOfYear from 'dayjs/plugin/weekOfYear'
import { and, count, desc, eq, gte, lte, sql } from "drizzle-orm"

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

interface CreateGoalCompletion {
    goalId: string,
}

export const createGoalCompletionSchema = z.object({
    goalId: z.string()
})

export const createGoalCompletation = async ({ goalId }: CreateGoalCompletion) => {
    const firstDayOfWeek = dayjs().startOf('week').toDate()
    const lastDayOfWeek = dayjs().endOf('week').toDate()
    const goalsCompletionCount = createGoalsCompletionCount(firstDayOfWeek, lastDayOfWeek)

    const goalCompletation = await db.with(goalsCompletionCount)
        .select({
            desireWeeklyFrequency: goals.desireWeeklyFrequency,
            completationCount: goalsCompletionCount.completationCount
        })
        .from(goals)
        .where(eq(goals.id, goalId))
        .leftJoin(goalsCompletionCount, eq(goalsCompletionCount.goalId, goals.id))
        .limit(1)

    const { desireWeeklyFrequency, completationCount } = goalCompletation[0]

    if (completationCount >= desireWeeklyFrequency) {
        throw new Error("Goal already completed this week!")
    }

    const result = await db.insert(goalCompletions).values({ goalId }).returning()
    const goalCompletion = result[0]

    return {
        goalCompletion
    }
}

export const getWeekPendingGoal = async () => {
    const firstDayOfWeek = dayjs().startOf('week').toDate()
    const lastDayOfWeek = dayjs().endOf('week').toDate()

    const goalsCreateUpToWeek = createGoalsCreateUpToWeek(lastDayOfWeek)
    const goalsCompletionCount = createGoalsCompletionCount(firstDayOfWeek, lastDayOfWeek)

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

export const getWeekSummary = async () => {
    const firstDayOfWeek = dayjs().startOf('week').toDate()
    const lastDayOfWeek = dayjs().endOf('week').toDate()
    const goalsCreatedUpToWeek = createGoalsCreateUpToWeek(lastDayOfWeek)
    const goalsCompletedInWeek = db.$with('goals_completed_in_week').as(
        db
            .select({
                id: goalCompletions.id,
                title: goals.title,
                completedAt: goalCompletions.createAt,
                completedAtDate: sql /*sql*/`
                    DATE(${goalCompletions.createAt})
                `.as('completedAtDate'),
            })
            .from(goalCompletions)
            .innerJoin(goals, eq(goals.id, goalCompletions.goalId))
            .where(
                and(
                    gte(goalCompletions.createAt, firstDayOfWeek),
                    lte(goalCompletions.createAt, lastDayOfWeek)
                )
            )
            .orderBy(desc(goalCompletions.createAt))
    )

    const goalsCompletedByWeekDay = db.$with('goals_completed_by_week_day').as(
        db
            .select({
                completedAtDate: goalsCompletedInWeek.completedAtDate,
                completions: sql /*sql*/`
          JSON_AGG(
            JSON_BUILD_OBJECT(
              'id', ${goalsCompletedInWeek.id},
              'title', ${goalsCompletedInWeek.title},
              'completedAt', ${goalsCompletedInWeek.completedAt}
            )
          )
        `.as('completions'),
            })
            .from(goalsCompletedInWeek)
            .groupBy(goalsCompletedInWeek.completedAtDate)
            .orderBy(desc(goalsCompletedInWeek.completedAtDate))
    )

    type GoalsPerDay = Record<
        string,
        {
            id: string
            title: string
            completedAt: string
        }[]
    >

    const result = await db
        .with(goalsCreatedUpToWeek, goalsCompletedInWeek, goalsCompletedByWeekDay)
        .select({
            completed:
                sql /*sql*/`(SELECT COUNT(*) FROM ${goalsCompletedInWeek})`.mapWith(
                    Number
                ),
            total:
                sql /*sql*/`(SELECT SUM(${goalsCreatedUpToWeek.desireWeeklyFrequency}) FROM ${goalsCreatedUpToWeek})`.mapWith(
                    Number
                ),
            goalsPerDay: sql /*sql*/<GoalsPerDay>`
        JSON_OBJECT_AGG(
          ${goalsCompletedByWeekDay.completedAtDate},
          ${goalsCompletedByWeekDay.completions}
        )
      `,
        })
        .from(goalsCompletedByWeekDay)

    return {
        summary: result[0]
    }
}

const createGoalsCompletionCount = (firstDayOfWeek: Date, lastDayOfWeek: Date) =>
    db.$with('goal_completion_count').as(
        db.select({
            goalId: goalCompletions.goalId,
            completationCount: count(goalCompletions.id).as('completationCount')
        }).from(goalCompletions)
            .where(and(lte(goalCompletions.createAt, lastDayOfWeek), gte(goalCompletions.createAt, firstDayOfWeek)))
            .groupBy(goalCompletions.goalId)
    )

const createGoalsCreateUpToWeek = (lastDayOfWeek: Date) =>
    db.$with('goals_created_up_to_week').as(
        db.select({
            id: goals.id,
            title: goals.title,
            desireWeeklyFrequency: goals.desireWeeklyFrequency,
            createAt: goals.createAt

        }).from(goals)
            .where(lte(goals.createAt, lastDayOfWeek))
    )
