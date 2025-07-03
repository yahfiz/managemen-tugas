import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";
import ProjectForm from "@/components/project-form";
import ProjectItem from "@/components/project-item";
import { redirect } from "next/navigation"; 
import LogoutButton from "@/components/logout-button"; 

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    // Menggunakan redirect dari next/navigation untuk server component
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: {
      projects: true, // sebagai pemilik
      members: {
        include: {
          project: true, // sebagai anggota
        },
      },
    },
  });

  if (!user) {
    return <p className="text-red-500">User tidak ditemukan.</p>;
  }

  // Gabungkan project sebagai pemilik dan sebagai anggota
  const ownedProjects = user.projects || [];
  const memberProjects = user.members.map((m: { project: any; }) => m.project) || [];

  // Filter project unik jika ada duplikasi (misal, jika user adalah owner dan member project yang sama)
  const allProjects = Array.from(new Map([...ownedProjects, ...memberProjects].map(item => [item['id'], item])).values());


  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold">📁 Daftar Project</h1>
            <p className="text-sm text-gray-400">Halo, {user.name || "Pengguna"} 👋</p>
          </div>
          {/* Tombol Logout ditempatkan di sini */}
          <LogoutButton />
        </div>

        <div className="mb-6">
          <ProjectForm />
        </div>

        {allProjects.length === 0 ? (
          <p className="text-gray-400 text-center">Belum ada project.</p>
        ) : (
          <ul className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {allProjects.map((project) => (
              <li key={project.id}>
                <ProjectItem
                  id={project.id}
                  name={project.name}
                  createdAt={new Date(project.createdAt).toLocaleDateString()}
                />
              </li>
            ))}
          </ul>
        )}
      </div>
    </main>
  );
}
