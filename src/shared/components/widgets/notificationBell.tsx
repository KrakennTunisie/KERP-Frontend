// components/notifications/notification-bell.tsx
'use client';

import { useNotificationStore } from '@/store/notification-store';
import { Bell } from 'lucide-react';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuPortal, DropdownMenuSeparator, DropdownMenuTrigger } from '../ui/dropdown';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { cn } from '@/shared/utils/cn';
import { formatNotificationShortDate } from '@/shared/utils/formatNotificationShortDate';


export function NotificationBell() {
  const notifications = useNotificationStore((s) => s.notifications);
  const unreadCount = useNotificationStore((s) => s.unreadCount);
  const markAsRead = useNotificationStore((s) => s.markAsRead);
  const markAllAsRead = useNotificationStore((s) => s.markAllAsRead);

  return (
    <DropdownMenu>
    <DropdownMenuTrigger asChild>
        <Button
        variant="ghost"
        size="icon"
        className="relative h-11 w-11 rounded-[20px] hover:bg-gray-50 transition-all"
        >
        <Bell className="h-5 w-5 text-gray-700" />

        {unreadCount > 0 && (
            <Badge className="absolute -top-1 -right-1 h-5 min-w-5 rounded-full bg-red-500 text-white text-[10px] font-bold border-2 border-white px-1">
            {unreadCount > 9 ? "9+" : unreadCount}
            </Badge>
        )}
        </Button>
    </DropdownMenuTrigger>

    <DropdownMenuPortal>
        <DropdownMenuContent
        align="end"
        sideOffset={8}
        className="w-[380px] rounded-[20px] border border-gray-100 bg-white shadow-xl p-2 z-[9999]"
        >
        {/* Header */}
        <div className="flex items-center justify-between px-4 py-3">
            <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-blue-50">
                <Bell className="h-5 w-5 text-blue-600" />
            </div>

            <div>
                <h3 className="text-sm font-black text-gray-900">
                Notifications
                </h3>

                <p className="text-xs text-gray-500 font-semibold">
                {unreadCount} non lue{unreadCount > 1 && "s"}
                </p>
            </div>
            </div>

            {unreadCount > 0 && (
            <button
                onClick={markAllAsRead}
                className="text-xs font-bold text-blue-600 hover:text-blue-700"
            >
                Tout lire
            </button>
            )}
        </div>

        <DropdownMenuSeparator className="bg-gray-100" />

        {notifications.length === 0 ? (
            <div className="py-12 flex flex-col items-center">
            <div className="h-14 w-14 rounded-full bg-gray-100 flex items-center justify-center">
                <Bell className="h-6 w-6 text-gray-400" />
            </div>

            <p className="mt-4 font-bold text-gray-700">
                Aucune notification
            </p>

            <p className="text-xs text-gray-500">
                Vous êtes à jour 🎉
            </p>
            </div>
        ) : (
            <div className="max-h-[170px] overflow-y-auto py-1 space-y-1 scrollbar-thin">
            {notifications.map((n) => (
                <DropdownMenuItem
                key={n.id}
                onClick={() => markAsRead(n.id)}
                className="rounded-[14px] p-2.5 cursor-pointer focus:bg-gray-50 hover:bg-gray-50"
                >
                <div className="flex w-full gap-2.5">
                    {/* Icon */}
                    <div className="mt-0.5 relative shrink-0">
                    <div
                        className={cn(
                        "h-8 w-8 rounded-xl flex items-center justify-center",
                        n.status === "UNREAD"
                            ? "bg-blue-50"
                            : "bg-gray-100"
                        )}
                    >
                        <Bell className="h-3.5 w-3.5 text-blue-600" />
                    </div>

                    {n.status === "UNREAD" && (
                        <span className="absolute -top-0.5 -right-0.5 h-2.5 w-2.5 rounded-full bg-blue-600 border-2 border-white" />
                    )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                    <p
                        className={cn(
                        "text-xs truncate",
                        n.status === "UNREAD"
                            ? "font-black text-gray-900"
                            : "font-bold text-gray-700"
                        )}
                    >
                        {n.title}
                    </p>

                    <p className="mt-0.5 text-[11px] leading-4 text-gray-500 line-clamp-2">
                        {n.message}
                    </p>

                    <p className="mt-1 text-[10px] font-semibold text-gray-400">
                        {formatNotificationShortDate(n.occurredAt)}
                    </p>
                    </div>
                </div>
                </DropdownMenuItem>
            ))}
            </div>
        )}
        </DropdownMenuContent>
    </DropdownMenuPortal>
    </DropdownMenu>
  );
}