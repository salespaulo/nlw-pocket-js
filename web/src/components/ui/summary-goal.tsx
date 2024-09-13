import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import ptBR from 'dayjs/locale/pt-BR'
import { CheckCircle2, Plus } from 'lucide-react'
import { getSummary } from '../../http/goals.ts'
import { Button } from './button.tsx'
import { DialogTrigger } from './dialog.tsx'
import { InOrbitIcon } from './in-orbit-icon.tsx'
import { Progress, ProgressIndicator } from './progress-bar.tsx'
import { Separator } from './separator.tsx'
import { PendingGoal } from './pending-goal.tsx'

dayjs.locale(ptBR)

export const SummaryGoal = () => {
  const { data } = useQuery({
    queryKey: ['getSummary'],
    queryFn: async () => getSummary(),
    staleTime: 1000 * 60,
  })

  if (!data) {
    return null
  }

  const firstDayOfWeek = dayjs().startOf('week').format('D MMM')
  const lastDayOfWeek = dayjs().endOf('week').format('D MMM')
  const completedPercent = Math.round((data?.completed * 100) / data?.total)
  const completed = Object.entries(data.goalsPerDay).map(([key, value]) => {
    const date = dayjs(key).format('D[ de ]MMMM')
    const day = dayjs(key).format('dddd')
    const metas = value.map(meta => {
      const hora = dayjs(meta.createAt).format('HH:mm[h]')
      return {
        title: meta.title,
        hora,
      }
    })
    return {
      day,
      date,
      metas,
    }
  })
  const style = { width: `${completedPercent}` }

  return (
    <div className={'py-10 max-w-[480px] px-5 mx-auto flex flex-col gap-6'}>
      <div className={'flex items-center justify-between'}>
        <div className={'flex items-center gap-3'}>
          <InOrbitIcon />
          <span
            className={'text-lg font-semibold capitalize'}
          >{`${firstDayOfWeek} - ${lastDayOfWeek}`}</span>
        </div>
        <DialogTrigger asChild>
          <Button className={'size-sm'}>
            <Plus className="size-4" />
            Cadastrar meta
          </Button>
        </DialogTrigger>
      </div>
      <div className={'flex flex-col gap-3'}>
        <Progress max={15} value={8}>
          <ProgressIndicator style={style} />
        </Progress>
        <div
          className={'flex items-center justify-between text-xs text-zinc-400'}
        >
          <span>
            Você completou{' '}
            <span className={'text-zinc-100'}>{data?.completed}</span> de{' '}
            <span className={'text-zinc-100'}>{data?.total}</span> metas nessa
            semana
          </span>
          <span>{`${completedPercent}%`}</span>
        </div>
      </div>
      <Separator />
      <PendingGoal />
      <div className={'flex flex-col gap-6'}>
        <h2 className={'text-xl font-medium'}>Sua semana</h2>
        {completed.map((meta, index) => (
          <div
            key={`completed-div-${meta.date}-${index + 1}`}
            className={'flex flex-col gap-4'}
          >
            <h3
              key={`completed-${meta.date}-${index + 1}`}
              className={'font-medium'}
            >
              <span className={'capitalize'}>{meta.day}</span>{' '}
              <span className={'text-zinc-400 text-sm'}>({meta.date})</span>
            </h3>
            <ul
              key={`completed-meta-${meta.date}-${index + 1}`}
              className={'flex flex-col gap-3'}
            >
              {meta.metas.map((metaComp, index) => (
                <li
                  key={`completed-meta-${metaComp.title}-${index + 1}`}
                  className={'flex items-center gap-2'}
                >
                  <CheckCircle2 className={'size-4 text-pink-500'} />
                  <span className={'text-sm text-zinc-400'}>
                    Você completou{' '}
                    <span className={'text-zinc-100'}>"{metaComp.title}"</span>{' '}
                    às <span className={'text-zinc-100'}>{metaComp.hora}h</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  )
}
