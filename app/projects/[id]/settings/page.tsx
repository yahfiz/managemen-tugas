// app/projects/[id]/settings/page.tsx
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { notFound, redirect } from "next/navigation";
import Link from "next/link";
import InviteMemberForm from "@/components/invite-member-form";
import { authOptions } from "@/lib/authOptions";

export const dynamic = "force-dynamic";

export default async function ProjectSettingsPage({
  params,
}: {
  params: { id: string };
}) {
  const { id } = await params;

  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    redirect("/login");
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  const project = await prisma.project.findUnique({
    where: {
      id,
      ownerId: user?.id,
    },
  });

  if (!project) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 text-white px-6 py-10">
      <div className="max-w-5xl mx-auto">
        {/* Header halaman */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-100">⚙️ Pengaturan Project</h1>
            <Link
              href={`/projects/${project.id}`}
              className="text-sm text-blue-400 hover:underline inline-block mt-2"
            >
              ← Kembali ke Project
            </Link>
          </div>
        </div>

        {/* Bagian Undang Anggota */}
        <section className="bg-gray-800 p-6 rounded-lg shadow-xl mb-8 border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-200">➕ Undang Anggota</h2>
          <InviteMemberForm projectId={project.id} />
        </section>

        {/* Bagian Export Data Project */}
        <section className="bg-gray-800 p-6 rounded-lg shadow-xl border border-gray-700">
          <h2 className="text-xl font-semibold mb-4 text-gray-200">📁 Export Data Project</h2>
          <a
            href={`/api/projects/${project.id}/export`}
            className="inline-block bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 focus:ring-offset-gray-800 transition-colors duration-200 font-semibold"
            download
          >
            Download JSON
          </a>
        </section>
      </div>
    </main>
  );
}