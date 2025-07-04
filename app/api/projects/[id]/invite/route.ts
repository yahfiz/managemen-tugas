// app/api/projects/[id]/invite/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions"; // Sudah benar
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request, // Gunakan 'request' sebagai nama argumen pertama
  { params }: { params: { id: string } } // Tanda tangan fungsi yang benar untuk App Router
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return new NextResponse("Unauthorized", { status: 401 });
  }

  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
  });

  if (!user) {
    return new NextResponse("User tidak ditemukan", { status: 404 });
  }

  // ✅ KOREKSI: Akses id langsung dari params
  const projectId = params.id;

  // Ambil email dari form
  const formData = await request.formData(); // Gunakan 'request' bukan 'req'
  const emailToInvite = formData.get("email") as string;

  if (!emailToInvite) {
    return new NextResponse("Email wajib diisi", { status: 400 });
  }

  const invitedUser = await prisma.user.findUnique({
    where: { email: emailToInvite },
  });

  if (!invitedUser) {
    return new NextResponse("User dengan email tersebut tidak ditemukan", {
      status: 404,
    });
  }

  const existing = await prisma.membership.findFirst({
    where: {
      projectId: projectId,
      userId: invitedUser.id,
    },
  });

  if (existing) {
    return new NextResponse("User sudah jadi anggota project ini", {
      status: 400,
    });
  }

  await prisma.membership.create({
    data: {
      projectId: projectId,
      userId: invitedUser.id,
    },
  });

  return NextResponse.json({ success: true });
}