export default function Card({
  children,
  className = "",
}: {
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={`rounded-lg border border-gray-100 bg-white p-4 shadow-sm ${className}`}
    >
      {children}
    </div>
  );
}