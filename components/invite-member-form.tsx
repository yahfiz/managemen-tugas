"use client";

import { useState } from "react";

export default function InviteMemberForm({ projectId }: { projectId: string }) {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setMessage("");

    const formData = new FormData();
    formData.append("email", email);

    const res = await fetch(`/api/projects/${projectId}/invite`, {
      method: "POST",
      body: formData,
    });

    if (res.ok) {
      setMessage("✅ Undangan berhasil dikirim!");
      setEmail("");
    } else {
      const text = await res.text();
      setMessage("❌ " + text);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-2 max-w-sm">
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email pengguna..."
        required
        className="border rounded px-3 py-2 w-full text-black"
      />
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm"
      >
        Kirim Undangan
      </button>
      {message && <p className="text-sm mt-1">{message}</p>}
    </form>
  );
}
