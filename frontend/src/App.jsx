import { useState } from "react"
import Login from "./pages/Login"
import Dashboard from "./pages/Dashboard"
import AdminDashboard from "./pages/AdminDashboard"

export default function App() {
  const [teacher, setTeacher] = useState(null)

  if (!teacher) return <Login onLogin={setTeacher} />
  if (teacher.role === "ADMIN" || teacher.username === "admin") {
    return <AdminDashboard onLogout={() => setTeacher(null)} />
  }
  return <Dashboard teacher={teacher} onLogout={() => setTeacher(null)} />
}