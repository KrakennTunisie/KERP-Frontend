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
        href:"/admin/users"
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
      { title: "Facturation", 
        icon: Receipt, 
        subMenu: [
          { title: "Tableau de board", href: "/billing/dashboard" },
          { title: "Clients", href: "/billing/clients" },
          { title: "Fournisseurs", href: "/billing/suppliers" },
          { title: "Factures Clients", href: "/billing/invoices/clients" },
          { title: "Factures Fournisseurs", href: "/billing/invoices/suppliers" },
          { title: "Paiements Clients", href: "/billing/payments" },
          { title: "Bons des commandes clients", href: "/billing/purchaseOrder/clients" },
          { title: "Bons des commandes Fournisseurs", href: "/billing/purchaseOrder/suppliers" },
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