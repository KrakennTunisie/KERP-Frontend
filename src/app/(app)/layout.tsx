"use client";
import { Navbar } from "@/shared/components/layout/navbar";
import AppToaster from "@/shared/components/ui/appToaster";
import { Sidebar } from "@/shared/components/layout/sidebar";


export default function Layout({ children }: { children: React.ReactNode }) {
 
  return (
    <div
      className="flex h-screen min-h-0 flex-col overflow-hidden bg-gray-50/50"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Navbar */}
      <Navbar />

      <div className="flex min-h-0 flex-1 overflow-hidden">

        <Sidebar/>

        {/* Main Content */}
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <main className="min-h-0 flex-1 overflow-y-auto">
            {children}
            <AppToaster/>
            </main>
        </div>
      </div>
    </div>
  );
}