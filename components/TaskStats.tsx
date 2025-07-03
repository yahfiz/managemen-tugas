// TaskStats.tsx

"use client";

import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
// Hapus definisi interface Task lokal di sini.
// interface Task { ... }

import { Task, TaskStatsProps } from "@/types"; // <-- Import Task dan TaskStatsProps dari file tipe bersama

// Hanya daftarkan elemen Chart.js yang benar-benar digunakan untuk Doughnut Chart
ChartJS.register(ArcElement, Title, Tooltip, Legend);

// Interface TaskStatsProps sekarang diimpor dari "@/types"
// interface TaskStatsProps { tasks: Task[]; }

export default function TaskStats({ tasks }: TaskStatsProps) {
  const count = {
    // Membandingkan dengan string biasa, karena status di Task adalah string
    todo: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    done: tasks.filter((t) => t.status === "done").length,
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          color: "#D1D5DB",
        },
      },
      title: {
        display: true,
        text: "Statistik Task Berdasarkan Status",
        color: "#F3F4F6",
        font: {
          size: 16,
        },
      },
      tooltip: {
        backgroundColor: "#374151",
        titleColor: "#F3F4F6",
        bodyColor: "#D1D5DB",
        borderColor: "#4B5563",
        borderWidth: 1,
      },
    },
    animation: {
      duration: 2000,
      easing: 'easeOutQuart',
    },
  };

  const data = {
    labels: ["To Do", "In Progress", "Done"],
    datasets: [
      {
        label: "Jumlah Task",
        data: [count.todo, count.inProgress, count.done],
        backgroundColor: [
          "#60A5FA",
          "#FBBF24",
          "#34D399",
        ],
        borderColor: "#1F2937",
        borderWidth: 2,
      },
    ],
  };

  return (
    <div className="mt-4">
      <div className="max-w-md mx-auto p-4 bg-gray-900 rounded-lg border border-gray-700">
        <div style={{ height: '400px' }}>
          <Doughnut data={data}/> {/* Menambahkan options ke Doughnut */}
        </div>
      </div>
    </div>
  );
}