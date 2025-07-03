"use client";

import { useState } from "react";

export default function TaskForm({ projectId }: { projectId: string }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const res = await fetch(`/api/projects/${projectId}/tasks`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ title, description }),
    });

    if (res.ok) {
      setTitle("");
      setDescription("");
      window.location.reload(); // refresh halaman untuk tampilkan task baru
    } else {
      alert("Gagal menambahkan task");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 mb-6">
      <input
        type="text"
        placeholder="Judul task"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        className="w-full text-gray-950 px-3 py-2 rounded hover:bg-gray-400"
        required
      />
      <textarea
        placeholder="Deskripsi (opsional)"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        className="w-full text-gray-950 px-3 py-2 rounded hover:bg-gray-400"
      />
      <button
        type="submit"
        className="bg-black text-white px-4 py-2 rounded hover:bg-gray-600"
      >
        Tambah Task
      </button>
    </form>
  );
}
