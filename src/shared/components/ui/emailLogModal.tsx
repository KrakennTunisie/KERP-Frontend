"use client";

import {  EmailLogDetails, getEmailStatusColor, getStatusLabel } from "@/features/billing/types/emailLog";
import { Modal } from "./modal";
import { useEffect, useState } from "react";
import { appToast } from "@/shared/lib/toast";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";
import { MailingAPI } from "@/features/billing/api/partners-api";
import { Calendar, Mail, Paperclip } from "lucide-react";
import { formatDateLongWithTime } from "@/shared/utils/formatDate";


type MailDetailsModalProps = {
  open: boolean;
  mailId: string| null;
  onClose: () => void;
};

export function MailDetailsModal({ open, mailId, onClose }: MailDetailsModalProps) {

  const [mail, setMail]=useState<EmailLogDetails| null>(null)
  const [loadingEmail, setLoadingEmail]= useState(false)
  
  const fetchMailDetails = async ()=>{
      if (!mailId) return null;

    try {
        setLoadingEmail(true)
        const mailResponse = await MailingAPI.getEmailsById(mailId)
        setMail(mailResponse)
    } catch (error) {
        appToast.error("Erreur fetch de mail", getApiErrorMessage(error))
    }
    finally{
        setLoadingEmail(false)
    }
  }


  useEffect(()=>{
    if(!mailId) return;
    fetchMailDetails()
  },[mailId])


  return (
<Modal open={open} title={mail ? `Mail: ${mail.subject}` : "Mail Details"} onClose={onClose}>
  <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
    {loadingEmail ? (
      <p className="text-gray-400 text-center py-10 animate-pulse">Loading...</p>
    ) : !mail ? (
      <p className="text-gray-400 text-center py-10">No mail details available.</p>
    ) : (
      <>
        {/* Header Info */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 text-sm text-gray-500">
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1">
              <Calendar className="h-4 w-4 text-gray-400" />
              <span>{formatDateLongWithTime(mail.date)}</span>
            </div>

            <div className="flex items-center gap-1">
              <Mail className="h-4 w-4 text-gray-400" />
              <span className="font-medium text-gray-600">
                {mail.to}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-1">
            <strong
              className={`ml-1 px-2 py-0.5 rounded-full text-xs font-semibold ${getEmailStatusColor(mail.status)}`}
            >
              {getStatusLabel(mail.status)}
            </strong>
          </div>
        </div>

        {/* Subject */}
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
          <p className="font-semibold text-gray-700 mb-1 border-b border-gray-200 pb-1">Sujet</p>
          <p className="text-gray-900">{mail.subject}</p>
        </div>

        {/* Body */}
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
          <div className="whitespace-pre-wrap text-gray-900">{mail.body || "—"}</div>
        </div>

        {/* Attachments */}
        {mail.attachments.length > 0 && (
        <div className="p-4 bg-white rounded-lg shadow-sm border border-gray-100">
          <p className="font-semibold text-gray-700 mb-2 border-b border-gray-200 pb-1">Attachements</p>
          
            <div className="flex flex-wrap gap-2 mt-2">
              {mail.attachments.map((att) => (
                <a
                  key={att.id}
                  href={att.filePath}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-1 px-3 py-1 cursor-pointer rounded-md bg-blue-50 text-blue-600 text-sm hover:bg-blue-100 transition"
                  title={att.fileName}
                >
                  <Paperclip className="h-3 w-3 text-blue-400" />
                  {att.fileName}
                </a>
              ))}
            </div>
        </div>
        )}
      </>
    )}
  </div>

  {/* Optional Footer */}
  <div className="mt-4 flex justify-end gap-3">
    {/* Example buttons */}
    {/* <Button onClick={onClose}>Close</Button> */}
  </div>
</Modal>
  );
}