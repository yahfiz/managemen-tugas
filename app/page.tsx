// app/page.tsx
"use client";

import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";

export default function HomePage() {
  const router = useRouter();

  return (
    <main className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-gray-800 to-gray-700 text-white px-4">
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="bg-white/10 backdrop-blur-md p-10 rounded-2xl shadow-2xl text-center max-w-md w-full"
      >
        <h1 className="text-4xl font-extrabold mb-4">📋 Manajemen Tugas</h1>
        <p className="text-sm text-white/90 mb-6">
          Kelola proyek dan tugas-tugasmu dengan lebih mudah dan efisien.
        </p>

        <Button
          variant="secondary"
          className="w-full bg-white text-black font-semibold hover:bg-white/90 transition"
          onClick={() => router.push("/login")}
        >
          Masuk Sekarang
        </Button>
      </motion.div>
    </main>
  );
}
