import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const jobs = await prisma.job.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
            location: true,
            isVerified: true,
          },
        },
        applications: {
          select: { id: true },
        },
      },
      take: 20, // limit to 20 jobs, adjust as needed
    });

    // Map jobs to a cleaner shape for frontend
    const formattedJobs = jobs.map((job) => ({
      id: job.id,
      title: job.title,
      description: job.description,
      category: job.category,
      location: job.location,
      isUrgent: job.isVerified === false, // Or your own urgent logic
      applications: job.applications.length,
      views: 0, // Add real views logic if you have it
      postedBy: {
        name: job.user.name,
        avatar: job.user.image || "/placeholder.svg",
        isVerified: job.user.isVerified,
      },
    }));

    return NextResponse.json(formattedJobs);
  } catch (error) {
    console.error("GET /api/jobs error:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
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
