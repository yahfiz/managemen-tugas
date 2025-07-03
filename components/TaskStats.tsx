"use client";

import { Doughnut } from "react-chartjs-2";
import {
  Chart as ChartJS,
  ArcElement,    
  Title,
  Tooltip,
  Legend,
} from "chart.js";
interface Task {
  id: string;
  title: string;
  description: string | null;
  status: "todo" | "in-progress" | "done"; // Sesuaikan dengan enum Status di Prisma Anda
  projectId: string;
  createdAt: Date;
  updatedAt: Date;
}

// Hanya daftarkan elemen Chart.js yang benar-benar digunakan untuk Doughnut Chart
ChartJS.register(ArcElement, Title, Tooltip, Legend);

interface TaskStatsProps {
  tasks: Task[];
}

export default function TaskStats({ tasks }: TaskStatsProps) {
  const count = {
    todo: tasks.filter((t) => t.status === "todo").length,
    inProgress: tasks.filter((t) => t.status === "in-progress").length,
    done: tasks.filter((t) => t.status === "done").length,
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false, // Penting untuk mengontrol ukuran chart
    plugins: {
      legend: {
        position: "bottom" as const, // Posisi legend di bawah
        labels: {
          color: "#D1D5DB", // Warna teks legend (gray-300)
        },
      },
      title: {
        display: true,
        text: "Statistik Task Berdasarkan Status", // Judul yang lebih deskriptif
        color: "#F3F4F6", // Warna teks judul (gray-100)
        font: {
          size: 16, // Ukuran font judul
        },
      },
      tooltip: {
        backgroundColor: "#374151", // Latar belakang tooltip (gray-700)
        titleColor: "#F3F4F6", // Warna judul tooltip (gray-100)
        bodyColor: "#D1D5DB", // Warna body tooltip (gray-300)
        borderColor: "#4B5563", // Warna border tooltip (gray-600)
        borderWidth: 1,
      },
    },
    // Konfigurasi animasi bawaan Chart.js
    animation: {
      duration: 2000, // Durasi animasi dalam milidetik
      easing: 'easeOutQuart', // Jenis easing animasi
    },
  };

  const data = {
    labels: ["To Do", "In Progress", "Done"], // Label yang lebih rapi
    datasets: [
      {
        label: "Jumlah Task",
        data: [count.todo, count.inProgress, count.done],
        backgroundColor: [
          "#60A5FA", // Biru untuk To Do (mirip blue-400/500)
          "#FBBF24", // Kuning/Oranye untuk In Progress (mirip yellow-500/400)
          "#34D399", // Hijau untuk Done (mirip green-500)
        ],
        borderColor: "#1F2937", // Warna border antar segmen (gray-800)
        borderWidth: 2,
      },
    ],
  };

  return (
    // Div ini sudah dibungkus oleh card di page.tsx, jadi hanya perlu mengatur konten dalamnya
    <div className="mt-4"> {/* Mengurangi margin top karena sudah ada padding di card parent */}
      {/* Judul Statistik Task - disesuaikan dengan tema */}
      <div className="max-w-md mx-auto p-4 bg-gray-900 rounded-lg border border-gray-700"> {/* Menambahkan latar belakang chart area */}
        {/* Memastikan chart memiliki tinggi yang cukup */}
        <div style={{ height: '400px' }}>
          <Doughnut data={data}/>
        </div>
      </div>
    </div>
  );
}
