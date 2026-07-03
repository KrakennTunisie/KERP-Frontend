"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import PageLoader from "@/shared/components/ui/pageLoader";

export default function RoleGuard({
  children,
  allowedRoles,
}: {
  children: React.ReactNode;
  allowedRoles: string[];
}) {
  const router = useRouter();

  const user = useAuthStore((state) => state.user);
  const loading = useAuthStore((state) => state.loading);

  const hasRole = !!user && allowedRoles.includes(user.role);

  useEffect(() => {
    if (loading) return;

    if (!user || !hasRole) {
      router.replace("/not-authorized");
    }
  }, [loading, user, hasRole, router]);

  if (loading) {
    return <PageLoader />;
  }

  if (!user || !hasRole) {
    // Prevent rendering while the redirect happens
    return <PageLoader />;
  }

  return <>{children}</>;
}