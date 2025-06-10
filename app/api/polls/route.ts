import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session || !session.user?.email) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  try {
    const polls = await prisma.poll.findMany({
      orderBy: { createdAt: "desc" },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
            image: true,
            location: true,
            isVerified: true,
          },
        },
        votes: true,
      },
      take: 20, // limit results as needed
    });

    // Map polls to include vote counts and userVote info if needed
    const formattedPolls = polls.map((poll) => {
      // Count votes per option
      const voteResults = poll.options.reduce<Record<string, number>>(
        (acc, option) => {
          acc[option] = 0;
          return acc;
        },
        {}
      );

      // Count votes for each option
      poll.votes.forEach((vote) => {
        if (vote.option in voteResults) {
          voteResults[vote.option]++;
        }
      });

      // Check if current user has voted and which option
      const userVote = poll.votes.find(
        (v) => v.userId === session.user.id
      )?.option;

      return {
        id: poll.id,
        question: poll.question,
        options: poll.options,
        expiresAt: poll.expiresAt,
        createdAt: poll.createdAt,
        userVote,
        voteResults,
        totalVotes: poll.votes.length,
        author: {
          id: poll.user.id,
          name: poll.user.name,
          image: poll.user.image,
          location: poll.user.location,
          isVerified: poll.user.isVerified,
        },
      };
    });

    return NextResponse.json(formattedPolls);
  } catch (error) {
    console.error("GET /api/polls error:", error);
    return NextResponse.json(
      { error: "Failed to fetch polls" },
      { status: 500 }
    );
  }
}

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
