import NextAuth from "next-auth";
import { authConfig } from "./lib/auth.config";

const { auth } = NextAuth(authConfig);

// Usamos el export default para máxima compatibilidad con las versiones más recientes de Next.js
export default auth;

export const config = {
  matcher: ["/dashboard/:path*"],
};
