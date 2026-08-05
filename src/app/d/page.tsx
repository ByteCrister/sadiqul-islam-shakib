import { getServerSession } from "next-auth/next";
import { authOptions } from "@/lib/auth";
import { redirect } from "next/navigation";
import DashboardTabs from "@/components/dashboard/DashboardTabs";
import DashboardHeader from "@/components/dashboard/DashboardHeader";

export default async function DashboardPage() {
  const session = await getServerSession(authOptions);

  if (!session) {
    redirect("/signin");
  }

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 text-neutral-900 dark:text-neutral-100 flex flex-col">
      <DashboardHeader
        userName={session.user?.name || "Admin"}
        userEmail={session.user?.email || ""}
      />
      
      <main className="flex-1">
        <DashboardTabs />
      </main>
    </div>
  );
}
