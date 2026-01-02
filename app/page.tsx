"use client";

import { useRouter } from "next/navigation";
import { AppSidebar } from "@/components/sidebar";
import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";

export default function Home() {
  const router = useRouter();

  return (
    <>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
        </header>
        <main className="flex flex-1 flex-col gap-4 p-4">
          <div className="flex items-center justify-center h-full">
            <div className="flex gap-4">
              <button
                onClick={() => router.push("/auth/sign-up")}
                className="bg-primary text-primary-foreground font-medium px-6 py-2 rounded-md hover:bg-primary/90">
                Sign Up
              </button>
              <button
                onClick={() => router.push("/auth/sign-in")}
                className="border border-input bg-background text-foreground font-medium px-6 py-2 rounded-md hover:bg-accent">
                Sign In
              </button>
            </div>
          </div>
        </main>
      </SidebarInset>
    </>
  );
}