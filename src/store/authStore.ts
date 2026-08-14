// src/stores/auth.store.ts

import { AuthUser } from "@/features/auth/types/authUser";
import { LoginRequest } from "@/features/auth/types/loginRequest";
import { create } from "zustand";


interface AuthState {
  user: AuthUser | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  login: (
    credentials: LoginRequest
  ) => Promise<void>;

  logout: () => Promise<void>;

  loadUser: () => Promise<void>;
}

export const useAuthStore =
  create<AuthState>((set) => ({

    user: null,

    isAuthenticated: false,

    isLoading: true,

    login: async (credentials) => {

      set({
        isLoading: true,
      });

      try {

        const response =
          await fetch("/api/auth/login", {
            method: "POST",
            headers: {
              "Content-Type":
                "application/json",
            },
            body: JSON.stringify(
              credentials
            ),
          });

        if (!response.ok) {
          const errorBody = await response.text();
         console.error("Keycloak error:", response.status, errorBody);
          throw new Error(
            "Authentication failed"
          );
        }

        const data =
          await response.json();

        set({
          user: data.user,
          isAuthenticated: true,
        });

      } finally {

        set({
          isLoading: false,
        });

      }
    },

    logout: async () => {
      try {
        await fetch(
          "/api/auth/logout",
          {
            method: "POST",
          }
        );
      }
      finally{

      set({
        user: null,
        isAuthenticated: false,
      });
      }


    },

    loadUser: async () => {

      try {

        set({
          isLoading: true,
        });

        const response =
          await fetch(
            "/api/auth/me",
            {
              cache: "no-store",
            }
          );

        if (!response.ok) {
          set({
            user: null,
            isAuthenticated: false,
          });

          return;
        }

        const data =
          await response.json();

        set({
          user: data.user,
          isAuthenticated: true,
        });

      } catch {

        set({
          user: null,
          isAuthenticated: false,
        });

      } finally {

        set({
          isLoading: false,
        });

      }
    },
  }));