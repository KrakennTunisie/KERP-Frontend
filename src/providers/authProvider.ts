"use client";

import { useAuthStore } from "@/store/authStore";
import { useEffect, useRef } from "react";


interface AuthProviderProps {
children: React.ReactNode;
}

export function AuthProvider({
children,
}: AuthProviderProps) {

const loadUser = useAuthStore(
(state) => state.loadUser
);

const initialized = useRef(false);

useEffect(() => {

// Prevent multiple initialization
// in React Strict Mode
if (initialized.current) {
  return;
}

initialized.current = true;

loadUser();

}, [loadUser]);

return children;
}
