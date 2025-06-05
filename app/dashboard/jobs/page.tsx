import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { JobsSection } from "@/components/job-section";

export default async function JobsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">Jobs & Services</h1>
            <p className="text-muted-foreground">
              Find local services or offer your skills to the community
            </p>
          </div>
        </div>
        <JobsSection />
      </div>
    </DashboardLayout>
  );
}
