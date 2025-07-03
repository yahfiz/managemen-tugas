# 📋 Manajemen Tugas (Next.js + Prisma)

Aplikasi web untuk mengelola project dan tugas secara kolaboratif. Dibuat dengan **Next.js 15**, **Tailwind CSS**, **Prisma**, dan **NextAuth**.

## ✨ Fitur Utama

- Autentikasi (Login & Register) dengan NextAuth
- CRUD Project dan Task
- Undang Member ke Project via email
- Role: Owner & Member
- Kanban Board (drag & drop)
- Statistik tugas (Chart.js)
- Export data Project ke JSON
- UI modern dengan Tailwind, Shadcn UI, Framer Motion

---

## 🚀 Tech Stack

- **Frontend:** Next.js 15 App Router, Tailwind CSS, Shadcn UI, Framer Motion
- **Backend:** Prisma ORM, SQLite
- **Auth:** NextAuth.js (Email & Password)
- **Chart:** Chart.js via `react-chartjs-2`
- **Drag & Drop:** `@dnd-kit/core`

---

## 🔧 Instalasi Lokal

1. **Clone repo:**
   ```bash
   git clone https://github.com/username/manajemen-tugas.git
   cd manajemen-tugas

2. **Install dependencies:**
	npm install

3. **Copy file env**:
	cp .env.example .env

4. **Generate Prisma client & database:**
	npx prisma generate
	npx prisma migrate dev --name init

5. **Jalankan Server**
	npm run dev
