// app/api/projects/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; // Sudah benar
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) { // Menggunakan 'request' untuk konsistensi
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    // ✅ KOREKSI: Gunakan NextResponse.json untuk respons JSON error
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json(); // Menggunakan 'request'
  const name = body.name;

  if (!name) {
    // ✅ KOREKSI: Gunakan NextResponse.json untuk respons JSON error
    return NextResponse.json({ message: "Nama project wajib diisi" }, { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    // ✅ KOREKSI: Gunakan NextResponse.json untuk respons JSON error
    return NextResponse.json({ message: "User tidak ditemukan" }, { status: 404 });
  }

  await prisma.project.create({
    data: {
      name,
      ownerId: user.id,
    },
  });

  // Respon sukses sudah benar menggunakan NextResponse.json
  return NextResponse.json({ success: true, message: "Project berhasil dibuat" });
}

export async function GET(request: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return NextResponse.json({ message: "User tidak ditemukan" }, { status: 404 });
  }

  const projects = await prisma.project.findMany({
    where: {
      OR: [
        { ownerId: user.id },
        { members: { some: { userId: user.id } } },
      ],
    },
    include: {
        members: { include: { user: true } },
        tasks: true,
    }
  });

  return NextResponse.json(projects, { status: 200 });
}
