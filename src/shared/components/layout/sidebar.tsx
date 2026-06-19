"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown, ChevronRight } from "lucide-react";
import { NAVIGATION_ITEMS } from "@/shared/constants/navigation";

export function Sidebar() {
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
<aside className="w-72 bg-white border-r border-gray-100 flex flex-col p-3 overflow-y-auto">
  {/* NAVIGATION */}
  <nav className="flex-1">
    <div className="space-y-6">

      {NAVIGATION_ITEMS.map((section) => (
        <div key={section.title}>

          {/* SECTION TITLE */}
          <div className="px-2 mb-2">
            <h2 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
              {section.title}
            </h2>
          </div>

          {/* ITEMS */}
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

                    <button
                      type="button"
                      onClick={() => toggleMenu(item.title)}
                      className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl transition text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                    >
                      <Icon className="w-4 h-4" />

                      <span className="text-xs font-semibold flex-1 text-left">
                        {item.title}
                      </span>

                      <ChevronDown
                        className={`w-3.5 h-3.5 transition-transform ${
                          isExpanded ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {/* SUBMENU */}
                    {isExpanded && (
                      <div className="ml-8 mt-1 space-y-1">
                        {item.subMenu!.map((subItem) => {
                          const subActive = isActive(subItem.href);

                          return (
                            <Link
                              key={subItem.href}
                              href={subItem.href!}
                              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                                subActive
                                  ? "bg-gray-100 text-gray-900 font-semibold"
                                  : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                              }`}
                            >
                              <span className="text-xs font-semibold">{subItem.title}</span>

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

              return (
                <Link
                  key={item.href}
                  href={item.href!}
                  className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition ${
                    active
                      ? "bg-gray-100 text-gray-900 font-semibold"
                      : "text-gray-500 hover:text-gray-900 hover:bg-gray-50"
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span className="text-xs font-semibold">{item.title}</span>

                  {active && (
                    <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500" />
                  )}
                </Link>
              );
            })}
          </div>

        </div>
      ))}

    </div>
  </nav>

  {/* PROFILE */}
  <div className="pt-5 border-t border-gray-100">
    <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-3 border border-gray-100 hover:bg-white transition">

      <div className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center text-white text-xs font-bold">
        JD
      </div>

      <div className="flex-1 overflow-hidden">
        <p className="text-xs font-semibold text-gray-900 truncate">
          Jean Dupont
        </p>
        <p className="text-[10px] text-gray-500 uppercase truncate">
          Dir. Financier
        </p>
      </div>

    </div>
  </div>
</aside>
  );
}