import { NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: Request,
  { params }: { params: { pollId: string } }
) {
  try {
    // 1. Authenticate user
    const session = await getServerSession(authOptions);
    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    const userId = session.user.id;

    // 2. Parse request body
    const { option } = await request.json();
    if (!option || typeof option !== "string") {
      return NextResponse.json(
        { error: "Option is required" },
        { status: 400 }
      );
    }

    const pollId = params.pollId;

    // 3. Check if poll exists and get current votes
    const poll = await prisma.poll.findUnique({
      where: { id: pollId },
      include: {
        votes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!poll) {
      return NextResponse.json({ error: "Poll not found" }, { status: 404 });
    }

    // 4. Check if user already voted on this poll
    const existingVote = poll.votes.find((vote) => vote.userId === userId);
    if (existingVote) {
      return NextResponse.json(
        { error: "User already voted" },
        { status: 403 }
      );
    }

    // 5. Validate option is one of poll options
    if (!poll.options.includes(option)) {
      return NextResponse.json({ error: "Invalid option" }, { status: 400 });
    }

    // 6. Create vote record using a transaction for consistency
    const newVote = await prisma.vote.create({
      data: {
        userId,
        pollId,
        option,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            image: true,
          },
        },
      },
    });

    // 7. Get all votes for this poll (including the new one)
    const allVotes = [...poll.votes, newVote];

    // 8. Calculate vote results
    const voteResults: Record<string, number> = {};
    const votersByOption: Record<
      string,
      Array<{ id: string; name: string; image?: string }>
    > = {};

    // Initialize all options with 0 votes
    poll.options.forEach((opt) => {
      voteResults[opt] = 0;
      votersByOption[opt] = [];
    });

    // Count votes and track voters for each option
    allVotes.forEach((vote) => {
      if (poll.options.includes(vote.option)) {
        // Extra safety check
        voteResults[vote.option] = (voteResults[vote.option] || 0) + 1;
        votersByOption[vote.option].push({
          id: vote.user.id,
          name: vote.user.name || "Anonymous",
          image: vote.user.image || undefined,
        });
      }
    });

    const totalVotes = allVotes.length;

    // 9. Return comprehensive vote data
    const responseData = {
      message: "Vote recorded",
      pollId,
      totalVotes,
      voteResults,
      votersByOption,
      userVote: option,
      hasVoted: true,
    };

    return NextResponse.json(responseData, { status: 200 });
  } catch (error) {
    console.error("Vote API error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// Optional: Add a GET endpoint to fetch current poll results
export async function GET(
  request: Request,
  { params }: { params: { pollId: string } }
) {
  try {
    const session = await getServerSession(authOptions);
    const userId = session?.user?.id;

    const poll = await prisma.poll.findUnique({
      where: { id: params.pollId },
      include: {
        votes: {
          include: {
            user: {
              select: {
                id: true,
                name: true,
                image: true,
              },
            },
          },
        },
      },
    });

    if (!poll) {
      return NextResponse.json({ error: "Poll not found" }, { status: 404 });
    }

    // Calculate vote results
    const voteResults: Record<string, number> = {};
    const votersByOption: Record<
      string,
      Array<{ id: string; name: string; image?: string }>
    > = {};

    poll.options.forEach((opt) => {
      voteResults[opt] = 0;
      votersByOption[opt] = [];
    });

    poll.votes.forEach((vote) => {
      if (poll.options.includes(vote.option)) {
        voteResults[vote.option] = (voteResults[vote.option] || 0) + 1;
        votersByOption[vote.option].push({
          id: vote.user.id,
          name: vote.user.name || "Anonymous",
          image: vote.user.image || undefined,
        });
      }
    });

    const userVote = userId
      ? poll.votes.find((v) => v.userId === userId)?.option
      : null;
    const hasVoted = !!userVote;

    return NextResponse.json({
      pollId: poll.id,
      question: poll.question,
      options: poll.options,
      totalVotes: poll.votes.length,
      voteResults,
      votersByOption,
      userVote,
      hasVoted,
      expiresAt: poll.expiresAt,
    });
  } catch (error) {
    console.error("Get poll error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
