// app/api/auth/[...nextauth]/route.ts
import NextAuth from "next-auth";
import { authOptions } from "@/lib/authOptions"; 

// Handler NextAuth.js
const handler = NextAuth(authOptions);

// Next.js App Router mengharapkan ekspor handler untuk setiap metode HTTP
export { handler as GET, handler as POST };