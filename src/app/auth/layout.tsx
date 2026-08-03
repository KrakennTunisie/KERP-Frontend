import AppToaster from "@/shared/components/ui/appToaster";

// src/app/login/layout.tsx
export default function LoginLayout({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-gray-50">
      {children}
      <AppToaster/>
    </div>
  );
}