// types/index.ts
export interface Task {
  id: string;
  title: string;
  description: string | null;
  status: string; // <-- PENTING: string, BUKAN literal union
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
  assigneeId: string | null;
}

export interface ProjectMember {
  id: string;
  user: {
    email: string;
  };
}

export interface TaskStatsProps { // <-- Tambahkan ini
  tasks: Task[];
}