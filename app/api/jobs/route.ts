import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// POST /api/jobs: Create a new job
export async function POST(request: Request) {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { title, description, category, location } = await request.json();
  if (!title || !description) {
    return NextResponse.json(
      { error: "Title and description are required" },
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

    const job = await prisma.job.create({
      data: {
        userId: user.id,
        title,
        description,
        category,
        location,
      },
      include: { user: true },
    });

    return NextResponse.json({ ...job, type: "job" });
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to create job" },
      { status: 500 }
    );
  }
}
