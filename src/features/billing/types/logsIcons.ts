import {
  Plus,
  Pencil,
  Trash2,
  RefreshCw,
  CreditCard,
  Wallet,
  XCircle,
  Paperclip,
  ShieldCheck,
  PenLine,
  CheckCircle,
  AlertCircle,
  Send,
  FileCheck,
  FileX,
  FileText,
  TrendingUp,
  RotateCcw,
  BadgeCheck,
  Activity,
} from 'lucide-react';

export const getActivityIcon = (type: string) => {
  switch (type) {
    case 'CREATED':               return Plus;
    case 'UPDATED':               return Pencil;
    case 'DELETED':               return Trash2;
    case 'STATUS_CHANGED':        return RefreshCw;
    case 'PAYMENT_REGISTERED':    return CreditCard;
    case 'PAYMENT_METHOD_UPDATED':return Wallet;
    case 'CANCELLED':             return XCircle;
    case 'DOCUMENT_ATTACHED':     return Paperclip;
    case 'DOCUMENT_VALIDATED':    return ShieldCheck;
    case 'SIGNATURE_REQUESTED':   return PenLine;
    case 'SIGNATURE_SUCCEEDED':   return CheckCircle;
    case 'SIGNATURE_FAILED':      return AlertCircle;
    case 'TTN_SUBMISSION_REQUESTED': return Send;
    case 'TTN_SUBMITTED':         return FileText;
    case 'TTN_ACCEPTED':          return FileCheck;
    case 'TTN_REJECTED':          return FileX;
    case 'FX_RATE_APPLIED':       return TrendingUp;
    case 'REFUND_REQUESTED':      return RotateCcw;
    case 'REFUND_COMPLETED':      return BadgeCheck;
    default:                      return Activity;
  }
};