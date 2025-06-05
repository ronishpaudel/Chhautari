import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { CreatePollForm } from "@/components/create-poll-fprm";

export default async function CreatePollPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Create Poll</h1>
          <p className="text-muted-foreground">
            Create a poll for your community to vote on
          </p>
        </div>
        <CreatePollForm />
      </div>
    </DashboardLayout>
  );
}
