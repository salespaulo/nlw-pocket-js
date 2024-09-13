import {Plus, X} from 'lucide-react'
import letStart from './assets/let-start.svg'
import logo from './assets/logo-in-orbit.svg'
import { Button } from './components/ui/button'
import {Dialog, DialogClose, DialogContent, DialogTitle, DialogTrigger} from './components/ui/dialog'

export const App = () => {
  return (
    <Dialog>
    <div className='h-screen flex flex-col items-center justify-center gap-8'>
      <img src={logo} alt="in-orbit" />
      <img src={letStart} alt="let-start" />
      <p className='text-zinc-300 leading-relaxed max-w-80 text-center'>
        Você ainda não cadastrou nenhuma meta, que tal cadastrar um agora mesmo?
      </p>
      <DialogTrigger asChild>
        <Button>
          <Plus className='size-4'/>
          Cadastrar meta
        </Button>
      </DialogTrigger>
    </div>
    <DialogContent>
      <div className="flex items-center justify-between">
        <DialogTitle>
          Cadastrar meta
        </DialogTitle>
        <DialogClose>
          <X className={"size-5 text-zinc-600"} />
        </DialogClose>
      </div>
    </DialogContent>
    </Dialog>
  )
}
