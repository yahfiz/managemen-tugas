"use client";

import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";

// --- PERBAIKAN UTAMA DI SINI ---
// Anda tidak bisa mengimpor 'Task' langsung dari "@prisma/client".
// Definisi interface Task secara manual, pastikan ini konsisten
// dengan model Task di schema.prisma Anda.
interface Task {
  id: string;
  title: string;
  description: string | null;
  status: "todo" | "in-progress" | "done"; // Sesuaikan dengan enum Status di Prisma Anda
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
  // Tambahkan properti lain yang ada di model Task Prisma Anda jika diperlukan
}

export default function TaskItem({ task }: { task: Task }) {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      {...attributes}
      {...listeners}
      // Mengubah styling agar cocok dengan tema gelap KanbanBoard dan page.tsx
      // Latar belakang: bg-gray-700, padding lebih besar, sudut membulat, bayangan, border
      // Kursor: cursor-grab untuk menunjukkan bisa digeser, active:cursor-grabbing saat aktif
      // Hover: efek hover yang halus
      className="bg-gray-700 p-4 rounded-lg shadow-md border border-gray-600 cursor-grab active:cursor-grabbing hover:bg-gray-600 transition-colors duration-200"
    >
      {/* Warna teks judul lebih terang agar terlihat di latar belakang gelap */}
      <p className="font-semibold text-gray-100">{task.title}</p>
      {/* Warna teks deskripsi abu-abu lebih terang, dengan margin top sedikit */}
      <p className="text-sm text-gray-400 mt-1">
        {task.description || "Tidak ada deskripsi"}
      </p>
    </div>
  );
}