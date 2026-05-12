type NotAuthorizedProps = {
  resource?: string; // ex: "facture", "client"
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export const NotAuthorized = ({
  resource = "ressource",
  message,
  actionLabel,
  onAction,
}: NotAuthorizedProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center">
      <div className="text-5xl mb-4">⛔</div>

      <h2 className="text-lg font-semibold text-slate-700">
        Accès refusé
      </h2>

      <p className="text-sm text-slate-500 mt-1">
        {message ||
          `Vous n'avez pas l'autorisation d'accéder à ce${resource ? " " + resource : "tte ressource"}.`}
      </p>

      {actionLabel && onAction && (
        <button
          onClick={onAction}
          className="mt-5 px-4 py-2 rounded-lg bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 transition"
        >
          {actionLabel}
        </button>
      )}
    </div>
  );
};