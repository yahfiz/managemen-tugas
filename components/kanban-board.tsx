// components/kanban-board.tsx
"use client";

import { DndContext, closestCenter } from "@dnd-kit/core";
import { useState, useTransition } from "react";
import KanbanColumn from "./kanban-column";
import { Task } from "@/types"; // <-- Import Task dari file tipe bersama

// Interface KanbanBoardProps sekarang didefinisikan di types/index.ts,
// atau jika Anda tidak ingin memindahkannya, definisikan di sini TAPI PASTIKAN MENGGUNAKAN `Task` yang diimpor
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
  // `columns.status` ini adalah literal union, yang akan digunakan untuk filtering dan props `status` ke `KanbanColumn`.
  // Ini OK karena kita akan melakukan type assertion atau memastikan `KanbanColumn` bisa menerimanya.

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const movedTask = taskList.find((t) => t.id === active.id);
    if (!movedTask) return;

    // `over.id` akan sesuai dengan `col.status` dari `columns` (yaitu "todo", "in-progress", "done")
    // Ini bisa di-cast ke string karena status di Task adalah string.
    const newStatus: string = over.id as string;

    if (movedTask.status === newStatus) return;

    // Optimistic update UI
    const updatedTask = { ...movedTask, status: newStatus };
    const updatedList = taskList.map((t) =>
      t.id === movedTask.id ? updatedTask : t
    );
    setTaskList(updatedList);

    // Kirim ke server
    startTransition(async () => {
      const response = await fetch(`/api/tasks/${movedTask.id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: new URLSearchParams({
          _method: "PUT",
          title: movedTask.title,
          description: movedTask.description ?? "",
          status: newStatus,
          assigneeId: movedTask.assigneeId ?? "",
        }).toString(),
      });

      if (!response.ok) {
        console.error("Failed to update task status on server.");
      }
    });
  };

  return (
    <DndContext collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
      <div className="flex flex-col md:flex-row gap-4 p-4 rounded-lg">
        {columns.map((col) => (
          <KanbanColumn
            key={col.status}
            title={col.title}
            // Penting: Mengirim `col.status` sebagai string literal
            // `KanbanColumn` atau komponen anak harus menerima prop `status` sebagai string biasa,
            // atau Anda harus melakukan casting jika `KanbanColumn` mengharapkan literal union.
            // Asumsikan KanbanColumn menerima `status: string;`
            status={col.status}
            tasks={taskList.filter((task) => task.status === col.status)}
            projectId={projectId}
          />
        ))}
      </div>
    </DndContext>
  );
}