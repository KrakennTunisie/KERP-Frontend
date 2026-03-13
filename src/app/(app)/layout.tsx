"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { NAVIGATION_ITEMS } from "@/shared/constants/navigation";
import { useMemo, useState } from "react";
import { Navbar } from "@/shared/components/layout/navbar";
import AppToaster from "@/shared/components/ui/appToaster";


export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  const isActive = (href: string) => {
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/") || pathname.startsWith(href);
  };

  const isMenuActive = (subMenu?: Array<{ href: string }>) => {
    if (!subMenu) return false;
    return subMenu.some((item) => isActive(item.href));
  };

  const toggleMenu = (menuTitle: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [menuTitle]: !prev[menuTitle],
    }));
  };

  // Keep menus expanded if current route belongs to them (even after refresh)
  const computedExpandedMenus = useMemo(() => {
    const next = { ...expandedMenus };
    NAVIGATION_ITEMS.forEach((section) => {
      section.items.forEach((item) => {
        if (item.subMenu?.length) {
          const shouldBeOpen = isMenuActive(item.subMenu);
          if (shouldBeOpen && next[item.title] === undefined) {
            next[item.title] = true;
          }
        }
      });
    });
    return next;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, expandedMenus]);

  return (
    <div
      className="flex flex-col h-screen bg-gray-50/50"
      style={{ fontFamily: "Inter, sans-serif" }}
    >
      {/* Navbar */}
      <Navbar />

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-80 bg-white border-r border-gray-100 flex flex-col p-8 overflow-y-auto">
          {/* Navigation */}
          <nav className="flex-1">
            <div className="space-y-8">
              {NAVIGATION_ITEMS.map((section) => (
                <div key={section.title}>
                  {/* Section Title */}
                  <div className="px-2 mb-3">
                    <h2 className="text-[10px] font-black text-gray-400 uppercase tracking-widest">
                      {section.title}
                    </h2>
                  </div>

                  {/* Section Items */}
                  <div className="space-y-1">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const hasSubMenu = !!item.subMenu?.length;
                      const isExpanded =
                        computedExpandedMenus[item.title] ??
                        (hasSubMenu ? isMenuActive(item.subMenu) : false);

                      const active = item.href ? isActive(item.href) : false;

                      if (hasSubMenu) {
                        return (
                          <div key={item.title}>
                            {/* Parent Menu Item */}
                            <button
                              type="button"
                              onClick={() => toggleMenu(item.title)}
                              className="w-full flex items-center gap-4 px-5 py-4 rounded-[20px] transition-all duration-300 text-gray-500 hover:text-gray-900 hover:bg-gray-50 font-bold group"
                            >
                              <Icon className="w-5 h-5 text-gray-500 group-hover:text-gray-900" />
                              <span className="text-sm font-bold flex-1 text-left">
                                {item.title}
                              </span>
                              <ChevronDown
                                className={`w-4 h-4 transition-transform duration-200 ${
                                  isExpanded ? "rotate-180" : ""
                                }`}
                              />
                            </button>

                            {/* SubMenu Items */}
                            {isExpanded && (
                              <div className="ml-[52px] mt-1 space-y-1">
                                {item.subMenu!.map((subItem) => {
                                  const subActive = isActive(subItem.href);
                                  return (
                                    <Link
                                      key={subItem.href}
                                      href={subItem.href}
                                      className={`flex items-center px-5 py-3 rounded-[16px] transition-all duration-300 ${
                                        subActive
                                          ? "bg-gray-100 text-gray-900 font-bold"
                                          : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 font-semibold"
                                      }`}
                                    >
                                      <span className="text-sm">{subItem.title}</span>
                                      {subActive && (
                                        <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
                                      )}
                                    </Link>
                                  );
                                })}
                              </div>
                            )}
                          </div>
                        );
                      }

                      // Regular Menu Item (no submenu)
                      return (
                        <Link
                          key={item.href}
                          href={item.href!}
                          className={`flex items-center gap-4 px-5 py-4 rounded-[20px] transition-all duration-300 ${
                            active
                              ? "bg-gray-900 text-white shadow-2xl shadow-gray-200"
                              : "text-gray-500 hover:text-gray-900 hover:bg-gray-50 font-bold"
                          }`}
                        >
                          <Icon className={`w-5 h-5 ${active ? "text-white" : "text-gray-500"}`} />
                          <span className="text-sm font-bold">{item.title}</span>
                          {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />}
                        </Link>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          </nav>

          {/* User Profile */}
          <div className="pt-8 border-t border-gray-100">
            <div className="p-5 bg-gray-50 rounded-[24px] flex items-center gap-4 border border-gray-100 group cursor-pointer hover:bg-white hover:shadow-xl transition-all duration-300">
              <div className="w-12 h-12 bg-gray-900 rounded-2xl flex items-center justify-center text-white text-sm font-black shadow-lg">
                JD
              </div>
              <div className="flex-1 overflow-hidden">
                <p className="text-sm font-black text-gray-900 truncate">Jean Dupont</p>
                <p className="text-[10px] font-black text-gray-600 uppercase truncate">
                  Dir. Financier
                </p>
              </div>
            </div>
          </div>
        </aside>

        {/* Main Content */}
        <div className="flex-1 flex flex-col overflow-hidden">
          <main className="flex-1 overflow-y-auto">
            {children}
            <AppToaster/>
            </main>
        </div>
      </div>
    </div>
  );
}