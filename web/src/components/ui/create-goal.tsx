import { zodResolver } from '@hookform/resolvers/zod'
import { X } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import zod from 'zod'
import { Button } from './button.tsx'
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from './dialog.tsx'
import { Input } from './input.tsx'
import { Label } from './label.tsx'
import {
  RadioGroup,
  RadioGroupIndicator,
  RadioGroupItem,
} from './radio-group.tsx'
import { createGoal } from '../../http/goals.ts'
import { useQueryClient } from '@tanstack/react-query'

const createGoalForm = zod.object({
  title: zod.string().min(1, 'Informa a atividade que deseja realizar'),
  desireWeeklyFrequency: zod.coerce.number().min(1).max(7),
})

type CreateGoalForm = zod.infer<typeof createGoalForm>

export const CreateGoal = () => {
  const queryClient = useQueryClient()
  const { register, control, handleSubmit, formState, reset } =
    useForm<CreateGoalForm>({
      resolver: zodResolver(createGoalForm),
    })

  const frequencies: Array<string> = ['🥱', '🙂', '😎', '🤨', '😜', '🤯', '🔥']

  const handleCreateGoal = async ({
    title,
    desireWeeklyFrequency,
  }: CreateGoalForm) => {
    await createGoal(title, desireWeeklyFrequency)
    await queryClient.invalidateQueries({ queryKey: ['getSummary'] })
    await queryClient.invalidateQueries({ queryKey: ['getPending'] })
    reset()
  }

  return (
    <DialogContent>
      <div className={'flex flex-col gap-6 h-full'}>
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <DialogTitle>Cadastrar meta</DialogTitle>
            <DialogClose>
              <X className={'size-5 text-zinc-600'} />
            </DialogClose>
          </div>
          <DialogDescription>
            Adicione atividades que te fazem bem e que você quer continuar
            praticando toda semana.
          </DialogDescription>
        </div>
        <form
          onSubmit={handleSubmit(handleCreateGoal)}
          className={'flex flex-col justify-between flex-1'}
        >
          <div className={'flex flex-col gap-6'}>
            <div className={'flex flex-col gap-2'}>
              <Label htmlFor={'title'}>Qual a atividade?</Label>
              <Input
                id={'title'}
                autoFocus
                placeholder={'Praticar exercícios, meditar, etc...'}
                {...register('title')}
              />
              {formState.errors.title && (
                <p className={'text-red-400 text-sm'}>
                  {formState.errors.title.message}
                </p>
              )}
            </div>
            <div className={'flex flex-col gap-2'}>
              <Label htmlFor={'frequency'}>Quantas vezes na semana?</Label>
              <Controller
                control={control}
                name={'desireWeeklyFrequency'}
                defaultValue={3}
                render={({ field }) => (
                  <RadioGroup
                    value={String(field.value)}
                    onValueChange={field.onChange}
                  >
                    {frequencies.map((emoji, index) => (
                      <RadioGroupItem
                        key={`radio-freq-${index + 1}`}
                        value={String(index + 1)}
                      >
                        <RadioGroupIndicator />
                        {index < 6 ? (
                          <span
                            className={
                              'text-zinc-300 text-sm font-medium leading-none'
                            }
                          >
                            {index + 1} x na semana
                          </span>
                        ) : (
                          <span
                            className={
                              'text-zinc-300 text-sm font-medium leading-none'
                            }
                          >
                            Todos dias da semana
                          </span>
                        )}
                        <span className={'text-lg leading-none'}>{emoji}</span>
                      </RadioGroupItem>
                    ))}
                  </RadioGroup>
                )}
              />
            </div>
          </div>

          <div className={'flex items-center gap-3'}>
            <DialogClose asChild>
              <Button
                type={'button'}
                className={'flex-1'}
                variant={'secondary'}
              >
                Fechar
              </Button>
            </DialogClose>
            <Button className={'flex-1'}>Salvar</Button>
          </div>
        </form>
      </div>
    </DialogContent>
  )
}
