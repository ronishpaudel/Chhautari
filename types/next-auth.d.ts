import type { UserRole } from "@prisma/client"

declare module "next-auth" {
  interface Session {
    user: {
      id: string
      name?: string | null
      email?: string | null
      image?: string | null
      role?: UserRole
      location?: string | null
      isVerified?: boolean
    }
  }

  interface User {
    role?: UserRole
    location?: string | null
    isVerified?: boolean
  }
}
