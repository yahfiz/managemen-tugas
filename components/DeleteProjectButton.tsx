"use client";

import { useRouter } from "next/navigation";
import { useState, useTransition } from "react";

interface Props {
  projectId: string;
}

export default function DeleteProjectButton({ projectId }: Props) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState("");

  const handleDelete = async () => {
    const confirmed = confirm("Yakin ingin menghapus project ini?");
    if (!confirmed) return;

    startTransition(async () => {
      try {
        const res = await fetch(`/api/projects/delete?id=${projectId}`, {
          method: "POST",
          body: new URLSearchParams({ _method: "DELETE" }),
        });

        if (res.ok) {
          router.push("/dashboard"); // 👈 Pindah ke dashboard setelah delete
          router.refresh();
        } else {
          const msg = await res.text();
          setError("Gagal menghapus project: " + msg);
        }
      } catch (err) {
        setError("Terjadi kesalahan saat menghapus project.");
      }
    });
  };

  return (
    <div className="space-y-2 mt-2">
      {error && <p className="text-sm text-red-500">{error}</p>}
      <button
        onClick={handleDelete}
        disabled={isPending}
        className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 text-sm"
      >
        {isPending ? "Menghapus..." : "Hapus Project"}
      </button>
    </div>
  );
}
