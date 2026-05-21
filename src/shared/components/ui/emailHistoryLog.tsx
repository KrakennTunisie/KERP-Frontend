import { Mail, Send } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./card";
import { Badge } from "./badge";
import EmailLogItem from "./emailLogItem";


type EmailHistoryCardProps = {
  emails: EmailLog[];
  onSendEmail: () => void;
  getEmailStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
  title?: string;
  description?: string;
};

export default function EmailHistoryCard({
  emails,
  onSendEmail,
  getEmailStatusColor,
  getStatusLabel,
  title = "Historique des emails",
  description = "Emails envoyés au partenaire et leurs pièces jointes",
}: EmailHistoryCardProps) {
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
            <button
              type="button"
              onClick={onSendEmail}
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-50 hover:bg-blue-100 text-blue-700 text-xs font-bold border border-blue-100 hover:border-blue-200 transition cursor-pointer"
            >
              <Send className="w-3.5 h-3.5" />
              Envoyer un mail
            </button>

            <Badge variant="secondary" className="font-bold">
              {emails.length} emails
            </Badge>
          </div>
        </div>
      </CardHeader>

      <CardContent>
        <div className="max-h-[560px] overflow-y-auto space-y-3 pr-1 scrollbar-thin scrollbar-thumb-slate-200 scrollbar-track-transparent">
          {emails.length > 0 ? (
            emails.map((email) => (
              <EmailLogItem
                key={email.id}
                email={email}
                getEmailStatusColor={getEmailStatusColor}
                getStatusLabel={getStatusLabel}
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
        </div>
      </CardContent>
    </Card>
  );
}