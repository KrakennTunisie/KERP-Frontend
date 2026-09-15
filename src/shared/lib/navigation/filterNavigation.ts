import { NavGroup, NavItem } from "@/shared/constants/navigation";

function hasAccess(roles: string[] | undefined, userRoles: string[]): boolean {
  if (!roles || roles.length === 0) return true; // no roles => open to any authenticated user
  return roles.some((r) => userRoles.includes(r));
}

function filterItem(item: NavItem, inheritedRoles: string[], userRoles: string[]): NavItem | null {
  const roles = item.roles ?? inheritedRoles;

  if (!hasAccess(roles, userRoles)) return null;

  if (item.subMenu?.length) {
    const filteredSubMenu = item.subMenu
      .map((child) => filterItem(child, roles, userRoles))
      .filter((child): child is NavItem => child !== null);

    // Drop parent if it has no href and every child got filtered out
    if (filteredSubMenu.length === 0 && !item.href) return null;

    return { ...item, subMenu: filteredSubMenu };
  }

  return item;
}

export function filterNavigationByRole(
  navigation: NavGroup[],
  userRoles: string[]
): NavGroup[] {
  return navigation
    .map((group) => {
      if (!hasAccess(group.roles, userRoles)) return null;

      const items = group.items
        .map((item) => filterItem(item, group.roles ?? [], userRoles))
        .filter((item): item is NavItem => item !== null);

      if (items.length === 0) return null;

      return { ...group, items };
    })
    .filter((group): group is NavGroup => group !== null);
}