// app/unauthorized/page.tsx
"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { ShieldAlert, ArrowLeft, LayoutDashboard, Mail } from "lucide-react";
import { Button } from "@/shared/components/ui/button";

export default function UnauthorizedPage() {
  const router = useRouter();

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background px-4">
      {/* Decorative background */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-destructive/5 blur-3xl" />
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              "linear-gradient(to right, currentColor 1px, transparent 1px), linear-gradient(to bottom, currentColor 1px, transparent 1px)",
            backgroundSize: "48px 48px",
          }}
        />
      </div>

      <div className="relative w-full max-w-md">
        <div className="rounded-2xl border border-border/60 bg-card/80 p-8 shadow-xl backdrop-blur-sm sm:p-10">
          {/* Icon */}
          <div className="mb-6 flex justify-center">
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl bg-destructive/10 ring-1 ring-destructive/20">
              <ShieldAlert className="h-8 w-8 text-destructive" strokeWidth={1.75} />
            </div>
          </div>

          {/* Status code */}
          <p className="mb-2 text-center text-xs font-medium uppercase tracking-widest text-muted-foreground">
            Erreur 403
          </p>

          {/* Title */}
          <h1 className="mb-3 text-center text-2xl font-semibold tracking-tight text-foreground">
            Accès refusé
          </h1>

          {/* Description */}
          <p className="mx-auto mb-8 max-w-sm text-center text-sm leading-relaxed text-muted-foreground">
            {"Vous n'avez pas les autorisations nécessaires pour accéder à"}
            {"cette page. Si vous pensez qu'il s'agit d'une erreur, contactez"}
            {"votre administrateur système."}
          </p>

          {/* Actions */}
          <div className="flex flex-col gap-2.5 sm:flex-row">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => router.back()}
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Retour
            </Button>

            <Button asChild className="flex-1">
              <Link href="/dashboard/billing">
                <LayoutDashboard className="mr-2 h-4 w-4" />
                Tableau de bord
              </Link>
            </Button>
          </div>
        </div>
      </div>
      </div>
  );
}