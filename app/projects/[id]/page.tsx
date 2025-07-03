// app/projects/[id]/page.tsx
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import TaskForm from "@/components/task-form";
import KanbanBoard from "@/components/kanban-board";
import TaskStats from "@/components/TaskStats";
import { Task, ProjectMember } from "@/types"; // <-- Import Task dan ProjectMember dari file tipe bersama

export const dynamic = "force-dynamic";

export default async function ProjectDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });
  if (!user) {
    notFound();
  }

  const project = await prisma.project.findFirst({
    where: {
      id,
      OR: [
        { ownerId: user.id },
        { members: { some: { userId: user.id } } },
      ],
    },
    include: {
      tasks: true, // Prisma akan mengembalikan Task[] sesuai schema Anda
      members: { include: { user: true } },
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Header dengan judul */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-100">Detail Project</h1>
            <Link
              href="/dashboard"
              className="text-sm text-blue-400 hover:underline inline-block mt-2"
            >
              ← Kembali ke Dashboard
            </Link>
          </div>
        </div>

        {/* Informasi Project - di dalam card yang rapi */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl mb-8 border border-gray-700">
          <p className="text-xl font-semibold mb-2 text-blue-300">📌 {project.name}</p>
          <p className="text-gray-400 text-sm mb-4">
            Dibuat: {new Date(project.createdAt).toLocaleDateString()}
          </p>
          <Link
            href={`/projects/${project.id}/settings`}
            className="text-sm text-blue-400 hover:underline hover:text-blue-300 transition-colors duration-200"
          >
            ⚙️ Pengaturan Project
          </Link>
        </div>

        {/* Bagian Tambah Task - di dalam card */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl mb-8 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-200">Tambah Task Baru</h2>
          <TaskForm projectId={project.id} />
        </div>

        {/* Bagian Kanban Board - di dalam card */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl mb-8 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-200">📋 Kanban Board</h2>
          {/* Casting project.tasks ke Task[] (dari types/index.ts) */}
          <KanbanBoard tasks={project.tasks as Task[]} projectId={project.id} />
        </div>

        {/* Bagian Task Stats - di dalam card */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl mb-8 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-200">📊 Statistik Task</h2>
          {/* Casting project.tasks ke Task[] (dari types/index.ts) */}
          <TaskStats tasks={project.tasks as Task[]} />
        </div>

        {/* Bagian Anggota Project - di dalam card */}
        <div className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-200">👥 Anggota Project</h2>
          <ul className="space-y-2">
            <li className="text-base text-gray-300">👑 {user.email} (Owner)</li>
            {/* Casting project.members ke ProjectMember[] (dari types/index.ts) */}
            {(project.members as ProjectMember[]).map((member) => (
              <li key={member.id} className="text-base text-gray-300">
                👤 {member.user.email}
              </li>
            ))}
          </ul>
        </div>
      </div>
    </main>
  );
}