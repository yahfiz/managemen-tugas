"use client";

import { useState } from "react";

export default function ProjectForm() {
  const [name, setName] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    const res = await fetch("/api/projects", {
      method: "POST",
      body: JSON.stringify({ name }), // pastikan name dikirim
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (res.ok) {
      setName("");
      window.location.reload();
    } else {
      alert("Gagal menambah project");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 mb-4">
      <input
        type="text"
        value={name}
        placeholder="Nama project"
        onChange={(e) => setName(e.target.value)}
        className="border p-2 text-black rounded w-full hover:bg-slate-300"
        required
      />
      <button
        type="submit"
        className="bg-black text-white px-4 rounded hover:bg-gray-600"
      >
        Tambah
      </button>
    </form>
  );
}
