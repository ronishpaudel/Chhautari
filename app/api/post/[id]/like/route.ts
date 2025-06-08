// app/api/posts/[id]/like/route.ts
import { NextRequest, NextResponse } from "next/server";
import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { prisma } from "@/lib/prisma";

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const postId = params.id;

    // Check if post exists
    const post = await prisma.post.findUnique({
      where: { id: postId },
    });

    if (!post) {
      return NextResponse.json({ error: "Post not found" }, { status: 404 });
    }

    // For now, we'll just return success since we don't have a likes table
    // In a real app, you'd want to create a likes table with composite unique key on (userId, postId)

    return NextResponse.json({
      success: true,
      message: "Post liked successfully",
    });
  } catch (error) {
    console.error("Like post error:", error);
    return NextResponse.json({ error: "Failed to like post" }, { status: 500 });
  }
}

// export async function DELETE(
//   request: NextRequest,
//   { params }: { params: { id: string } }
// ) {
//   try {
//     const session = await getServerSession(authOptions);

//     if (!session?.user?.id) {
//       return NextResponse.json(
//         { error: "Unauthorized" },
//         { status: 401 }
//       );
//     }

//     const postId = params.id;

//     // Check if post exists and user owns it
//     const post = await prisma.post.findUnique({
//       where: { id: postId },
//     });
//     ret
//   }
