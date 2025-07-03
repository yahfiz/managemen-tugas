"use client";

import { signOut } from "next-auth/react";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";

export default function LogoutButton() {
  return (
    <Button
      onClick={() => signOut({ callbackUrl: "/" })}
      variant="destructive"
      className="flex items-center gap-2 text-sm"
    >
      <LogOut size={16} />
      Logout
    </Button>
  );
}
