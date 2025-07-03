// components/kanban-column.tsx
"use client";

// HAPUS SECARA TOTAL DEFINISI INTERFACE TASK INI DARI FILE INI:
// interface Task {
//   id: string;
//   title: string;
//   description: string | null;
//   status: "todo" | "in-progress" | "done"; // Ini yang menyebabkan konflik!
//   projectId: string;
//   createdAt: Date;
//   updatedAt: Date;
// }

import { useDroppable } from "@dnd-kit/core";
import TaskItem from "./TaskItem";
import { Task } from "@/types"; // <-- PASTIKAN ANDA MENGIMPOR INI

interface KanbanColumnProps {
  title: string;
  status: string; // <-- UBAH INI! HARUS STRING BIASA, BUKAN LITERAL UNION
  tasks: Task[]; // <-- Gunakan Task yang diimpor dari @/types
  projectId: string;
}

export default function KanbanColumn({ title, status, tasks, projectId }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id: status });

  const getBorderColor = (status: string) => {
    switch (status) {
      case "todo":
        return "border-blue-500";
      case "in-progress":
        return "border-yellow-500";
      case "done":
        return "border-green-500";
      default:
        return "border-gray-500";
    }
  };

  return (
    <div className="w-full md:w-1/3 p-2">
      <div className={`bg-gray-600 p-4 rounded-lg shadow-md border ${getBorderColor(status)}`}>
        <h3 className="font-semibold text-lg mb-4 text-center text-gray-400">{title}</h3>
        <div
          ref={setNodeRef}
          className="space-y-3 min-h-[120px] bg-gray-700 border border-gray-600 rounded-md p-3"
        >
          {tasks.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">Tidak ada task</p>
          ) : (
            tasks.map((task) => (
              // Pastikan TaskItem juga diimpor dan menggunakan Task dari @/types
              <TaskItem key={task.id} task={task} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}