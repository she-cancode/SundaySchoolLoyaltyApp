import { useState } from "react"
import { changePassword } from "../api"

export default function ChangePassword({ teacher, showNotification }) {
  const [current,  setCurrent]  = useState("")
  const [newPass,  setNewPass]  = useState("")
  const [confirm,  setConfirm]  = useState("")
  const [loading,  setLoading]  = useState(false)

  async function handleChange() {
    if (!current || !newPass || !confirm) {
      showNotification("⚠️ Please fill in all fields.")
      return
    }
    if (newPass !== confirm) {
      showNotification("❌ New passwords don't match!")
      return
    }
    if (newPass.length < 6) {
      showNotification("❌ Password must be at least 6 characters.")
      return
    }
    if (current !== teacher.password) {
      showNotification("❌ Current password is incorrect.")
      return
    }
    setLoading(true)
    await changePassword(teacher.id, newPass)
    setLoading(false)
    teacher.password = newPass
    setCurrent("")
    setNewPass("")
    setConfirm("")
    showNotification("✅ Password changed successfully!")
  }

  return (
    <div className="space-y-4">
      <div>
        <label className="block text-sm font-bold text-gray-600 mb-1">Current Password</label>
        <input
          type="password"
          value={current}
          onChange={e => setCurrent(e.target.value)}
          placeholder="Enter current password"
          className="w-full border-2 border-purple-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition"
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-600 mb-1">New Password</label>
        <input
          type="password"
          value={newPass}
          onChange={e => setNewPass(e.target.value)}
          placeholder="Enter new password"
          className="w-full border-2 border-purple-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition"
        />
      </div>
      <div>
        <label className="block text-sm font-bold text-gray-600 mb-1">Confirm New Password</label>
        <input
          type="password"
          value={confirm}
          onChange={e => setConfirm(e.target.value)}
          onKeyDown={e => e.key === "Enter" && handleChange()}
          placeholder="Repeat new password"
          className="w-full border-2 border-purple-200 rounded-xl px-4 py-3 text-sm focus:outline-none focus:border-purple-500 transition"
        />
      </div>
      <button
        onClick={handleChange}
        disabled={loading}
        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-extrabold py-3 rounded-xl transition text-sm disabled:opacity-50"
      >
        {loading ? "Saving..." : "Change Password 🔑"}
      </button>
    </div>
  )
}