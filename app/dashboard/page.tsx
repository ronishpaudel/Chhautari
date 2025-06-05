import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import { DashboardLayout } from "@/components/dashboard-layout";
import { FeedSection } from "@/components/feed-section";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);
  console.log("Session:", session);

  if (!session) {
    redirect("/auth/signin");
  }

  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold">
            Welcome back,{" "}
            {session.user.name ??
              session.user.email
                ?.split("@")[0]
                .split(".")[0]
                .replace(/^\w/, (c) => c.toUpperCase())}
            !
          </h1>
          <p className="text-muted-foreground">
            Stay connected with your {session.user.location} community
          </p>
        </div>
        <FeedSection />
      </div>
    </DashboardLayout>
  );
}
