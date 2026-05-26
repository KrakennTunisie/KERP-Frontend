import { Calendar, Mail, Paperclip } from "lucide-react";
import { Badge } from "./badge";

type EmailLogItemProps = {
  email: EmailLog;
  getEmailStatusColor: (status: string) => string;
  getStatusLabel: (status: string) => string;
};

export default function EmailLogItem({
  email,
  getEmailStatusColor,
  getStatusLabel,
}: EmailLogItemProps) {
  return (
    <div className="rounded-xl border border-slate-200 bg-white p-4 transition-colors hover:bg-slate-50">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <div className="flex items-start gap-2">
            <Mail className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />

            <div className="min-w-0">
              <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900">
                {email.subject}
              </h4>

              <div className="mt-1 flex items-center gap-1.5 text-xs text-slate-500">
                <Calendar className="h-3.5 w-3.5" />
                <span>{email.date}</span>
              </div>
            </div>
          </div>
        </div>

        <Badge className={getEmailStatusColor(email.status)}>
          {getStatusLabel(email.status)}
        </Badge>
      </div>

      {email.attachments.length > 0 && (
        <div className="mt-3 border-t border-slate-100 pt-3">
          <div className="mb-2 flex items-center gap-1.5 text-xs font-medium text-slate-500">
            <Paperclip className="h-3.5 w-3.5" />
            <span>Pièces jointes ({email.attachments.length})</span>
          </div>

          <div className="flex flex-wrap gap-2">
            {email.attachments.map((attachment, index) => (
              <div
                key={`${attachment}-${index}`}
                title={attachment}
                className="inline-flex max-w-full items-center gap-1.5 rounded-lg border border-slate-200 bg-slate-50 px-2.5 py-1.5 text-xs text-slate-600"
              >
                <Paperclip className="h-3 w-3 shrink-0 text-slate-400" />
                <span className="max-w-[180px] truncate">
                  {attachment}
                </span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}