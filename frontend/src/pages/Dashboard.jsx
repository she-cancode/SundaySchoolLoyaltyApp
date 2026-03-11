import { useState, useEffect } from "react"
import ChangePassword from "./ChangePassword"
import { getStudents, addStudent, awardPoints, redeemReward, deleteStudent } from "../api"
import {
  exportAttendanceRegister,
  exportStudentReport,
  exportLeaderboard,
  exportClassReport
} from "../utils/exportPDF"

const POINT_CATEGORIES = [
  { label: "Attendance",       emoji: "📅", points: 10 },
  { label: "Bible Verse",      emoji: "📖", points: 20 },
  { label: "Good Behavior",    emoji: "😇", points: 15 },
  { label: "Homework",         emoji: "📝", points: 15 },
  { label: "Invited a Friend", emoji: "🤝", points: 25 },
]

const REWARDS = [
  { name: "Sweets",       emoji: "🍬", cost: 30  },
  { name: "Sticker Pack", emoji: "🎨", cost: 50  },
  { name: "Small Toy",    emoji: "🧸", cost: 100 },
  { name: "Big Gift 🏆",  emoji: "🎁", cost: 400 },
]

function today() {
  return new Date().toLocaleDateString("en-ZA", {
    weekday: "long", year: "numeric", month: "long", day: "numeric"
  })
}

