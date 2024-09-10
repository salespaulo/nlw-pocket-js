import { db, client } from "."
import { goalCompletions, goals } from "./schema"
import dayjs from 'dayjs'

const seed = async () => {
    await db.delete(goalCompletions)
    await db.delete(goals)

    const result = await db.insert(goals).values([{
        title: "Acordar cedo",
        desireWeeklyFrequency: 5
    }, {
        title: "Me exercitar",
        desireWeeklyFrequency: 3
    }, {
        title: "Meditar",
        desireWeeklyFrequency: 1
    }]).returning()

    const startOfWeek = dayjs().startOf('week')
    await db.insert(goalCompletions).values([{
        goalId: result[0].id,
        createAt: startOfWeek.toDate()
    }, {
        goalId: result[1].id,
        createAt: startOfWeek.add(1, 'day').toDate()
    }])
}

seed().finally(() => client.end())