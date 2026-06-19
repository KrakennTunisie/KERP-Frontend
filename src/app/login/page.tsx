// src/app/login/page.tsx
"use client";

import LoginPage from "@/features/auth/login";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Login() {
 const { data: session, status } = useSession();
 const router = useRouter();
  useEffect(() => {
    if (status === "authenticated") {
      localStorage.setItem("access_token", session.accessToken!);
      router.push("/dashboard");
    }
  }, [status, router]);

  return (
    <LoginPage/>
  );
}