import { auth } from "@clerk/nextjs/server";
import { redirect } from "next/navigation";
import { Navbar } from "@/frontend/components/layout/Navbar";
import { ToastProvider } from "@/frontend/contexts/ToastContext";
import ToastContainer from "@/frontend/components/ui/Toast";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { userId } = await auth();
  if (!userId) redirect("/sign-in");

  return (
    <ToastProvider>
      <div className="min-h-screen bg-zinc-950">
        <Navbar />
        <main className="pt-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {children}
        </main>
        <ToastContainer />
      </div>
    </ToastProvider>
  );
}
