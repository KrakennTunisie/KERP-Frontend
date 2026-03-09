import dynamic from "next/dynamic";
import PageLoader from "../components/ui/pageLoader";

export default function lazyComponent<T>(
  importer: () => Promise<T>,
  label = "Chargement..."
) {
  return dynamic(importer as any, {
    loading: () => <PageLoader label={label}/>
  });
}