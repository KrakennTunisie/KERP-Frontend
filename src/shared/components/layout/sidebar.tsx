"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import { NAVIGATION_ITEMS } from "@/shared/constants/navigation";

export function Sidebar() {
  const pathname = usePathname();
  const [openMenus, setOpenMenus] = useState<string[]>([]);

  const toggleMenu = (title: string) => {
    setOpenMenus((prev) =>
      prev.includes(title) ? prev.filter((t) => t !== title) : [...prev, title]
    );
  };

  return (
    <aside className="w-64 bg-slate-900 text-white h-screen flex flex-col border-r border-slate-800">
      <div className="p-6 text-xl font-bold border-b border-slate-800">
        KERP Admin
      </div>

      <nav className="flex-1 overflow-y-auto p-4 space-y-8">
        {NAVIGATION_ITEMS.map((section) => (
          <div key={section.title}>
            <h3 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-4 px-2">
              {section.title}
            </h3>
            
            <ul className="space-y-1">
              {section.items.map((item) => {
                const hasSubMenu = !!item.subMenu;
                const isOpen = openMenus.includes(item.title);
                const isActive = pathname === item.href || item.subMenu?.some(s => s.href === pathname);

                return (
                  <li key={item.title}>
                    {hasSubMenu ? (
                      /* Menu avec Sous-menus */
                      <div>
                        <button
                          onClick={() => toggleMenu(item.title)}
                          className={`w-full flex items-center justify-between p-2 rounded-lg transition-colors ${
                            isActive ? "bg-blue-600 text-white" : "hover:bg-slate-800 text-slate-300"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <item.icon size={20} />
                            <span>{item.title}</span>
                          </div>
                          {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                        </button>
                        
                        {isOpen && (
                          <ul className="mt-1 ml-9 space-y-1 border-l border-slate-700 pl-2">
                            {item.subMenu?.map((sub) => (
                              <li key={sub.href}>
                                <Link
                                  href={sub.href}
                                  className={`block p-2 text-sm rounded-md ${
                                    pathname === sub.href 
                                    ? "text-blue-400 font-medium" 
                                    : "text-slate-400 hover:text-white"
                                  }`}
                                >
                                  {sub.title}
                                </Link>
                              </li>
                            ))}
                          </ul>
                        )}
                      </div>
                    ) : (
                      /* Lien Direct */
                      <Link
                        href={item.href || "#"}
                        className={`flex items-center gap-3 p-2 rounded-lg transition-colors ${
                          pathname === item.href 
                          ? "bg-blue-600 text-white" 
                          : "hover:bg-slate-800 text-slate-300"
                        }`}
                      >
                        <item.icon size={20} />
                        <span>{item.title}</span>
                      </Link>
                    )}
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </nav>
    </aside>
  );
}