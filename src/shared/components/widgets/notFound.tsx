type NotFoundProps = {
  resource?: string; // ex: "client", "facture"
  message?: string;
  actionLabel?: string;
  onAction?: () => void;
};

export const NotFound = ({
  resource = "Ressource",
  message,
  actionLabel,
  onAction,
}: NotFoundProps) => {
  return (
    <div className="flex flex-col items-center justify-center p-10 text-center">
      <div className="text-5xl mb-4">🔍</div>

      <h2 className="text-lg font-semibold text-slate-700">
        {resource} introuvable
      </h2>

      <p className="text-sm text-slate-500 mt-1">
        {message || `Le ${resource.toLowerCase()} demandé n'existe pas ou a été supprimé.`}
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