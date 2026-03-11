
# 🌟 Sunday School Rewards App

### A full-stack web application to reward, recognise, and motivate Sunday school students

![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Spring Boot](https://img.shields.io/badge/Spring_Boot-3.5-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)
![PostgreSQL](https://img.shields.io/badge/PostgreSQL-336791?style=for-the-badge&logo=postgresql&logoColor=white)
![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-38BDF8?style=for-the-badge&logo=tailwindcss&logoColor=white)
![Java](https://img.shields.io/badge/Java_17-ED8B00?style=for-the-badge&logo=openjdk&logoColor=white)

**Built by Terinique · Vibe Coding Hackathon · 2026**

---


## 📖 About

The Sunday School Rewards App is a full-stack web application that digitises and gamifies a student rewards programme for a Sunday school with four classes. Teachers log in, award points to students for positive behaviour, manage a rewards store, and print reports — all from any device.

> Built from scratch covering the full software development lifecycle: requirements gathering, system design, frontend development, backend API development, database design, security, and deployment.

---

## ✨ Features

| Feature | Description |
|---|---|
| 🔐 **Secure Login** | BCrypt-hashed passwords, role-based access (Teacher / Admin) |
| 🏠 **Class Dashboard** | Live stats — total students, points awarded, top student |
| 👦 **Student Management** | Add and remove students per class |
| ⭐ **Award Points** | 5 categories: Attendance, Bible Verse, Good Behavior, Homework, Invited a Friend |
| 📅 **Attendance Register** | Date-stamped attendance with duplicate prevention |
| 🏆 **Lifetime Points** | Separate tracker for Big Gift competition — never deducted |
| 🎁 **Rewards Store** | Sweets, Sticker Pack, Small Toy, Big Gift (end of term) |
| 📊 **Leaderboard** | Class ranking by lifetime points |
| 👑 **Admin View** | Cross-class overview of all 4 classes simultaneously |
| 🎉 **Celebrations** | Animated celebration on every point award |
| 📥 **PDF Export** | Attendance registers, student reports, leaderboard, class report |
| 🎨 **Class Themes** | Each class has its own unique colour gradient |

---

## 🏫 Classes

| Class | Teacher | Theme |
|---|---|---|
| 🐝 Bumblebees | Teacher Terinique | Gold / Yellow |
| 🐑 Little Lambs | Teacher Jame | Teal / Pink |
| ⛰️ Mountain Movers | Teacher Mimi | Blue / Cyan |
| 🦁 Lions of Judah | Teacher Althea | Pink / Red |
| 👑 Admin | Admin | Purple / Indigo |

---

## 🛠️ Tech Stack

```
Frontend          Backend             Database         Security
─────────         ───────             ────────         ────────
React 18          Java 17             PostgreSQL        BCrypt
Vite              Spring Boot 3.5     Hibernate ORM     Spring Security
Tailwind CSS      Maven               JPA               CORS Config
jsPDF             REST API
Nunito Font
```

---

## 🗂️ Project Structure

```
SundaySchoolLoyaltyApp/
├── 📁 frontend/
│   ├── src/
│   │   ├── pages/
│   │   │   ├── Login.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── AdminDashboard.jsx
│   │   │   └── ChangePassword.jsx
│   │   ├── utils/
│   │   │   └── exportPDF.js
│   │   ├── api.js
│   │   └── App.jsx
│   └── package.json
│
└── 📁 backend/
    └── src/main/java/com/sundayschool/backend/
        ├── model/
        │   ├── Teacher.java
        │   ├── Student.java
        │   └── Transaction.java
        ├── controller/
        │   ├── TeacherController.java
        │   └── StudentController.java
        ├── repository/
        ├── config/
        │   └── SecurityConfig.java
        └── DataSeeder.java
```

---

## 🔌 API Endpoints

### Teachers
```
POST   /api/teachers/login              → Authenticate teacher
PUT    /api/teachers/{id}/password      → Change password
GET    /api/teachers/all-students       → Admin: all students across classes
```

### Students
```
GET    /api/students/class/{className}  → Get students in a class
POST   /api/students                    → Add a student
POST   /api/students/{id}/award         → Award points
POST   /api/students/{id}/redeem        → Redeem a reward
DELETE /api/students/{id}               → Remove a student
```

---

## 🚀 Running Locally

### Prerequisites
- Java 17+
- Maven
- Node.js 18+
- npm

### Backend
```bash
cd backend
mvn spring-boot:run
# Runs on http://localhost:8080
```

### Frontend
```bash
cd frontend
npm install
npm run dev
# Runs on http://localhost:5173
```

### Environment Variables (Backend)
```
DATABASE_URL=your_postgresql_connection_string
PORT=8080
```

### Environment Variables (Frontend)
```
VITE_API_URL=http://localhost:8080/api
```

---

## 🗄️ Data Model

```
Teacher                    Student                    Transaction
───────                    ───────                    ───────────
id (PK)                    id (PK)                    id (PK)
name                       name                       description
username                   className                  emoji
password (BCrypt)          points                     points
className                  lifetimePoints             type (EARNED/REDEEMED)
role (TEACHER/ADMIN)       attendance[]               date
                           transactions[]             student (FK)
```

---

## 🔐 Security

- All passwords stored as **BCrypt hashes** — never plain text
- Teachers can only access **their own class data**
- Admin account has exclusive access to the all-students endpoint
- CORS restricted to known frontend origin
- Role-based routing on both frontend and backend

---

## 📦 Deployment

| Layer | Platform |
|---|---|
| Frontend | Netlify |
| Backend | Railway |
| Database | Railway PostgreSQL |

---

## 🛣️ Roadmap

- [ ] 🌐 JWT token-based authentication
- [ ] 📱 Mobile app (React Native)
- [ ] 👨‍👩‍👧 Parent-facing read-only view
- [ ] 🏅 End-of-term automated Big Gift winner announcement
- [ ] 🌙 Dark mode
- [ ] 📧 Email notifications for teachers

---


Made with ❤️ by **Terinique** · Sunday School Rewards App v1.0
