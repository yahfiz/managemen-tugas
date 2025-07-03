import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/app/api/auth/[...nextauth]/route";
import { prisma } from "@/lib/prisma";

// POST handler for method override (_method)
export async function POST(
  req: NextRequest,
  context: { params: { id: string } }
) {
  const { id } = await Promise.resolve(context.params); // ✅ FIXED

  const formData = await req.formData();
  const method = formData.get("_method");

  if (method === "DELETE") {
    return await handleDelete(id, req);
  } else if (method === "PUT") {
    return await handlePut(id, req, formData);
  }

  return new NextResponse("Method Not Allowed", { status: 405 });
}

// ✅ DELETE Task
async function handleDelete(id: string, req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return new NextResponse("User not found", { status: 404 });

  const task = await prisma.task.findUnique({
    where: { id },
    include: { project: true },
  });

  if (!task || (task.assigneeId !== user.id && task.project.ownerId !== user.id)) {
    return new NextResponse("Forbidden", { status: 403 });
  }

  await prisma.task.delete({ where: { id } });
  return new NextResponse(null, { status: 204 });
}

// ✅ PUT / Edit Task
async function handlePut(id: string, req: NextRequest, formData: FormData) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) return new NextResponse("User not found", { status: 404 });

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const status = formData.get("status") as string;

  if (!title || !status) {
    return new NextResponse("Title dan status wajib diisi", { status: 400 });
  }

  const updated = await prisma.task.update({
    where: { id },
    data: {
      title,
      description,
      status,
    },
  });

  return NextResponse.json(updated);
}
