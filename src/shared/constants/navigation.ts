import {
  Users,
  Receipt,
  Wallet,
  CalendarCheck,
  LayoutDashboard,
  UsersRound,
  ShieldCheck,
  KeyRound
} from "lucide-react";

export const NAVIGATION_ITEMS = [
  {
    title: "Général",
    items: [
      { title: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Gestion utilisateurs",
    items: [
      {
        title: "Utilisateurs",
        icon: UsersRound,
        href: "/admin/users"
      },
      {
        title: "Rôles",
        icon: ShieldCheck,
        href: "/admin/roles",
      },

      {
        title: "Permissions",
        icon: KeyRound,
        href: "/admin/permissions",
      },
    ],
  },
  {
    title: "Ressources Humaines",
    items: [
      {
        title: "Employés",
        icon: Users,
        subMenu: [
          { title: "Liste des employés", href: "/rh/employees" },
          { title: "Contrats", href: "/rh/contracts" },
        ],
      },
      {
        title: "Présence & Congés",
        icon: CalendarCheck,
        href: "/rh/attendance",
      },
    ],
  },
  {
    title: "Finance",
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
          { title: "Paramètres", href: "/billing/parameters" },
        ],
      },
      {
        title: "Paie",
        icon: Wallet,
        subMenu: [
          { title: "Bulletins", href: "/payroll/slips" },
          { title: "Déclarations", href: "/payroll/reports" },
        ],
      },
    ],
  },
];