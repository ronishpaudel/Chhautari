import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { AnalyticsSection } from "@/components/analytics-section";

export default async function AnalyticsPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/auth/signin");
  }

  // // Check if user has admin/moderator role
  // if (
  //   session.user.role !== "ADMIN" &&
  //   session.user.role !== "SERVICE_PROVIDER"
  // ) {
  //   redirect("/dashboard");
  // }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">Analytics Dashboard</h1>
          <p className="text-muted-foreground">
            Community insights and engagement metrics
          </p>
        </div>
        <AnalyticsSection />
      </div>
    </DashboardLayout>
  );
}
