import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { PollsSection } from "@/components/polls-section";

export default async function PollsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Polls & Voting</h1>
          <p className="text-muted-foreground">
            Participate in community decisions and create polls
          </p>
        </div>
        <PollsSection />
      </div>
    </DashboardLayout>
  );
}
