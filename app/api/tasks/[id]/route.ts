// app/api/tasks/[id]/route.ts
import { NextRequest, NextResponse } from "next/server"; // Biarkan NextRequest karena digunakan di helper functions
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; // Sudah benar
import { prisma } from "@/lib/prisma";

// POST handler for method override (_method)
export async function POST(
  request: Request, // Gunakan 'request' dan tipe 'Request' untuk konsistensi dengan App Router
  { params }: { params: { id: string } } // Pastikan tanda tangan ini
) {
  // ✅ KOREKSI: Akses id langsung dari params
  const taskId = params.id;

  const formData = await request.formData(); // Gunakan 'request'
  const method = formData.get("_method");

  if (method === "DELETE") {
    // Teruskan 'request' ke fungsi helper (yang sudah type `NextRequest`)
    // atau ubah tanda tangan handleDelete menjadi `(id: string, request: Request)`
    return await handleDelete(taskId, request as NextRequest); // Type assertion atau ubah signature
  } else if (method === "PUT") {
    // Teruskan 'request' ke fungsi helper (yang sudah type `NextRequest`)
    return await handlePut(taskId, request as NextRequest, formData); // Type assertion atau ubah signature
  }

  // ✅ KOREKSI: Gunakan NextResponse.json untuk respons error
  return NextResponse.json({ message: "Method Not Allowed" }, { status: 405 });
}

// ✅ DELETE Task
async function handleDelete(id: string, request: NextRequest) { // Gunakan 'request' untuk konsistensi
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    // ✅ KOREKSI: Gunakan NextResponse.json untuk respons JSON error
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    // ✅ KOREKSI: Gunakan NextResponse.json untuk respons JSON error
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const task = await prisma.task.findUnique({
    where: { id },
    include: { project: true },
  });

  // Pastikan user adalah assignee atau owner project
  if (!task || (task.assigneeId !== user.id && task.project.ownerId !== user.id)) {
    // ✅ KOREKSI: Gunakan NextResponse.json untuk respons JSON error
    return NextResponse.json({ message: "Forbidden: Not authorized to delete this task" }, { status: 403 });
  }

  await prisma.task.delete({ where: { id } });
  // ✅ KOREKSI: Mengembalikan pesan sukses JSON atau tetap 204 No Content
  // Jika ingin 204 No Content, NextResponse.json(null, { status: 204 }) juga bisa
  // atau hanya return new Response(null, { status: 204 });
  return NextResponse.json({ message: "Task successfully deleted" }, { status: 200 }); // Lebih informatif
}

// ✅ PUT / Edit Task
async function handlePut(id: string, request: NextRequest, formData: FormData) { // Gunakan 'request' untuk konsistensi
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    // ✅ KOREKSI: Gunakan NextResponse.json untuk respons JSON error
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    // ✅ KOREKSI: Gunakan NextResponse.json untuk respons JSON error
    return NextResponse.json({ message: "User not found" }, { status: 404 });
  }

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const status = formData.get("status") as string;

  if (!title || !status) {
    // ✅ KOREKSI: Gunakan NextResponse.json untuk respons JSON error
    return NextResponse.json({ message: "Title dan status wajib diisi" }, { status: 400 });
  }

  // Tambahkan pengecekan izin update, sama seperti delete
  const taskToUpdate = await prisma.task.findUnique({
    where: { id },
    include: { project: true },
  });

  if (!taskToUpdate || (taskToUpdate.assigneeId !== user.id && taskToUpdate.project.ownerId !== user.id)) {
    return NextResponse.json({ message: "Forbidden: Not authorized to update this task" }, { status: 403 });
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