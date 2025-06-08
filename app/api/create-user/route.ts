import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { email, name, location } = body;

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 });
    }

    const user = await prisma.user.upsert({
      where: { email },
      create: { email, name, location },
      update: { name, location },
    });

    return NextResponse.json({ message: "User upserted", user });
  } catch (error) {
    console.error("Error in create-user API:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
