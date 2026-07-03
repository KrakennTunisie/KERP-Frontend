import { PermissionCategory } from "../mocks/mock-permission";

export const getCategoryLabel = (
  category: PermissionCategory|string
): string => {
  switch (category) {
    case "ALL":
      return "Tous"
    case "USER":
      return "Utilisateurs";

    case "BILLING":
      return "Facturation";

    case "SYSTEM":
      return "Système";

    case "REPORTING":
      return "Rapports";

    default:
      return category;
  }
};