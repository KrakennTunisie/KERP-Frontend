import { Bell, User, LogOut, Building2 } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuPortal,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/shared/components/ui/dropdown';
import { Avatar, AvatarFallback } from '@/shared/components/ui/avatar';
import { Badge } from '@/shared/components/ui/badge';

export function Navbar() {
  const notificationCount = 3;

  return (
    <header className="h-20 bg-white border-b border-gray-100 flex items-center justify-between px-8">
      {/* Logo */}
      <div className="flex items-center gap-4">
        <div className="w-12 h-12 bg-blue-600 rounded-[20px] flex items-center justify-center shadow-xl shadow-blue-100">
          <Building2 className="w-6 h-6 text-white" />
        </div>
        <div>
          <h1 className="text-xl font-black text-gray-900 tracking-tighter">KERP</h1>
          <p className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Système ERP</p>
        </div>
      </div>

      {/* Right Side Actions */}
      <div className="flex items-center gap-4">
        {/* Notifications Bell */}
        <button className="relative p-3 hover:bg-gray-50 rounded-[16px] transition-all duration-200 group">
          <Bell className="w-5 h-5 text-gray-500 group-hover:text-gray-900" />
          {notificationCount > 0 && (
            <Badge 
              className="absolute -top-1 -right-1 h-5 min-w-5 flex items-center justify-center p-0 px-1.5 bg-blue-600 hover:bg-blue-600 text-white text-[10px] font-black"
            >
              {notificationCount}
            </Badge>
          )}
        </button>

        {/* Profile Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex items-center gap-3 p-2 pr-4 hover:bg-gray-50 rounded-[20px] transition-all duration-200 group">
              <Avatar className="h-10 w-10 border-2 border-gray-100">
                <AvatarFallback className="bg-gray-900 text-white text-sm font-black">
                  JD
                </AvatarFallback>
              </Avatar>

              <div className="text-left">
                <p className="text-sm font-black text-gray-900 leading-tight">
                  Jean Dupont
                </p>
                <p className="text-xs text-gray-500 font-semibold leading-tight">
                  Dir. Financier
                </p>
              </div>
            </button>
          </DropdownMenuTrigger>

          <DropdownMenuPortal>
            <DropdownMenuContent
              align="end"
              sideOffset={8}
              className="w-56 rounded-[20px] border-gray-100 shadow-xl p-2 z-[9999] bg-white"
            >
              <DropdownMenuLabel className="px-4 py-3">
                <div className="flex flex-col">
                  <p className="text-sm font-black text-gray-900">Jean Dupont</p>
                  <p className="text-xs text-gray-500 font-semibold mt-0.5">
                    jean.dupont@company.com
                  </p>
                </div>
              </DropdownMenuLabel>

              <DropdownMenuSeparator className="bg-gray-100" />

              <DropdownMenuItem className="px-4 py-3 rounded-[16px] cursor-pointer focus:bg-gray-50">
                <User className="mr-3 h-4 w-4 text-gray-500" />
                <span className="font-bold text-sm text-gray-700">Mon Profil</span>
              </DropdownMenuItem>

              <DropdownMenuItem className="px-4 py-3 rounded-[16px] cursor-pointer focus:bg-red-50 text-red-600">
                <LogOut className="mr-3 h-4 w-4" />
                <span className="font-bold text-sm">Déconnexion</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenuPortal>
        </DropdownMenu>
      </div>
    </header>
  );
}