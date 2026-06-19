import { Calendar, Mail, Paperclip } from "lucide-react";
import { Badge } from "./badge";
import { EmailLog, EmailStatus } from "@/features/billing/types/emailLog";
import { formatDateLongWithTime } from "@/shared/utils/formatDate";

type EmailLogItemProps = {
  email: EmailLog;
  getEmailStatusColor: (status: EmailStatus) => string;
  getStatusLabel: (status: EmailStatus) => string;
  onView: ()=>void;
  onSelect: (id: string)=>void;
};

export default function EmailLogItem({
  email,
  getEmailStatusColor,
  getStatusLabel,
  onView,
  onSelect
}: EmailLogItemProps) {
  return (
<div
  onClick={() => {
    onSelect(email.idMailJob);
    onView();
  }}
  className="
    cursor-pointer rounded-xl border border-slate-200 bg-white
    p-3 transition-colors hover:bg-slate-50
  "
>

  {/* HEADER */}
  <div className="flex items-start justify-between gap-3">

    {/* LEFT */}
    <div className="flex min-w-0 gap-2.5">

      <Mail className="mt-0.5 h-4 w-4 shrink-0 text-blue-500" />

      <div className="min-w-0">

        <h4 className="line-clamp-2 text-sm font-semibold leading-snug text-slate-900">
          {email.subject}
        </h4>

        <div className="mt-0.5 flex items-center gap-1.5 text-[11px] text-slate-500">

          <Calendar className="h-3.5 w-3.5" />

          <span>
            {formatDateLongWithTime(email.date)}
          </span>

        </div>

      </div>
    </div>

    {/* STATUS */}
    <Badge className={getEmailStatusColor(email.status)}>
      {getStatusLabel(email.status)}
    </Badge>

  </div>

  {/* ATTACHMENTS */}
  {email.attachments.length > 0 && (
    <div className="mt-2.5 border-t border-slate-100 pt-2.5">

      <div className="mb-1.5 flex items-center gap-1.5 text-[11px] font-medium text-slate-500">
        <Paperclip className="h-3.5 w-3.5" />
        <span>{email.attachments.length} pièce(s)</span>
      </div>

      <div className="flex flex-wrap gap-1.5">

        {email.attachments.map((attachment, index) => (
          <div
            key={`${attachment}-${index}`}
            title={attachment.fileName}
            className="
              inline-flex max-w-full items-center gap-1
              rounded-md border border-slate-200 bg-slate-50
              px-2 py-1 text-[11px] text-slate-600
            "
          >
            <Paperclip className="h-3 w-3 shrink-0 text-slate-400" />

            <span className="max-w-[160px] truncate">
              {attachment.fileName}
            </span>
          </div>
        ))}

      </div>
    </div>
  )}
</div>
  );
}