import { useState, useEffect } from "react"
import { getAllStudents } from "../api"

const CLASSES = [
  "Bumblebees 🐝",
  "Little Lambs 🐑",
  "Mountain Movers ⛰️",
  "Lions of Judah 🦁",
]

export default function AdminDashboard({ onLogout }) {
  const [students,    setStudents]    = useState([])
  const [activeClass, setActiveClass] = useState("ALL")

  useEffect(() => { loadAll() }, [])

  async function loadAll() {
    const data = await getAllStudents()
    setStudents(data)
  }

  const filtered = activeClass === "ALL"
    ? students
    : students.filter(s => s.className === activeClass)

  const totalPoints = filtered.reduce((sum, s) => sum + s.points, 0)
  const topStudent  = [...filtered].sort((a, b) => b.lifetimePoints - a.lifetimePoints)[0]

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50">

      {/* Header */}
      <div className="bg-white shadow-sm border-b border-gray-100 px-6 py-4 flex justify-between items-center sticky top-0 z-40">
  <div className="flex items-center gap-3">
    <div className="w-10 h-10 rounded-xl flex items-center justify-center shadow"
      style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>
      <span className="text-xl">👑</span>
    </div>
    <div>
      <h1 className="text-base font-black text-gray-800">Admin Dashboard</h1>
      <p className="text-xs text-gray-400 font-semibold">All Classes Overview</p>
    </div>
  </div>
  <button
    onClick={onLogout}
    className="bg-gray-100 text-gray-500 font-bold px-4 py-2 rounded-xl text-sm hover:bg-gray-200 transition"
  >
    Logout
  </button>
</div>

      <div className="p-6 space-y-6">

        {/* Class filter tabs */}
        <div className="flex gap-2 flex-wrap">
          {["ALL", ...CLASSES].map(cls => (
            <button
              key={cls}
              onClick={() => setActiveClass(cls)}
              className={`px-4 py-2 rounded-xl font-bold text-sm transition ${
                activeClass === cls
                  ? "bg-purple-600 text-white shadow"
                  : "bg-white text-gray-500 hover:bg-purple-50"
              }`}
            >
              {cls === "ALL" ? "🌍 All Classes" : cls}
            </button>
          ))}
        </div>

        {/* Summary cards */}
        <div className="grid grid-cols-4 gap-4">
          <div className="bg-white rounded-2xl p-5 shadow text-center">
            <p className="text-4xl font-extrabold text-purple-600">{filtered.length}</p>
            <p className="text-gray-400 text-sm font-bold mt-1">Total Students</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow text-center">
            <p className="text-4xl font-extrabold text-yellow-500">{totalPoints}</p>
            <p className="text-gray-400 text-sm font-bold mt-1">Points Awarded</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow text-center">
            <p className="text-4xl font-extrabold text-green-500">
              {filtered.reduce((sum, s) => sum + (s.attendance?.length || 0), 0)}
            </p>
            <p className="text-gray-400 text-sm font-bold mt-1">Total Attendances</p>
          </div>
          <div className="bg-white rounded-2xl p-5 shadow text-center">
            <p className="text-2xl font-extrabold text-pink-500">
              {topStudent?.name?.split(" ")[0] || "—"}
            </p>
            <p className="text-gray-400 text-sm font-bold mt-1">🏆 Top Student</p>
          </div>
        </div>

        {/* Per class breakdown */}
        {activeClass === "ALL" && (
          <div className="grid grid-cols-2 gap-4">
            {CLASSES.map(cls => {
              const classStudents = students.filter(s => s.className === cls)
              const classTop      = [...classStudents].sort((a, b) => b.lifetimePoints - a.lifetimePoints)[0]
              return (
                <div key={cls} className="bg-white rounded-2xl p-5 shadow">
                  <h3 className="font-extrabold text-gray-700 text-base mb-3">{cls}</h3>
                  <div className="flex gap-4 mb-3">
                    <div className="text-center">
                      <p className="text-2xl font-extrabold text-purple-600">{classStudents.length}</p>
                      <p className="text-xs text-gray-400 font-bold">Students</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-extrabold text-yellow-500">
                        {classStudents.reduce((sum, s) => sum + s.points, 0)}
                      </p>
                      <p className="text-xs text-gray-400 font-bold">Points</p>
                    </div>
                    <div className="text-center">
                      <p className="text-2xl font-extrabold text-green-500">
                        {classStudents.reduce((sum, s) => sum + (s.attendance?.length || 0), 0)}
                      </p>
                      <p className="text-xs text-gray-400 font-bold">Attendances</p>
                    </div>
                  </div>
                  {classTop && (
                    <div className="bg-yellow-50 rounded-xl px-3 py-2 flex items-center gap-2">
                      <span>🥇</span>
                      <span className="font-bold text-gray-700 text-sm">{classTop.name}</span>
                      <span className="ml-auto text-yellow-600 font-extrabold text-sm">
                        {classTop.lifetimePoints} pts
                      </span>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}

        {/* Students table */}
        <div className="bg-white rounded-2xl p-5 shadow">
          <h2 className="font-extrabold text-gray-700 mb-4">
            {activeClass === "ALL" ? "🌍 All Students" : `${activeClass} Students`}
          </h2>
          {filtered.length === 0 ? (
            <p className="text-gray-400 text-center py-8 font-bold">No students found.</p>
          ) : (
            <div className="space-y-2">
              {[...filtered]
                .sort((a, b) => b.lifetimePoints - a.lifetimePoints)
                .map((student, index) => (
                  <div key={student.id} className="flex items-center gap-4 bg-gray-50 rounded-xl px-4 py-3">
                    <span className="text-lg w-8 font-extrabold text-gray-400">
                      {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
                    </span>
                    <div className="bg-purple-100 rounded-full w-9 h-9 flex items-center justify-center font-extrabold text-purple-600 text-sm">
                      {student.name[0]}
                    </div>
                    <span className="flex-1 font-extrabold text-gray-700">{student.name}</span>
                    <span className="text-xs text-gray-400 font-bold">{student.className}</span>
                    <div className="text-right">
                      <p className="font-extrabold text-purple-600 text-sm">{student.points} pts</p>
                      <p className="font-bold text-yellow-500 text-xs">🏆 {student.lifetimePoints} lifetime</p>
                    </div>
                    <div className="text-right">
                      <p className="font-bold text-green-500 text-xs">
                        📅 {student.attendance?.length || 0} days
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>

      </div>
    </div>
  )
}