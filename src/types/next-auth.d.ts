import { DefaultSession } from "next-auth";
import { UserRole } from "@/models/User";

declare module "next-auth" {
  interface Session {
    user: DefaultSession["user"] & {
      id: string;
      role: UserRole;
    };
  }

  interface User {
    id: string;
    role: UserRole;
  }
}

declare module "@auth/core/jwt" {
  interface JWT {
    id: string;
    role: UserRole;
  }
}