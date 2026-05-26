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
  contentClassName = "space-y-4",
}: SectionCardProps) {
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader className="flex flex-row items-start justify-between gap-4">
        <div>
          <CardTitle className="flex items-center gap-2 text-base font-black text-slate-900">
            {Icon && <Icon className={`w-4 h-4 ${iconClassName}`} />}
            {title}
          </CardTitle>

          {description && (
            <CardDescription className="text-xs">
              {description}
            </CardDescription>
          )}
        </div>

        {action}
      </CardHeader>

      <CardContent className={contentClassName}>
        {children}
      </CardContent>
    </Card>
  );
}