import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const { title, description } = body;

  if (!title) {
    return new NextResponse("Judul task wajib diisi", { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return new NextResponse("User tidak ditemukan", { status: 404 });
  }

  
  const resolvedParams = await Promise.resolve(params);
  const projectId = resolvedParams.id;

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
    return new NextResponse("Kamu tidak punya akses ke project ini", {
      status: 403,
    });
  }

  const task = await prisma.task.create({
    data: {
      title,
      description,
      status: "todo",
      projectId, 
      assigneeId: user.id,
    },
  });

  return NextResponse.json(task);
}
