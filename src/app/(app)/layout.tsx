"use client";
import { Navbar } from "@/shared/components/layout/navbar";
import AppToaster from "@/shared/components/ui/appToaster";
import { Sidebar } from "@/shared/components/layout/sidebar";
import { AuthProvider } from "@/providers/authProvider";
import AuthGuard from "@/guards/authGuard";
import RoleGuard from "@/guards/roleGuard";


export default function Layout({ children }: { children: React.ReactNode }) {
 
  return (
    <AuthProvider>
    { /*   <AuthGuard>  */}
    {/* <RoleGuard allowedRoles={['ADMIN']}> */}
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
          <main className="min-h-0 bg-white flex-1 overflow-y-auto">
            {children}
            <AppToaster/>
            </main>
        </div>
      </div>
    </div>
    {/* </RoleGuard> */}
    {/*</AuthGuard>*/}
    </AuthProvider>
  );
}