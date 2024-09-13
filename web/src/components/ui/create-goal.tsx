import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
} from './dialog.tsx'
import { X } from 'lucide-react'
import { Label } from './label.tsx'
import { Input } from './input.tsx'
import {
  RadioGroup,
  RadioGroupIndicator,
  RadioGroupItem,
} from './radio-group.tsx'
import { Button } from './button.tsx'

export const CreateGoal = () => {
  const frequencies: Array<string> = [ '🥱', '🙂', '😎', '🤨', '😜', '🤯', '🔥' ];

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
        <form action={''} className={'flex flex-col justify-between flex-1'}>
          <div className={'flex flex-col gap-6'}>
            <div className={'flex flex-col gap-2'}>
              <Label htmlFor={'title'}>Qual a atividade?</Label>
              <Input
                id={'title'}
                autoFocus
                placeholder={'Praticar exercícios, meditar, etc...'}
              />
            </div>
            <div className={'flex flex-col gap-2'}>
              <Label htmlFor={'frequency'}>Quantas vezes na semana?</Label>
              <RadioGroup id={'frequency'}>
                {frequencies.map((emoji, index) => (
                  <RadioGroupItem key={`radio-freq-${index + 1}`} value={'1'}>
                    <RadioGroupIndicator />
                    <span
                      className={
                        'text-zinc-300 text-sm font-medium leading-none'
                      }
                    >
                      {index + 1} x na semana
                    </span>
                    <span className={'text-lg leading-none'}>{emoji}</span>
                  </RadioGroupItem>
                ))}
              </RadioGroup>
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
