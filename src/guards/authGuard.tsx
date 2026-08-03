"use client";

import PageLoader from "@/shared/components/ui/pageLoader";
import { useAuthStore } from "@/store/authStore";
import { useRouter }
from "next/navigation";

import {
useEffect,
useRef,
} from "react";


interface AuthGuardProps {
children: React.ReactNode;
}

export default function AuthGuard({
children,
}: AuthGuardProps) {

const router = useRouter();

const {
isLoading,
isAuthenticated,
loadUser,
} = useAuthStore();

const initialized = useRef(false);

useEffect(() => {

// Prevent multiple initialization
if (initialized.current) {
  return;
}

initialized.current = true;

loadUser();

}, [loadUser]);

useEffect(() => {

if (
  !isLoading &&
  !isAuthenticated
) {
  router.replace("/auth/login");
}


}, [
isLoading,
isAuthenticated,
router,
]);

// While checking the HttpOnly cookie
if (isLoading) {
return ( <PageLoader
     label="Chargement..."
   />
);
}

// Authentication failed
if (!isAuthenticated) {
return null;
}

// Authentication succeeded
return children;
}
