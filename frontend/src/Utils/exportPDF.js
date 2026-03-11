import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"

function header(doc, title, subtitle) {
  doc.setFillColor(102, 126, 234)
  doc.rect(0, 0, 210, 28, "F")
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(16)
  doc.setFont("helvetica", "bold")
  doc.text(title, 14, 12)
  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(subtitle, 14, 20)
  doc.setTextColor(0, 0, 0)
}

function footer(doc) {
  const date = new Date().toLocaleDateString("en-ZA", {
    year: "numeric", month: "long", day: "numeric"
  })
  doc.setFontSize(8)
  doc.setTextColor(150, 150, 150)
  doc.text(`Generated on ${date} · Sunday School Rewards App`, 14, 290)
}

export function exportAttendanceRegister(student, className) {
  const doc = new jsPDF()

  header(doc, `${student.name} — Attendance Register`, className)

  doc.setFontSize(12)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(0, 0, 0)
  doc.text("Attendance Summary", 14, 40)

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(`Total days present: ${student.attendance?.length || 0}`, 14, 48)

  if (student.attendance?.length) {
    autoTable(doc, {
      startY: 55,
      head: [["#", "Date Present"]],
      body: [...student.attendance]
        .reverse()
        .map((date, i) => [i + 1, date]),
      headStyles:  { fillColor: [102, 126, 234], fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 245, 255] },
      styles: { fontSize: 10 },
    })
  } else {
    doc.text("No attendance recorded yet.", 14, 60)
  }

  footer(doc)
  doc.save(`${student.name}_Attendance.pdf`)
}

export function exportStudentReport(student, className) {
  const doc = new jsPDF()

  header(doc, `${student.name} — Full Report`, className)

  doc.setFontSize(11)
  doc.setFont("helvetica", "bold")
  doc.setTextColor(0, 0, 0)
  doc.text("Points Summary", 14, 40)

  doc.setFont("helvetica", "normal")
  doc.setFontSize(10)
  doc.text(`Available Points:  ${student.points}`, 14, 48)
  doc.text(`Lifetime Points:   ${student.lifetimePoints}`, 14, 54)
  doc.text(`Days Attended:     ${student.attendance?.length || 0}`, 14, 60)

  if (student.transactions?.length) {
    doc.setFont("helvetica", "bold")
    doc.setFontSize(11)
    doc.text("Transaction History", 14, 74)

    autoTable(doc, {
      startY: 80,
      head: [["Date", "Description", "Type", "Points"]],
      body: [...student.transactions]
        .reverse()
        .map(t => [
          t.date,
          t.description,
          t.type,
          t.type === "EARNED" ? `+${t.points}` : `-${t.points}`,
        ]),
      headStyles: { fillColor: [102, 126, 234], fontStyle: "bold" },
      alternateRowStyles: { fillColor: [245, 245, 255] },
      styles: { fontSize: 9 },
      columnStyles: {
        3: {
          fontStyle: "bold",
          textColor: (cell) =>
            cell.raw?.startsWith("+") ? [34, 197, 94] : [239, 68, 68],
        },
      },
    })
  }

  footer(doc)
  doc.save(`${student.name}_Report.pdf`)
}

export function exportLeaderboard(students, className) {
  const doc = new jsPDF()

  header(doc, `${className} — Leaderboard`, "End of Term Rankings")

  autoTable(doc, {
    startY: 35,
    head: [["Rank", "Student", "Available Pts", "Lifetime Pts", "Days Present"]],
    body: [...students]
      .sort((a, b) => b.lifetimePoints - a.lifetimePoints)
      .map((s, i) => [
        i === 0 ? "🥇 1st" : i === 1 ? "🥈 2nd" : i === 2 ? "🥉 3rd" : `#${i + 1}`,
        s.name,
        s.points,
        s.lifetimePoints,
        s.attendance?.length || 0,
      ]),
    headStyles:  { fillColor: [102, 126, 234], fontStyle: "bold" },
    alternateRowStyles: { fillColor: [245, 245, 255] },
    styles: { fontSize: 10 },
  })

  footer(doc)
  doc.save(`${className}_Leaderboard.pdf`)
}

export function exportClassReport(students, className) {
  const doc = new jsPDF()

  header(doc, `${className} — Full Class Report`, `${students.length} students`)

  doc.setFontSize(10)
  doc.setFont("helvetica", "normal")
  doc.text(`Total Points Awarded: ${students.reduce((s, x) => s + x.points, 0)}`, 14, 36)
  doc.text(`Total Attendances:    ${students.reduce((s, x) => s + (x.attendance?.length || 0), 0)}`, 14, 42)

  autoTable(doc, {
    startY: 50,
    head: [["Student", "Available Pts", "Lifetime Pts", "Days Present", "Transactions"]],
    body: [...students]
      .sort((a, b) => b.lifetimePoints - a.lifetimePoints)
      .map(s => [
        s.name,
        s.points,
        s.lifetimePoints,
        s.attendance?.length || 0,
        s.transactions?.length || 0,
      ]),
    headStyles:  { fillColor: [102, 126, 234], fontStyle: "bold" },
    alternateRowStyles: { fillColor: [245, 245, 255] },
    styles: { fontSize: 10 },
  })

  footer(doc)
  doc.save(`${className}_ClassReport.pdf`)
}