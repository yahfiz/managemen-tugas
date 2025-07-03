import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import { prisma } from "@/lib/prisma";

export async function POST(req: Request) {
  const session = await getServerSession(authOptions);

  if (!session || !session.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const body = await req.json();
  const name = body.name;

  if (!name) {
    return new NextResponse("Nama project wajib diisi", { status: 400 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return new NextResponse("User tidak ditemukan", { status: 404 });
  }

  await prisma.project.create({
    data: {
      name,
      ownerId: user.id,
    },
  });

  return NextResponse.json({ success: true });
}
