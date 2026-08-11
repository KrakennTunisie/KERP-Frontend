import { ChevronLeft, ChevronRight, Loader2, Mail, MailX, RefreshCw, Send } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Badge } from "./badge";
import EmailLogItem from "./emailLogItem";
import { useEffect, useState } from "react";
import { MailingAPI } from "@/features/billing/api/partners-api";
import { appToast } from "@/shared/lib/toast";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { EmailLog, EmailStatus } from "@/features/billing/types/emailLog";


type EmailHistoryCardProps = {
  email: string;
  onSendEmail: () => void;
  getEmailStatusColor: (status: EmailStatus) => string;
  getStatusLabel: (status: EmailStatus) => string;
  onShowDetails: () => void;
  onSelectEmail: (id: string) => void;
  title?: string;
  description?: string;
};

export default function EmailHistoryCard({
  email,
  onSendEmail,
  getEmailStatusColor,
  getStatusLabel,
  onShowDetails,
  onSelectEmail,
  title = "Historique des emails",
  description = "Emails envoyés au partenaire et leurs pièces jointes",
}: EmailHistoryCardProps) {
  const [emails, setEmails] = useState<EmailLog[] | []>([])
  const [loadingEmails, setLoadingEmails] = useState(false)
  const [totalPages, setTotalPages] = useState(1);
  const [totalElements, setTotalElements] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);

  const fetchEmailLogs = async () => {
    try {
      setLoadingEmails(true)
      const response = await MailingAPI.getEmailsByPartner(email, {
        page: currentPage - 1
      })

      setEmails(response.content)
      setTotalElements(response.totalElements)
      setTotalPages(response.totalPages)

    } catch (error) {
      appToast.error("Erreur de fetch emails", getApiErrorMessage(error))
    }
    finally {
      setLoadingEmails(false)
    }
  }

  useEffect(() => {
    if (!email) return;
    fetchEmailLogs();
  }, [email, currentPage])

  const canGoPrevious = currentPage > 1;
  const canGoNext = currentPage < totalPages;
  return (
    <Card className="border-slate-200 shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle className="flex items-center gap-2 text-base font-black text-slate-900">
              <Mail className="w-4 h-4 text-blue-600" />
              {title}
            </CardTitle>

            <CardDescription className="text-xs mt-0.5">
              {description}
            </CardDescription>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            {/* Bouton Envoyer un mail */}
            <button
              type="button"
              onClick={onSendEmail}
              disabled={!email}
              title={!email ? "Aucune adresse email disponible" : "Envoyer un mail"}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-100 hover:border-blue-200 transition cursor-pointer disabled:cursor-not-allowed disabled:opacity-50 disabled:bg-slate-50 disabled:text-slate-400 disabled:border-slate-200"
            >
              {!email ? (
                <MailX className="w-3.5 h-3.5" />
              ) : (
                <Send className="w-3.5 h-3.5" />
              )}
              Envoyer un mail
            </button>

            {/* Bouton Refresh */}
            <button
              type="button"
              onClick={fetchEmailLogs} // <-- tu passes ta fonction pour rafraîchir
              className="inline-flex items-center justify-center w-8 h-8 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-100 hover:border-blue-200 transition cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
            </button>

            <Badge variant="secondary" className="font-bold">
              {totalElements} emails
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="max-h-[560px] overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          {
            loadingEmails ?
              (
                <div className="flex flex-col items-center justify-center gap-3 text-slate-400">
                  <Loader2 className="h-5 w-5 animate-spin text-blue-600" />
                  <p className="text-sm font-semibold">
                    Chargement des données...
                  </p>
                </div>
              )
              : emails.length > 0 ? (
                emails.map((email) => (
                  <EmailLogItem
                    key={email.idMailJob}
                    email={email}
                    getEmailStatusColor={getEmailStatusColor}
                    getStatusLabel={getStatusLabel}
                    onView={onShowDetails}
                    onSelect={onSelectEmail}
                  />
                ))
              ) : (
                <div className="rounded-xl border border-dashed border-slate-200 bg-slate-50/60 p-6 text-center">
                  <p className="text-sm font-bold text-slate-500">
                    Aucun email envoyé
                  </p>
                  <p className="text-xs text-slate-400 mt-1">
                    L’historique des emails apparaîtra ici.
                  </p>
                </div>
              )}

          {totalPages > 0 && totalElements > 0 && (
            <div className="flex flex-col gap-2 border-t border-slate-100 bg-white px-3 py-2 sm:flex-row sm:items-center sm:justify-between">
              <div className="flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => setCurrentPage(currentPage - 1)}
                  disabled={!canGoNext || loadingEmails}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronLeft className="h-3.5 w-3.5" />
                </button>

                <div className="flex items-center gap-1">
                  {Array.from({ length: totalPages }).map((_, index) => {
                    const page = index + 1;

                    return (
                      <button
                        key={page}
                        type="button"
                        onClick={() => setCurrentPage(page)}
                        disabled={loadingEmails}
                        className={`h-7 min-w-7 rounded-md px-2 text-[11px] font-semibold transition disabled:cursor-not-allowed disabled:opacity-50 ${currentPage === page
                            ? "bg-blue-600 text-white"
                            : "border border-slate-200 bg-white text-slate-600 hover:bg-slate-50"
                          }`}
                      >
                        {page}
                      </button>
                    );
                  })}
                </div>

                <button
                  type="button"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={!canGoPrevious || loadingEmails}
                  className="inline-flex h-7 w-7 items-center justify-center rounded-md border border-slate-200 bg-white text-slate-600 transition hover:bg-slate-50 disabled:cursor-not-allowed disabled:opacity-40"
                >
                  <ChevronRight className="h-3.5 w-3.5" />
                </button>
              </div>

              {totalElements > 0 && (
                <p className="text-[11px] font-medium text-slate-500">
                  {totalElements} {"email"}
                  {totalElements > 1 ? "s" : ""}
                </p>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}