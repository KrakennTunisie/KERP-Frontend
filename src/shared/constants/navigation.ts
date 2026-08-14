import {
  Users,
  Receipt,
  Wallet,
  CalendarCheck,
  LayoutDashboard,
  UsersRound,
  ShieldCheck,
  KeyRound,
} from "lucide-react";

export interface NavItem {
  title: string;
  href?: string;
  icon?: any;
  roles?: string[];        // omit => inherits parent group/item roles
  subMenu?: NavItem[];
}

export interface NavGroup {
  title: string;
  roles?: string[];
  items: NavItem[];
}

export const NAVIGATION_ITEMS: NavGroup[] = [
  {
    title: "Général",
    // no roles => accessible to any authenticated user
    items: [
      { title: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Gestion utilisateurs",
    roles: ["Expert", "Admin"],
    items: [
      { title: "Utilisateurs", icon: UsersRound, href: "/admin/users" },
      { title: "Rôles", icon: ShieldCheck, href: "/admin/roles" },
      { title: "Permissions", icon: KeyRound, href: "/admin/permissions" },
    ],
  },
  {
    title: "Finance",
    roles: ["Expert", "Admin"],
    items: [
      {
        title: "Facturation",
        icon: Receipt,
        subMenu: [
          { title: "Tableau de bord", href: "/billing/dashboard" },
          {
            title: "Clients",
            subMenu: [
              { title: "Liste des clients", href: "/billing/clients" },
              { title: "Factures Clients", href: "/billing/invoices/clients" },
              { title: "Paiements Clients", href: "/billing/payments" },
              { title: "Bons de commande Clients", href: "/billing/purchaseOrder/clients" },
            ],
          },
          {
            title: "Fournisseurs",
            subMenu: [
              { title: "Liste des fournisseurs", href: "/billing/suppliers" },
              { title: "Factures Fournisseurs", href: "/billing/invoices/suppliers" },
              { title: "Bons de commande Fournisseurs", href: "/billing/purchaseOrder/suppliers" },
            ],
          },
          { title: "Paramètres", href: "/billing/parameters", roles: ["Expert","Admin"] }, // override: stricter than Finance
        ],
      },
      {
        title: "Paie",
        icon: Wallet,
        roles: ["Admin"], // override: separate from generic Finance
        subMenu: [
          { title: "Bulletins", href: "/payroll/slips" },
          { title: "Déclarations", href: "/payroll/reports" },
        ],
      },
    ],
  },
    {
    title: "Ressources Humaines",
    roles: ["Expert", "Admin"],
    items: [
      {
        title: "Employés",
        icon: Users,
        subMenu: [
          { title: "Liste des employés", href: "/rh/employees" },
          { title: "Contrats", href: "/rh/contracts" },
        ],
      },
      { title: "Présence & Congés", icon: CalendarCheck, href: "/rh/attendance" },
    ],
  },
];