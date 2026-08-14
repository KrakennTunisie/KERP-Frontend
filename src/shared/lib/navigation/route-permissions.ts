import { NavGroup, NAVIGATION_ITEMS, NavItem } from "@/shared/constants/navigation";

export const ROUTE_PERMISSIONS: Record<string, string[]> = {};

function walk(item: NavItem, inheritedRoles: string[]) {
  const roles = item.roles ?? inheritedRoles;
  if (item.href) {
    ROUTE_PERMISSIONS[item.href] = roles;
  }
  item.subMenu?.forEach((child) => walk(child, roles));
}

function build() {
  (NAVIGATION_ITEMS as NavGroup[]).forEach((group) => {
    group.items.forEach((item) => walk(item, group.roles ?? []));
  });
}
build();

export function getRequiredRoles(pathname: string): string[] {
  const candidates = Object.keys(ROUTE_PERMISSIONS)
    .filter((route) => pathname === route || pathname.startsWith(route + "/"))
    .sort((a, b) => b.length - a.length);

  return candidates.length ? ROUTE_PERMISSIONS[candidates[0]] : [];
}