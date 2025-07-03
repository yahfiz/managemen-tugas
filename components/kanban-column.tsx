"use client";

// Definisi interface Task, pastikan ini konsisten di seluruh aplikasi Anda
interface Task {
  id: string;
  title: string;
  description: string | null;
  status: "todo" | "in-progress" | "done"; // Sesuaikan dengan enum Status di Prisma Anda
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

import { useDroppable } from "@dnd-kit/core";
import TaskItem from "./TaskItem"; // Pastikan TaskItem juga disesuaikan temanya

interface KanbanColumnProps {
  title: string;
  status: "todo" | "in-progress" | "done";
  tasks: Task[];
  projectId: string;
}

export default function KanbanColumn({ title, status, tasks, projectId }: KanbanColumnProps) {
  const { setNodeRef } = useDroppable({ id: status });

  // Menentukan warna border berdasarkan status untuk visual yang lebih baik
  const getBorderColor = (status: string) => {
    switch (status) {
      case "todo":
        return "border-blue-500"; // Biru untuk To Do
      case "in-progress":
        return "border-yellow-500"; // Kuning untuk In Progress
      case "done":
        return "border-green-500"; // Hijau untuk Done
      default:
        return "border-gray-500";
    }
  };

  return (
    <div className="w-full md:w-1/3 p-2">
      {/* Latar belakang kolom menjadi lebih gelap, teks lebih terang */}
      <div className={`bg-gray-600 p-4 rounded-lg shadow-md border ${getBorderColor(status)}`}>
        <h3 className="font-semibold text-lg mb-4 text-center text-gray-400">{title}</h3>
        <div
          ref={setNodeRef}
          className="space-y-3 min-h-[120px] bg-gray-700 border border-gray-600 rounded-md p-3" // Area drop yang lebih gelap dan border
        >
          {tasks.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-4">Tidak ada task</p>
          ) : (
            tasks.map((task) => (
              // Pastikan TaskItem juga memiliki styling yang cocok dengan tema
              <TaskItem key={task.id} task={task} />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
