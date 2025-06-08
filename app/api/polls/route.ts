import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// POST /api/polls: Create a new poll
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { question, options, expiresAt } = await request.json();
  if (!question || !options || options.length < 2) {
    return NextResponse.json(
      { error: "Question and at least two options are required" },
      { status: 400 }
    );
  }

  try {
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    const poll = await prisma.poll.create({
      data: {
        userId: user.id,
        question,
        options,
        expiresAt: expiresAt ? new Date(expiresAt) : undefined,
      },
      include: { user: true },
    });

    return NextResponse.json({ ...poll, type: "poll" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create poll" },
      { status: 500 }
    );
  }
}
