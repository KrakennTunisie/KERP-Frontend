"use client";

import ResetPasswordPage from "@/features/auth/components/reset-password/resetPassword";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Login() {
 const router = useRouter();
/*   useEffect(() => {
    if (status === "authenticated") {
      localStorage.setItem("access_token", session.accessToken!);
      router.push("/dashboard");
    }
  }, [status, router]); */

  return (
    <ResetPasswordPage/>
  );
}