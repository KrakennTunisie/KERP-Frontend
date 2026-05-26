import { Separator } from "./separator";

type InfoGridProps = {
  children: React.ReactNode;
};

export default function InfoGrid({ children }: InfoGridProps) {
  return (
    <>
      <div className="grid grid-cols-2 gap-4">
        {children}
      </div>

      <Separator />
    </>
  );
}