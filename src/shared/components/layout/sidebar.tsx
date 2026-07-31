"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { NAVIGATION_ITEMS } from "@/shared/constants/navigation";

type NavItem = {
  title: string;
  href?: string;
  icon?: React.ComponentType<{ className?: string }>;
  subMenu?: NavItem[];
};

export function Sidebar() {
  const pathname = usePathname();
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  const isActive = (href?: string) => {
    if (!href) return false;
    if (href === "/") return pathname === "/";
    return pathname === href || pathname.startsWith(href + "/") || pathname.startsWith(href);
  };

  const isMenuActive = (item: NavItem): boolean => {
    if (item.href) return isActive(item.href);
    if (!item.subMenu) return false;
    return item.subMenu.some((sub) => isMenuActive(sub));
  };

  const toggleMenu = (key: string) => {
    setExpandedMenus((prev) => ({
      ...prev,
      [key]: !prev[key],
    }));
  };

  // Garde les menus ouverts si la route active leur appartient (même après refresh)
  const computedExpandedMenus = useMemo(() => {
    const next = { ...expandedMenus };

    const walk = (items: NavItem[], parentKey = "") => {
      items.forEach((item) => {
        const key = parentKey ? `${parentKey}>${item.title}` : item.title;
        if (item.subMenu?.length) {
          const shouldBeOpen = isMenuActive(item);
          if (shouldBeOpen && next[key] === undefined) {
            next[key] = true;
          }
          walk(item.subMenu, key);
        }
      });
    };

    NAVIGATION_ITEMS.forEach((section) => walk(section.items as NavItem[]));

    return next;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pathname, expandedMenus]);

 const renderItem = (item: NavItem, depth: number, parentKey = "") => {
  const key = parentKey ? `${parentKey}>${item.title}` : item.title;
  const hasSubMenu = !!item.subMenu?.length;
  const isExpanded = computedExpandedMenus[key] ?? (hasSubMenu ? isMenuActive(item) : false);
  const active = item.href ? isActive(item.href) : false;
  const Icon = item.icon;

  // Tailles dégressives selon la profondeur
  const paddingLeft = depth === 0 ? "px-3" : depth === 1 ? "pl-6 pr-3" : "pl-9 pr-3";
  const textSize = depth >= 2 ? "text-[11px]" : "text-xs";
  const fontWeight = depth >= 1 ? "font-medium" : "font-semibold";

  if (hasSubMenu) {
    return (
      <div key={key}>
        <button
          type="button"
          onClick={() => toggleMenu(key)}
          className={`w-full flex items-center gap-2.5 ${paddingLeft} py-2 rounded-lg transition text-gray-500 hover:text-gray-900 hover:bg-gray-50`}
        >
          {Icon && <Icon className="w-4 h-4 shrink-0" />}
          <span className={`${textSize} ${fontWeight} flex-1 text-left`}>{item.title}</span>
          <ChevronDown
            className={`w-3 h-3 shrink-0 transition-transform ${isExpanded ? "rotate-180" : ""}`}
          />
        </button>

        {isExpanded && (
          <div className="space-y-0.5">
            {item.subMenu!.map((subItem) => renderItem(subItem, depth + 1, key))}
          </div>
        )}
      </div>
    );
  }

  return (
    <Link
      key={key}
      href={item.href!}
      className={`flex items-center gap-2.5 ${paddingLeft} py-2 rounded-lg transition ${
        active
          ? "bg-gray-100 text-gray-900 font-semibold"
          : `text-gray-500 hover:text-gray-900 hover:bg-gray-50 ${fontWeight}`
      }`}
    >
      {Icon && <Icon className="w-4 h-4 shrink-0" />}
      <span className={textSize}>{item.title}</span>
      {active && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-blue-500 shrink-0" />}
    </Link>
  );
};

  return (
    <aside className="w-72 bg-white border-r border-gray-100 flex flex-col p-3 overflow-y-auto">
      <nav className="flex-1">
        <div className="space-y-6">
          {NAVIGATION_ITEMS.map((section) => (
            <div key={section.title}>
              <div className="px-2 mb-2">
                <h2 className="text-[9px] font-bold text-gray-400 uppercase tracking-widest">
                  {section.title}
                </h2>
              </div>

              <div className="space-y-1">
                {section.items.map((item) => renderItem(item as NavItem, 0))}
              </div>
            </div>
          ))}
        </div>
      </nav>

      <div className="pt-5 border-t border-gray-100">
        <div className="p-3 bg-gray-50 rounded-xl flex items-center gap-3 border border-gray-100 hover:bg-white transition">
          <div className="w-9 h-9 bg-gray-900 rounded-lg flex items-center justify-center text-white text-xs font-bold">
            JD
          </div>
          <div className="flex-1 overflow-hidden">
            <p className="text-xs font-semibold text-gray-900 truncate">Jean Dupont</p>
            <p className="text-[10px] text-gray-500 uppercase truncate">Dir. Financier</p>
          </div>
        </div>
      </div>
    </aside>
  );
}