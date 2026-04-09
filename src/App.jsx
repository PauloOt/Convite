import { Routes, Route } from 'react-router-dom'
import RSVP from './pages/RSVP'
import Obrigado from './pages/Obrigado'
import Admin from './pages/Admin'

export default function App() {
  return (
    <Routes>
      <Route path="/"         element={<RSVP />} />
      <Route path="/obrigado" element={<Obrigado />} />
      <Route path="/admin"    element={<Admin />} />
    </Routes>
  )
}
