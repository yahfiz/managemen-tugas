// app/api/projects/[id]/tasks/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; // Sudah benar
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request, // Gunakan 'request' untuk konsistensi (sebelumnya 'req')
  { params }: { params: { id: string } } // Tanda tangan fungsi yang benar
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    // Gunakan NextResponse.json untuk respons JSON error
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json(); // Gunakan 'request' bukan 'req'
  const { title, description } = body;

  if (!title) {
    return NextResponse.json({ message: "Judul task wajib diisi" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ message: "User tidak ditemukan" }, { status: 404 });
  }

  // ✅ KOREKSI: Akses id langsung dari params
  const projectId = params.id;

  const isMember = await prisma.project.findFirst({
    where: {
      id: projectId,
      OR: [
        { ownerId: user.id },
        { members: { some: { userId: user.id } } },
      ],
    },
  });

  if (!isMember) {
    return NextResponse.json({ message: "Kamu tidak punya akses ke project ini" }, { status: 403 });
  }

  const task = await prisma.task.create({
    data: {
      title,
      description,
      status: "todo", // Pastikan ini konsisten dengan `status: string;` di `types/index.ts`
      projectId,
      assigneeId: user.id, // Menetapkan user yang membuat task sebagai assignee
    },
  });

  return NextResponse.json(task);
}