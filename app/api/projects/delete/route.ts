// app/api/projects/[id]/delete/route.ts
import { prisma } from "@/lib/prisma";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; // Sudah benar
import { NextResponse } from "next/server";

export async function POST(
  request: Request, // Gunakan 'request' untuk konsistensi
  { params }: { params: { id: string } } // ✅ KOREKSI: Tambahkan argumen params
) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 }); // ✅ KOREKSI: Gunakan NextResponse.json
  }

  // ✅ KOREKSI: Ambil id langsung dari params
  const projectId = params.id;

  if (!projectId) { // Cek projectId dari params, bukan dari searchParams
    return NextResponse.json({ message: "Project ID tidak ditemukan" }, { status: 400 }); // ✅ KOREKSI: Gunakan NextResponse.json
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) { // Tambahkan pengecekan jika user tidak ditemukan
    return NextResponse.json({ message: "User tidak ditemukan" }, { status: 404 });
  }

  // Penting: Pastikan hanya pemilik yang bisa menghapus proyek
  const projectToDelete = await prisma.project.findUnique({
    where: {
      id: projectId,
    },
  });

  if (!projectToDelete || projectToDelete.ownerId !== user.id) {
    return NextResponse.json({ message: "Kamu tidak punya izin untuk menghapus project ini atau project tidak ditemukan" }, { status: 403 });
  }

  // Hapus proyek
  await prisma.project.delete({
    where: {
      id: projectId,
    },
  });

  return NextResponse.json({ success: true, message: "Project berhasil dihapus" });
}