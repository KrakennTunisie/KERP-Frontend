"use client";

import React from "react";
import Spinner from "./spinner";

type LoadingButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  loading?: boolean;
  loadingText?: string;
};

export default function LoadingButton({
  children,
  loading = false,
  loadingText = "Chargement...",
  className = "",
  disabled,
  ...props
}: LoadingButtonProps) {
  return (
    <button
      {...props}
      disabled={disabled || loading}
      className={className}
    >
      {loading ? <Spinner label={loadingText} /> : children}
    </button>
  );
}