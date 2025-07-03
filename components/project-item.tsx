"use client";

import Link from "next/link";
import { useState, useTransition } from "react";
import { motion } from "framer-motion";
import { Trash2, Eye } from "lucide-react";

interface ProjectItemProps {
  id: string;
  name: string;
  createdAt: string;
}

export default function ProjectItem({ id, name, createdAt }: ProjectItemProps) {
  const [isDeleting, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleDelete = async () => {
    const confirmDelete = confirm("Yakin ingin menghapus project ini?");
    if (!confirmDelete) return;

    startTransition(async () => {
      const res = await fetch(`/api/projects/delete?id=${id}`, {
        method: "POST",
        body: new URLSearchParams({ _method: "DELETE" }),
      });

      if (res.ok) {
        window.location.reload(); // Tetap di dashboard
      } else {
        const text = await res.text();
        setError("Gagal menghapus: " + text);
      }
    });
  };

  return (
    <motion.div
      whileHover={{ y: -2, scale: 1.01 }}
      transition={{ type: "spring", stiffness: 300 }}
      className="bg-gradient-to-br from-gray-800 to-gray-900 rounded-xl p-5 shadow-lg text-white border border-gray-700"
    >
      <div className="flex flex-col gap-2">
        <h3 className="text-lg font-semibold">{name}</h3>
        <p className="text-sm text-gray-400">📅 Dibuat: {createdAt}</p>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      <div className="flex justify-end mt-4 gap-3">
        <Link
          href={`/projects/${id}`}
          className="flex items-center gap-1 text-sm bg-blue-600 hover:bg-blue-700 px-3 py-1 rounded text-white transition-all"
        >
          <Eye size={16} /> Lihat
        </Link>

        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className="flex items-center gap-1 text-sm bg-red-600 hover:bg-red-700 px-3 py-1 rounded text-white transition-all"
        >
          <Trash2 size={16} />
          {isDeleting ? "Menghapus..." : "Hapus"}
        </button>
      </div>
    </motion.div>
  );
}
