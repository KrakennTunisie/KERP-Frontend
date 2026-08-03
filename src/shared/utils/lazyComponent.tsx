import dynamic from "next/dynamic";
import type { ComponentType } from "react";
import PageLoader from "../components/ui/pageLoader";

export default function lazyComponent<P>(
  importer: () => Promise<{
    default: ComponentType<P>;
  }>,
  label = "Chargement..."
) {
  return dynamic<P>(importer, {
    loading: () => <PageLoader label={label} />,
  });
}