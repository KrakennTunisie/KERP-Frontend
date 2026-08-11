// components/DocumentViewer.tsx
type DocumentViewerProps = {
  fileUrl: string;
  fileType: "pdf" | "image";
};

export function DocumentViewer({ fileUrl, fileType }: DocumentViewerProps) {
  return (
    <div className="h-full flex flex-col bg-white border-l border-slate-100">
      <div className="sticky top-0 z-10 bg-white border-b border-slate-100 px-4 py-3 flex items-center gap-2">
        <svg className="w-4 h-4 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-sm font-semibold text-slate-700">Document original</p>
      </div>

      <div className="flex-1 overflow-auto p-4">
        {fileType === "pdf" ? (
          <iframe
            src={fileUrl}
            title="Facture fournisseur"
            className="w-full h-full min-h-[80vh] rounded-xl border border-slate-200 bg-white"
          />
        ) : (
          <div className="w-full h-160 overflow-hidden flex items-center justify-center shrink-0">
            <img
              src={fileUrl}
              alt="Facture fournisseur"
              className="w-full h-full  bg-white object-contain"
            />
          </div>
        )}
      </div>
    </div>
  );
}