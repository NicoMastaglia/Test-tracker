import AppRouter from './Router/AppRouter.jsx'
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      <AppRouter />
      <Toaster richColors position='top-center' />
    </>
  )
}

export default App
