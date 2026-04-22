# 🎓 Quix (A Learning Management System)

A full-stack **Learning Management System** built with **React.js, Node.js, Express.js, MySQL, and Sequelize**.  
This platform supports **Admin, Instructor, and Student** roles with a dynamic permission system, course management, quizzes, enrollments, certificates and progress tracking.

---

# 🚀 Live Features

## 🔐 Authentication & Access Control

- User Registration (Student / Instructor)
- Login with JWT Authentication
- Protected Routes (Frontend + Backend)
- Pending Approval System
- Admin Approval / Rejection with Remarks
- Suspended / Active User Control
- Permanent Super Admin Account

---

## 👑 Admin Panel

### Dashboard

- Total Users
- Total Courses
- Total Enrollments
- Pending Registration Count

### User Management

- Search Users
- Filter by Role / Status
- Approve / Reject Users
- Suspend / Reactivate Users
- Edit User Details
- Assign Roles

### Course Oversight

- View All Courses
- Approve / Reject Instructor Courses
- Unpublish Courses
- Delete Courses

---

## 👨‍🏫 Instructor Panel

### Dashboard

- Total Courses
- Total Students
- Average Quiz Scores

### Course Management

- Create Course
- Edit Course
- Delete Course
- Submit for Review
- Pricing (Free / Paid)

### Lesson Management

- Add Multiple Lessons
- Lesson Ordering
- Free Preview Support
- Video URL Support
- Resource Attachments

### Quiz Management

- One Quiz per Course
- MCQ Questions
- Add / Edit / Delete Questions
- View Student Attempts

---

## 🎓 Student Panel

### Dashboard

- Enrolled Courses
- Progress Tracking
- Resume Learning

### Browse Course

- Browse Published Courses
- Search Courses
- Filter by Category / Difficulty

### Enrollment & Learning

- Instant Enrollment (Free Courses)
- Track Lesson Completion
- Progress Bar

### Quiz Attempts

- Countdown Timer
- Auto Submit
- Score + Pass/Fail Result
- Attempt History

### Certificates

- Auto Generated After Passing Quiz
- Download as PDF
- Printable Certificate

---

# 🛠 Tech Stack

## Frontend

- React.js
- React Router DOM
- Axios
- CSS
- Lucide React Icons

## Backend

- Node.js
- Express.js
- Sequelize ORM
- MySQL
- JWT Authentication
- bcryptjs

---

# 📁 Project Structure

```bash
Quix/
│── quix_frontend/
│   ├── src/
│   ├── public/
│
│── quix_backend/
│   ├── controllers/
│   ├── db/
│   ├── models/
│   ├── routes/
│   ├── middleware/
│   ├── scripts/
│
│── README.md

```

## ER Diagram

https://drive.google.com/file/d/1vsHAYakrSNM_TKSw7O4VL7eRG5UfKlHY/view?usp=sharing

# Setup Instructions

## 1. Clone Repository

```bash
git clone https://github.com/sanik4144/quix.git
cd quix

cd quix_backend
npm install
```

```.env
PORT=3000

SQL_DATABASE=quix
SQL_USERNAME=anik
SQL_PASSWORD=4922
SQL_HOST=localhost
SQL_DIALECT=mysql
JWT_SECRET=quix_secret_key_123
```

```bash
npm run dev
```

```bash
cd frontend
npm install
```

```.env
VITE_API_URL=http://localhost:3000/api
```

```bash
npm run dev
```