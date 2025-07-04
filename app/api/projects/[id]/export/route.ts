// app/api/projects/[id]/export/route.ts
import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { prisma } from "@/lib/prisma";
import { authOptions } from "@/lib/authOptions"; // Sudah benar, impor dari lib/authOptions

export async function GET(
  request: Request, // Gunakan `request` sebagai nama argumen pertama
  { params }: { params: { id: string } } // Pastikan tipenya benar dan akses params dari sini
) {
  try {
    const projectId = params.id; // <-- KOREKSI UTAMA DI SINI: Akses id langsung dari params

    const session = await getServerSession(authOptions);

    if (!session?.user?.email) {
      // Menggunakan NextResponse.json untuk respon JSON dan status
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    const project = await prisma.project.findFirst({
      where: {
        id: projectId, // Gunakan projectId yang sudah benar
        OR: [
          { ownerId: user.id },
          { members: { some: { userId: user.id } } },
        ],
      },
      include: {
        tasks: true,
        members: { include: { user: true } },
      },
    });

    if (!project) {
      return NextResponse.json({ message: "Project not found" }, { status: 404 });
    }

    const json = JSON.stringify(project, null, 2);

    // Menggunakan `new Response` untuk file download
    return new Response(json, {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        "Content-Disposition": `attachment; filename="project-${project.id}.json"`,
      },
    });
  } catch (error) {
    console.error("Error exporting project:", error);
    // Tangani error server internal dengan NextResponse.json
    return NextResponse.json({ message: "Internal Server Error" }, { status: 500 });
  }
}