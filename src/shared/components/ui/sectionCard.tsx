import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";

type SectionCardProps = {
  title: string;
  description?: string;
  icon?: React.ElementType;
  iconClassName?: string;
  action?: React.ReactNode;
  children: React.ReactNode;
  contentClassName?: string;
};

export default function SectionCard({
  title,
  description,
  icon: Icon,
  iconClassName = "text-blue-600",
  action,
  children,
  contentClassName = "space-y-3",
}: SectionCardProps) {
  return (
    <Card className="border-slate-200 shadow-sm">

      <CardHeader className="flex items-start justify-between gap-3">

        {/* Left */}
        <div className="min-w-0">

          <CardTitle className="flex items-center gap-2 text-sm font-semibold text-slate-900">
            {Icon && (
              <Icon className={`h-4 w-4 shrink-0 ${iconClassName}`} />
            )}
            <span className="truncate">{title}</span>
          </CardTitle>

          {description && (
            <CardDescription className="mt-0.5 text-xs">
              {description}
            </CardDescription>
          )}

        </div>

        {/* Right action */}
        {action && (
          <div className="shrink-0">
            {action}
          </div>
        )}

      </CardHeader>

      <CardContent className={contentClassName}>
        {children}
      </CardContent>

    </Card>
  );
}