type AuthStepProps = {
  icon: React.ReactNode;
  title: string;
  description: React.ReactNode;

  error?: string;

  children: React.ReactNode;

  asForm?: boolean;
  onSubmit?: (e: React.FormEvent) => void;

  submitButton?: React.ReactNode;

  secondaryButton?: React.ReactNode;

  footer?: React.ReactNode;
};

export default function AuthStep({
  icon,
  title,
  description,
  error,
  children,
  asForm = false,
  onSubmit,
  submitButton,
  secondaryButton,
  footer,
}: AuthStepProps) {
  const Content = (
    <>
      {children}

      {submitButton}

      {secondaryButton && (
        <div className="mt-3">
          {secondaryButton}
        </div>
      )}
    </>
  );

  return (
    <div className="flex flex-col">
      <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center mb-4">
        {icon}
      </div>

      <h2 className="text-gray-900 text-xl font-medium mb-1">
        {title}
      </h2>

      <p className="text-gray-400 text-sm mb-6 leading-relaxed">
        {description}
      </p>

      {error && (
        <div className="text-xs text-red-500 bg-red-50 border border-red-100 rounded-lg px-3 py-2 mb-4">
          {error}
        </div>
      )}

      {asForm ? (
        <form onSubmit={onSubmit} className="space-y-4">
          {Content}
        </form>
      ) : (
        Content
      )}

      {footer && (
        <div className="mt-6">
          {footer}
        </div>
      )}
    </div>
  );
}