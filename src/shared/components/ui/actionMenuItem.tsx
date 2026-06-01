"use client";

import { useEffect, useRef, useState } from "react";
import {
  MoreVertical,
  MoreHorizontal,
  LucideIcon,
} from "lucide-react";
import { createPortal } from "react-dom";

type ActionMenuOrientation = "vertical" | "horizontal";

export type ActionMenuItem = {
  label: string;
  icon: LucideIcon;
  onClick: () => void;
  color?: string;
  hover?: string;
  disabled?: boolean;
};

type ActionMenuProps = {
  items: ActionMenuItem[];
  title?: string;
  orientation?: ActionMenuOrientation;
};

const MENU_WIDTH = 192; // w-48
const MENU_MAX_HEIGHT = 224; // max-h-56
const MENU_GAP = 6;
const VIEWPORT_MARGIN = 8;
const ITEM_ESTIMATED_HEIGHT = 36;

export function ActionMenu({
  items,
  title = "Actions",
  orientation = "vertical",
}: ActionMenuProps) {
  const [openMenu, setOpenMenu] = useState(false);

  const [menuPosition, setMenuPosition] = useState({
    top: 0,
    left: 0,
    maxHeight: MENU_MAX_HEIGHT,
  });

  const buttonRef = useRef<HTMLButtonElement | null>(null);
  const menuRef = useRef<HTMLDivElement | null>(null);

  const MenuIcon = orientation === "horizontal" ? MoreHorizontal : MoreVertical;

  const calculateMenuPosition = () => {
    if (!buttonRef.current) return;

    const rect = buttonRef.current.getBoundingClientRect();

    const viewportHeight = window.innerHeight;
    const viewportWidth = window.innerWidth;

    const estimatedMenuHeight = Math.min(
      MENU_MAX_HEIGHT,
      items.length * ITEM_ESTIMATED_HEIGHT + 8
    );

    const spaceBelow = viewportHeight - rect.bottom - VIEWPORT_MARGIN;
    const spaceAbove = rect.top - VIEWPORT_MARGIN;

    const shouldOpenAbove =
      spaceBelow < estimatedMenuHeight && spaceAbove > spaceBelow;

    const availableHeight = shouldOpenAbove ? spaceAbove : spaceBelow;

    const maxHeight = Math.max(
      120,
      Math.min(MENU_MAX_HEIGHT, availableHeight - MENU_GAP)
    );

    const top = shouldOpenAbove
      ? Math.max(
          VIEWPORT_MARGIN,
          rect.top - Math.min(estimatedMenuHeight, maxHeight) - MENU_GAP
        )
      : rect.bottom + MENU_GAP;

    /**
     * Position à gauche du bouton :
     * le menu s'aligne avec le bord droit du bouton,
     * donc il s'étend vers la gauche.
     */
    const left = Math.min(
      viewportWidth - MENU_WIDTH - VIEWPORT_MARGIN,
      Math.max(VIEWPORT_MARGIN, rect.right - MENU_WIDTH)
    );

    setMenuPosition({
      top,
      left,
      maxHeight,
    });
  };

  const openDropdown = () => {
    calculateMenuPosition();
    setOpenMenu((prev) => !prev);
  };

  useEffect(() => {
    if (!openMenu) return;

    function handleClickOutside(event: MouseEvent) {
      const target = event.target as Node;

      if (
        menuRef.current &&
        !menuRef.current.contains(target) &&
        buttonRef.current &&
        !buttonRef.current.contains(target)
      ) {
        setOpenMenu(false);
      }
    }

    function handleScrollOrResize() {
      setOpenMenu(false);
    }

    function handleEscape(event: KeyboardEvent) {
      if (event.key === "Escape") {
        setOpenMenu(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    window.addEventListener("scroll", handleScrollOrResize, true);
    window.addEventListener("resize", handleScrollOrResize);

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
      window.removeEventListener("scroll", handleScrollOrResize, true);
      window.removeEventListener("resize", handleScrollOrResize);
    };
  }, [openMenu]);

  return (
    <>
      <button
        ref={buttonRef}
        type="button"
        onClick={openDropdown}
        title={title}
        aria-label={title}
        aria-expanded={openMenu}
        className="
          inline-flex h-8 w-8 items-center justify-center
          rounded-lg border border-slate-200 bg-white
          text-slate-500 shadow-sm
          transition hover:bg-slate-50 hover:text-slate-800
          focus:outline-none focus:ring-2 focus:ring-blue-500/20
          cursor-pointer
          disabled:cursor-not-allowed disabled:opacity-50
        "
      >
        <MenuIcon className="h-4 w-4" />
      </button>

      {openMenu &&
        createPortal(
          <div
            ref={menuRef}
            className="
              fixed z-[9999] w-48 overflow-hidden
              rounded-xl border border-slate-200 bg-white
              p-1 shadow-lg shadow-slate-200/70
            "
            style={{
              top: menuPosition.top,
              left: menuPosition.left,
            }}
          >
            <div
              className="
                overflow-y-auto pr-1 space-y-0.5
                [scrollbar-width:thin]
                [scrollbar-color:#cbd5e1_transparent]
              "
              style={{
                maxHeight: menuPosition.maxHeight,
              }}
            >
              {items.map((item) => {
                const Icon = item.icon;

                return (
                  <button
                    key={item.label}
                    type="button"
                    disabled={item.disabled}
                    onClick={() => {
                      item.onClick();
                      setOpenMenu(false);
                    }}
                    className={`
                      flex w-full items-center gap-2.5
                      rounded-lg px-2.5 py-2 text-left
                      cursor-pointer
                      text-xs font-semibold text-slate-700
                      transition
                      disabled:cursor-not-allowed disabled:opacity-45
                      ${item.hover ?? "hover:bg-slate-50"}
                    `}
                  >
                    <span
                      className={`
                        flex h-6 w-6 shrink-0 items-center justify-center
                        rounded-md bg-slate-50
                        ${item.color ?? "text-slate-500"}
                      `}
                    >
                      <Icon className="h-3.5 w-3.5" />
                    </span>

                    <span className="truncate">{item.label}</span>
                  </button>
                );
              })}
            </div>
          </div>,
          document.body
        )}
    </>
  );
}