export default function Dashboard({ teacher, onLogout }) {
  const [students,        setStudents]        = useState([])
  const [activeTab,       setActiveTab]       = useState("dashboard")
  const [newStudentName,  setNewStudentName]  = useState("")
  const [selectedStudent, setSelectedStudent] = useState(null)
  const [notification,    setNotification]    = useState("")
  const [loading,         setLoading]         = useState(false)

  useEffect(() => { loadStudents() }, [])

  async function loadStudents() {
    const data = await getStudents(teacher.className)
    setStudents(data)
  }

  function showNotification(msg) {
    setNotification(msg)
    setTimeout(() => setNotification(""), 3000)
  }

  async function handleAddStudent() {
    if (!newStudentName.trim()) return
    setLoading(true)
    const student = await addStudent(newStudentName.trim(), teacher.className)
    setStudents(prev => [...prev, student])
    setNewStudentName("")
    setLoading(false)
    showNotification(`✅ ${student.name} added successfully!`)
  }

  async function handleAwardPoints(student, category) {
    const date = today()
    const isAttendance = category.label === "Attendance"
    if (isAttendance && student.attendance?.includes(date)) {
      showNotification(`⚠️ ${student.name} is already marked present today!`)
      return
    }
    try {
      const updated = await awardPoints(student.id, category, date)
      setStudents(prev => prev.map(s => s.id === updated.id ? updated : s))
      if (selectedStudent?.id === updated.id) setSelectedStudent(updated)
      showNotification(`🎉 +${category.points} pts awarded to ${student.name}!`)
    } catch {
      showNotification(`❌ Something went wrong.`)
    }
  }

  async function handleRedeemReward(student, reward) {
    if (reward.name === "Big Gift 🏆") {
      showNotification(`🏆 Big Gift is awarded at end of term to the top student!`)
      return
    }
    if (student.points < reward.cost) {
      showNotification(`❌ ${student.name} doesn't have enough points!`)
      return
    }
    const updated = await redeemReward(student.id, reward, today())
    setStudents(prev => prev.map(s => s.id === updated.id ? updated : s))
    if (selectedStudent?.id === updated.id) setSelectedStudent(updated)
    showNotification(`🎁 ${student.name} redeemed ${reward.name}!`)
  }

  async function handleDeleteStudent(student) {
  if (!window.confirm(`Remove ${student.name} from ${teacher.className}?`)) return
  await deleteStudent(student.id)
  setStudents(prev => prev.filter(s => s.id !== student.id))
  showNotification(`🗑️ ${student.name} removed.`)
  }

  const topStudents = [...students].sort((a, b) => b.points - a.points).slice(0, 3)

  const CLASS_COLORS = {
  "Bumblebees 🐝":      { from: "#f7971e", to: "#ffd200" },
  "Little Lambs 🐑":    { from: "#a8edea", to: "#fed6e3" },
  "Mountain Movers ⛰️": { from: "#4facfe", to: "#00f2fe" },
  "Lions of Judah 🦁":  { from: "#f093fb", to: "#f5576c" },
}
const classColor = CLASS_COLORS[teacher.className] || { from: "#667eea", to: "#764ba2" }

  return (
    <div className="min-h-screen bg-gradient-to-br from-yellow-50 via-pink-50 to-purple-50">

      {notification && (
        <div className="fixed top-4 right-4 bg-white border-2 border-purple-300 text-purple-700 font-bold px-6 py-3 rounded-2xl shadow-xl z-50 text-sm">
          {notification}
        </div>
      )}

      <div className="bg-white shadow-sm border-b-2 border-purple-100 px-6 py-4 flex justify-between items-center">
        <div className="flex items-center gap-3">
          <span className="text-3xl">🌟</span>
          <div>
            <h1 className="text-xl font-extrabold text-purple-700">Sunday School Rewards</h1>
            <p className="text-xs text-gray-400">{teacher.name} · {teacher.className}</p>
          </div>
        </div>
        <button
          onClick={onLogout}
          className="bg-red-100 text-red-500 font-bold px-4 py-2 rounded-xl text-sm hover:bg-red-200 transition"
        >
          Logout
        </button>
      </div>

      <div className="flex gap-2 px-6 pt-4">
        {[
          { id: "dashboard", label: "🏠 Dashboard" },
          { id: "students",  label: "👦 Students"  },
          { id: "award",     label: "⭐ Award"      },
          { id: "rewards",   label: "🎁 Rewards"    },
          { id: "leaders",   label: "🏆 Leaders"    },
          { id: "settings", label: "⚙️ Settings" },
        ].map(tab => (
          <button
            key={tab.id}
            onClick={() => { setActiveTab(tab.id); setSelectedStudent(null) }}
            className={`px-4 py-2 rounded-xl font-bold text-sm transition ${
              activeTab === tab.id
                ? "bg-purple-600 text-white shadow"
                : "bg-white text-gray-500 hover:bg-purple-50"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="p-6">

        {activeTab === "dashboard" && (
          <div className="space-y-6">
            <div className="grid grid-cols-3 gap-4">
              <div className="bg-white rounded-2xl p-5 shadow text-center">
                <p className="text-4xl font-extrabold text-purple-600">{students.length}</p>
                <p className="text-gray-400 text-sm font-bold mt-1">Total Students</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow text-center">
                <p className="text-4xl font-extrabold text-yellow-500">
                  {students.reduce((sum, s) => sum + s.points, 0)}
                </p>
                <p className="text-gray-400 text-sm font-bold mt-1">Points Awarded</p>
              </div>
              <div className="bg-white rounded-2xl p-5 shadow text-center">
                <p className="text-4xl font-extrabold text-pink-500">
                  {topStudents[0]?.name?.split(" ")[0] || "—"}
                </p>
                <p className="text-gray-400 text-sm font-bold mt-1">Top Student</p>
              </div>
            </div>

            {topStudents.length > 0 && (
              <div className="bg-white rounded-2xl p-5 shadow">
                <h2 className="font-extrabold text-gray-700 mb-4">🏆 Top Students</h2>
                <div className="space-y-3">
                  {topStudents.map((s, i) => (
                    <div key={s.id} className="flex items-center gap-3">
                      <span className="text-2xl">{["🥇","🥈","🥉"][i]}</span>
                      <span className="font-bold text-gray-700 flex-1">{s.name}</span>
                      <span className="bg-purple-100 text-purple-700 font-extrabold px-3 py-1 rounded-full text-sm">
                        {s.points} pts
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {students.length === 0 && (
              <div className="bg-white rounded-2xl p-10 shadow text-center">
                <p className="text-5xl mb-3">👦</p>
                <p className="text-gray-400 font-bold">No students yet — add some in the Students tab!</p>
              </div>
            )}
          </div>
        )}

        {activeTab === "students" && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-5 shadow flex gap-3">
              <input
                type="text"
                value={newStudentName}
                onChange={e => setNewStudentName(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAddStudent()}
                placeholder="Enter student name..."
                className="flex-1 border-2 border-purple-200 rounded-xl px-4 py-2 text-sm focus:outline-none focus:border-purple-500"
              />
              <button
                onClick={handleAddStudent}
                disabled={loading}
                className="bg-purple-600 text-white font-bold px-5 py-2 rounded-xl hover:bg-purple-700 transition text-sm disabled:opacity-50"
              >
                + Add Student
              </button>
            </div>

            {students.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 shadow text-center">
                <p className="text-gray-400 font-bold">No students yet. Add your first one above!</p>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4">
                {students.map(student => (
          <div
    key={student.id}
    className="bg-white rounded-2xl p-5 shadow hover:border-2 hover:border-purple-300 transition"
  >
    <div className="flex items-center gap-3">
      <div
        onClick={() => { setSelectedStudent(student); setActiveTab("profile") }}
        className="bg-purple-100 rounded-full w-12 h-12 flex items-center justify-center text-xl font-extrabold text-purple-600 cursor-pointer"
      >
        {student.name[0]}
          </div>
            <div
              onClick={() => { setSelectedStudent(student); setActiveTab("profile") }}
              className="flex-1 cursor-pointer"
            >
              <p className="font-extrabold text-gray-700">{student.name}</p>
              <p className="text-sm text-purple-500 font-bold">{student.points} pts</p>
            </div>
        <button
        onClick={() => handleDeleteStudent(student)}
        className="text-red-400 hover:text-red-600 font-bold text-xs bg-red-50 hover:bg-red-100 px-3 py-1 rounded-xl transition"
        >
          🗑️ Remove
        </button>
        </div>
              </div>
              ))}
              </div>
            )}
          </div>
        )}

        {activeTab === "profile" && selectedStudent && (
          <div className="space-y-4">
            <div className="bg-white rounded-2xl p-6 shadow">
              <div className="flex items-center gap-4 mb-6">
                <div className="bg-purple-100 rounded-full w-16 h-16 flex items-center justify-center text-3xl font-extrabold text-purple-600">
                  {selectedStudent.name[0]}
                </div>
                <div>
                  <h2 className="text-2xl font-extrabold text-gray-700">{selectedStudent.name}</h2>
                  <div className="flex gap-3 mt-1">
                    <span className="bg-purple-100 text-purple-700 font-bold px-3 py-1 rounded-full text-sm">
                      {selectedStudent.points} pts available
                    </span>
                    <span className="bg-yellow-100 text-yellow-700 font-bold px-3 py-1 rounded-full text-sm">
                      🏆 {selectedStudent.lifetimePoints} lifetime pts
                    </span>
                  </div>
                </div>
                    </div>
                      <div className="flex items-center justify-between mb-3">
                          <h3 className="font-black text-gray-600 text-sm uppercase tracking-wide">
                            📅 Attendance ({selectedStudent.attendance?.length || 0} days)
                          </h3>
                      <div className="flex gap-2">
                    <button
                      onClick={() => exportAttendanceRegister(selectedStudent, teacher.className)}
                        className="text-xs font-bold px-3 py-1 rounded-xl bg-blue-50 text-blue-600 hover:bg-blue-100 transition"
                      >
      📥 Attendance PDF
    </button>
    <button
      onClick={() => exportStudentReport(selectedStudent, teacher.className)}
      className="text-xs font-bold px-3 py-1 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 transition"
    >
      📥 Full Report
    </button>
                </div>
            </div>
              <div className="mb-6">
                <h3 className="font-extrabold text-gray-600 mb-3">
                  📅 Attendance Register ({selectedStudent.attendance?.length || 0} days)
                </h3>
                {!selectedStudent.attendance?.length ? (
                  <p className="text-gray-400 text-sm bg-gray-50 rounded-xl p-4 text-center">
                    No attendance recorded yet.
                  </p>
                ) : (
                  <div className="space-y-2 max-h-40 overflow-y-auto">
                    {[...selectedStudent.attendance].reverse().map((date, i) => (
                      <div key={i} className="flex items-center gap-3 bg-green-50 border border-green-100 rounded-xl px-4 py-2">
                        <span>✅</span>
                        <span className="text-sm font-bold text-green-700">{date}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>

              <h3 className="font-extrabold text-gray-600 mb-3">Transaction History</h3>
              {!selectedStudent.transactions?.length ? (
                <p className="text-gray-400 text-sm">No transactions yet.</p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {[...selectedStudent.transactions].reverse().map(t => (
                    <div key={t.id} className="flex items-center gap-3 bg-gray-50 rounded-xl px-4 py-2">
                      <span>{t.emoji}</span>
                      <span className="flex-1 text-sm font-bold text-gray-600">{t.description}</span>
                      <span className="text-xs text-gray-400">{t.date}</span>
                      <span className={`font-extrabold text-sm ${t.type === "EARNED" ? "text-green-500" : "text-red-400"}`}>
                        {t.type === "EARNED" ? "+" : "-"}{t.points} pts
                      </span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {activeTab === "award" && (
          <div className="space-y-4">
            {students.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 shadow text-center">
                <p className="text-gray-400 font-bold">Add students first before awarding points!</p>
              </div>
            ) : (
              students.map(student => (
                <div key={student.id} className="bg-white rounded-2xl p-5 shadow">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="bg-purple-100 rounded-full w-10 h-10 flex items-center justify-center font-extrabold text-purple-600">
                      {student.name[0]}
                    </div>
                    <span className="font-extrabold text-gray-700">{student.name}</span>
                    <span className="ml-auto bg-purple-100 text-purple-700 font-extrabold px-3 py-1 rounded-full text-sm">
                      {student.points} pts
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {POINT_CATEGORIES.map(cat => (
                      <button
                        key={cat.label}
                        onClick={() => handleAwardPoints(student, cat)}
                        className="bg-yellow-50 hover:bg-yellow-100 border-2 border-yellow-200 text-yellow-700 font-bold px-3 py-2 rounded-xl text-xs transition"
                      >
                        {cat.emoji} {cat.label} +{cat.points}
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {activeTab === "rewards" && (
          <div className="space-y-4">
            <div className="grid grid-cols-4 gap-4 mb-6">
              {REWARDS.map(reward => (
                <div key={reward.name} className="bg-white rounded-2xl p-4 shadow text-center">
                  <p className="text-4xl mb-2">{reward.emoji}</p>
                  <p className="font-extrabold text-gray-700 text-sm">{reward.name}</p>
                  <p className="text-purple-500 font-bold text-xs mt-1">{reward.cost} pts</p>
                </div>
              ))}
            </div>

            {students.length === 0 ? (
              <div className="bg-white rounded-2xl p-10 shadow text-center">
                <p className="text-gray-400 font-bold">Add students first!</p>
              </div>
            ) : (
              students.map(student => (
                <div key={student.id} className="bg-white rounded-2xl p-5 shadow">
                  <div className="flex items-center gap-3 mb-3">
                    <div className="bg-purple-100 rounded-full w-10 h-10 flex items-center justify-center font-extrabold text-purple-600">
                      {student.name[0]}
                    </div>
                    <span className="font-extrabold text-gray-700">{student.name}</span>
                    <span className="ml-auto bg-purple-100 text-purple-700 font-extrabold px-3 py-1 rounded-full text-sm">
                      {student.points} pts
                    </span>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {REWARDS.map(reward => (
                      <button
                        key={reward.name}
                        onClick={() => handleRedeemReward(student, reward)}
                        disabled={student.points < reward.cost && reward.name !== "Big Gift 🏆"}
                        className={`font-bold px-3 py-2 rounded-xl text-xs transition border-2 ${
                          student.points >= reward.cost || reward.name === "Big Gift 🏆"
                            ? "bg-pink-50 border-pink-200 text-pink-600 hover:bg-pink-100"
                            : "bg-gray-50 border-gray-200 text-gray-300 cursor-not-allowed"
                        }`}
                      >
                        {reward.emoji} {reward.name} · {reward.cost} pts
                      </button>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}
      {activeTab === "leaders" && (
            <div className="bg-white rounded-3xl p-6 shadow-sm">
            <div className="flex items-center justify-between mb-1">
            <h2 className="font-black text-gray-700 text-base">🏆 {teacher.className} Leaderboard</h2>
          <div className="flex gap-2">
            <button
            onClick={() => exportLeaderboard(students, teacher.className)}
            className="text-xs font-bold px-3 py-1 rounded-xl bg-yellow-50 text-yellow-600 hover:bg-yellow-100 transition"
              >
              📥 Leaderboard PDF
            </button>
            <button
            onClick={() => exportClassReport(students, teacher.className)}
            className="text-xs font-bold px-3 py-1 rounded-xl bg-purple-50 text-purple-600 hover:bg-purple-100 transition"
            >
              📥 Class Report
            </button>
          </div>
        </div>
        <p className="text-xs text-gray-400 font-semibold mb-4">Lifetime points decide the Big Gift winner</p>
    {students.length === 0 ? (
      <p className="text-gray-400 font-bold text-center py-8">No students yet!</p>
    ) : (
      <div className="space-y-3">
        {[...students]
          .sort((a, b) => b.lifetimePoints - a.lifetimePoints)
          .map((student, index) => (
            <div key={student.id} className="flex items-center gap-4 bg-gray-50 rounded-2xl px-4 py-3">
              <span className="text-2xl w-8">
                {index === 0 ? "🥇" : index === 1 ? "🥈" : index === 2 ? "🥉" : `#${index + 1}`}
              </span>
              <div className="w-10 h-10 rounded-xl flex items-center justify-center font-black text-white text-sm"
                style={{ background: `linear-gradient(135deg, ${classColor.from}, ${classColor.to})` }}>
                {student.name[0]}
              </div>
              <span className="flex-1 font-black text-gray-700">{student.name}</span>
              <div className="text-right">
                <p className="font-black text-purple-600 text-sm">{student.points} pts</p>
                <p className="font-bold text-yellow-500 text-xs">🏆 {student.lifetimePoints} lifetime</p>
              </div>
            </div>
          ))}
      </div>
    )}
  </div>
)}
        {activeTab === "settings" && (
          <div className="max-w-md">
          <div className="bg-white rounded-2xl p-6 shadow space-y-4">
            <h2 className="font-extrabold text-gray-700 text-lg">⚙️ Change Password</h2>
            <p className="text-sm text-gray-400">Update your login password below.</p>
            <ChangePassword teacher={teacher} showNotification={showNotification} />
          </div>
          </div>
        )}
      </div>
    </div>
  )
}
