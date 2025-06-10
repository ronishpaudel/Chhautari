import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { CommunityFeed } from "@/components/community-feed";

export default async function FeedPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <DashboardLayout>
      <CommunityFeed />
    </DashboardLayout>
  );
}
