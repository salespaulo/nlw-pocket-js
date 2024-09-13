import { CheckCircle2, Plus } from 'lucide-react'
import { Button } from './button.tsx'
import { DialogTrigger } from './dialog.tsx'
import { InOrbitIcon } from './in-orbit-icon.tsx'
import { OutlineButton } from './outline-button.tsx'
import { Progress, ProgressIndicator } from './progress-bar.tsx'
import { Separator } from './separator.tsx'

export const SummaryGoal = () => {
  const metas = ['Meditar', 'Nadar', 'Praticar exercício', 'Me alimentar bem']
  const completed = [
    {
      day: 'Segunda-feira',
      date: '10 de Agosto',
      metas: [{ title: 'Nadar', hora: '08:30' }],
    },
    {
      day: 'Domingo',
      date: '09 de Agosto',
      metas: [
        { title: 'Meditar', hora: '12:00' },
        { title: 'Se alimentar direito', hora: '19:00' },
      ],
    },
    {
      day: 'Terça-feira',
      date: '11 de Agosto',
      metas: [
        { title: 'Nadar', hora: '09:00' },
        { title: 'Meditar', hora: '23:59' },
      ],
    },
  ]
  const style = { width: '50%' }

  return (
    <div className={'py-10 max-w-[480px] px-5 mx-auto flex flex-col gap-6'}>
      <div className={'flex items-center justify-between'}>
        <div className={'flex items-center gap-3'}>
          <InOrbitIcon />
          <span className={'text-lg font-semibold'}>5 a 10 de Agosto</span>
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
            Você completou <span className={'text-zinc-100'}>8</span> de{' '}
            <span className={'text-zinc-100'}>15</span> metas nessa semana
          </span>
          <span>50%</span>
        </div>
      </div>
      <Separator />
      <div className={'flex flex-wrap gap-3'}>
        {metas.map((meta, index) => (
          <OutlineButton key={`metas-${index + 1}`}>
            <Plus className={'size-4 text-zinc-600'} />
            {meta}
          </OutlineButton>
        ))}
      </div>
      <div className={'flex flex-col gap-6'}>
        <h2 className={'text-xl font-medium'}>Sua semana</h2>
        <div className={'flex flex-col gap-4'}>
          {completed.map((meta, index) => (
            <>
              <h3 key={`completed-${index + 1}`} className={'font-medium'}>
                {meta.day}{' '}
                <span className={'text-zinc-400 text-sm'}>({meta.date})</span>
              </h3>
              <ul
                key={`completed-meta-${index + 1}`}
                className={'flex flex-col gap-3'}
              >
                {meta.metas.map((metaComp, index) => (
                  <li
                    key={`completed-meta-one-${index + 1}`}
                    className={'flex items-center gap-2'}
                  >
                    <CheckCircle2 className={'size-4 text-pink-500'} />
                    <span className={'text-sm text-zinc-400'}>
                      Você completou{' '}
                      <span className={'text-zinc-100'}>
                        "{metaComp.title}"
                      </span>{' '}
                      às{' '}
                      <span className={'text-zinc-100'}>{metaComp.hora}h</span>
                    </span>
                  </li>
                ))}
              </ul>
            </>
          ))}
        </div>
      </div>
    </div>
  )
}
