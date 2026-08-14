"use client";

import { ReactNode, useEffect } from "react";
import { usePathname, useRouter } from "next/navigation";
import { useAuthStore } from "@/store/authStore";
import { getRequiredRoles } from "@/shared/lib/navigation/route-permissions";

interface RoleGuardProps {
  children: ReactNode;
  fallback?: ReactNode; // if omitted, redirects to /unauthorized
}

export function RoleGuard({ children, fallback }: RoleGuardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const userRoles = useAuthStore((s) => s.user?.roles)  ?? [];

  const requiredRoles = getRequiredRoles(pathname);
  const hasAccess =
    requiredRoles.length === 0 || requiredRoles.some((r) => userRoles.includes(r));

  useEffect(() => {
    if (!hasAccess && !fallback) {
      router.replace("/unauthorized");
    }
  }, [hasAccess, fallback, router]);

  if (!hasAccess) {
    return fallback ? <>{fallback}</> : null;
  }

  return <>{children}</>;
}