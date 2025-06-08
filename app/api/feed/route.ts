import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

// GET /api/feed: Fetch combined feed of posts, jobs, and polls
export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const posts = await prisma.post.findMany({
      include: { user: true, comments: { select: { id: true } } },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    const jobs = await prisma.job.findMany({
      include: { user: true, applications: { select: { id: true } } },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    const polls = await prisma.poll.findMany({
      include: { user: true, votes: { select: { id: true } } },
      orderBy: { createdAt: "desc" },
      take: 10,
    });

    const feedItems = [
      ...posts.map((post) => ({
        ...post,
        type: "post" as const,
        likes: 0, // Add logic for likes if implemented
        views: 0, // Add logic for views if implemented
      })),
      ...jobs.map((job) => ({
        ...job,
        type: "job" as const,
        description: job.description,
        views: 0, // Add logic for views if implemented
      })),
      ...polls.map((poll) => ({
        ...poll,
        type: "poll" as const,
        question: poll.question,
        views: 0, // Add logic for views if implemented
      })),
    ].sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
    );

    return NextResponse.json(feedItems);
  } catch (error) {
    return NextResponse.json(
      { error: "Failed to fetch feed" },
      { status: 500 }
    );
  }
}
