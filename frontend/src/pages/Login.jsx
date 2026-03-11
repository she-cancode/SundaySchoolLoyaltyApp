import { useState } from "react"
import { loginTeacher } from "../api"

export default function Login({ onLogin }) {
  const [username, setUsername] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError]       = useState("")
  const [loading, setLoading]   = useState(false)

  async function handleLogin() {
    if (!username || !password) return
    setLoading(true)
    const result = await loginTeacher(username, password)
    setLoading(false)
    if (result.error) {
      setError("Incorrect username or password. Try again!")
    } else {
      setError("")
      onLogin(result)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4"
      style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}>

      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl mb-4 shadow-lg"
            style={{ background: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)" }}>
            <span className="text-4xl">🌟</span>
          </div>
          <h1 className="text-4xl font-black text-white tracking-tight">Sunday School</h1>
          <p className="text-purple-200 mt-2 font-semibold">Rewards & Recognition</p>
        </div>

        <div className="bg-white rounded-3xl shadow-2xl p-8">
          <h2 className="text-xl font-black text-gray-800 mb-6">Welcome back! 👋</h2>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-bold text-gray-500 mb-1 uppercase tracking-wide">Username</label>
              <input
                type="text"
                value={username}
                onChange={e => setUsername(e.target.value)}
                placeholder="Enter your username"
                className="w-full border-2 border-gray-100 bg-gray-50 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-purple-400 focus:bg-white transition"
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-500 mb-1 uppercase tracking-wide">Password</label>
              <input
                type="password"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleLogin()}
                placeholder="Enter your password"
                className="w-full border-2 border-gray-100 bg-gray-50 rounded-2xl px-4 py-3 text-sm font-semibold focus:outline-none focus:border-purple-400 focus:bg-white transition"
              />
            </div>

            {error && (
              <div className="bg-red-50 border-2 border-red-100 rounded-2xl px-4 py-3">
                <p className="text-red-500 text-sm font-bold text-center">{error}</p>
              </div>
            )}

            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full text-white font-black py-3 rounded-2xl transition text-base shadow-lg disabled:opacity-50"
              style={{ background: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)" }}
            >
              {loading ? "Logging in..." : "Login →"}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}