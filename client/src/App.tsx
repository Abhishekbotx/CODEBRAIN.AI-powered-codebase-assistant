import './App.css'
import { AppShell } from './app/AppShell'
import { ToastProvider } from './components/toast/ToastProvider'

export default function App() {
  return (
    <ToastProvider>
      <AppShell />
    </ToastProvider>
  )
}
