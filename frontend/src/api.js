const BASE = "http://localhost:8080/api"

export async function loginTeacher(username, password) {
  const res = await fetch(`${BASE}/teachers/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, password }),
  })
  return res.json()
}

export async function getStudents(className) {
  const res = await fetch(`${BASE}/students/class/${encodeURIComponent(className)}`)
  return res.json()
}

export async function addStudent(name, className) {
  const res = await fetch(`${BASE}/students`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ name, className, points: 0, lifetimePoints: 0 }),
  })
  return res.json()
}

export async function awardPoints(studentId, category, date) {
  const res = await fetch(`${BASE}/students/${studentId}/award`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      points:      category.points,
      description: category.label,
      emoji:       category.emoji,
      date,
    }),
  })
  return res.json()
}

export async function redeemReward(studentId, reward, date) {
  const res = await fetch(`${BASE}/students/${studentId}/redeem`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      cost:  reward.cost,
      name:  reward.name,
      emoji: reward.emoji,
      date,
    }),
  })
  return res.json()
}

export async function changePassword(teacherId, password) {
  const res = await fetch(`${BASE}/teachers/${teacherId}/password`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ password }),
  })
  return res.json()
}

export async function deleteStudent(studentId) {
  await fetch(`${BASE}/students/${studentId}`, { method: "DELETE" })
}

export async function getAllStudents() {
  const res = await fetch(`${BASE}/teachers/all-students`)
  return res.json()
}