"use client";

import { DndContext, closestCenter } from "@dnd-kit/core";
// import { CSS } from "@dnd-kit/utilities"; // Dihapus: tidak digunakan
import { useState, useTransition } from "react";
import KanbanColumn from "./kanban-column"; // Pastikan komponen ini juga memiliki styling yang cocok dengan tema gelap

// Definisi interface Task, ini sudah benar dan tidak menyebabkan error
interface Task {
  id: string;
  title: string;
  description: string | null;
  status: "todo" | "in-progress" | "done"; // Sesuaikan dengan enum Status di Prisma Anda
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

interface KanbanBoardProps {
  tasks: Task[];
  projectId: string;
}

export default function KanbanBoard({ tasks, projectId }: KanbanBoardProps) {
  const [taskList, setTaskList] = useState<Task[]>(tasks);
  const [isPending, startTransition] = useTransition();

  const columns = [
    { title: "📝 To Do", status: "todo" },
    { title: "⏳ In Progress", status: "in-progress" },
    { title: "✅ Done", status: "done" },
  ] as const;

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const movedTask = taskList.find((t) => t.id === active.id);
    if (!movedTask) return;

    const newStatus = over.id as "todo" | "in-progress" | "done";

    if (movedTask.status === newStatus) return;

    // Optimistik update UI
    const updatedTask = { ...movedTask, status: newStatus };
    const updatedList = taskList.map((t) =>
      t.id === movedTask.id ? updatedTask : t
    );
    setTaskList(updatedList);

    // Kirim ke server
    startTransition(async () => {
      const response = await fetch(`/api/tasks/${movedTask.id}`, {
        method: "POST", // Menggunakan POST dengan _method: PUT untuk form submission
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', // Penting untuk URLSearchParams
        },
        body: new URLSearchParams({
          _method: "PUT", // Ini adalah cara Next.js menangani method override untuk form actions
          title: movedTask.title,
          description: movedTask.description ?? "", // Pastikan description tidak null
          status: newStatus,
        }).toString(), // Pastikan body diubah menjadi string
      });

      // Handle response jika diperlukan, misalnya untuk error handling
      if (!response.ok) {
        console.error("Failed to update task status on server.");
        // Opsional: rollback UI jika update server gagal
        // setTaskList(taskList);
      }
    });
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      {/* Container untuk kolom-kolom Kanban */}
      {/* Menambahkan styling untuk mencocokkan tema gelap page.tsx */}
      <div className="flex flex-col md:flex-row gap-4 p-4 rounded-lg"> {/* Hapus bg-gray-800 di sini karena sudah di page.tsx */}
        {columns.map((col) => (
          <KanbanColumn
            key={col.status}
            title={col.title}
            status={col.status}
            tasks={taskList.filter((task) => task.status === col.status)}
            projectId={projectId}
          />
        ))}
      </div>
    </DndContext>
  );
}
