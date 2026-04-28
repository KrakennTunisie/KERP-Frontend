import { 
  Users, 
  Receipt, 
  Wallet, 
  CalendarCheck, 
  LayoutDashboard 
} from "lucide-react";

export const NAVIGATION_ITEMS = [
  {
    title: "Général",
    items: [
      { title: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard },
    ],
  },
  {
    title: "Ressources Humaines",
    items: [
      {
        title: "Employés",
        icon: Users,
        subMenu: [
          { title: "Liste des employés", href: "/employees" },
          { title: "Contrats", href: "/employees/contracts" },
        ],
      },
      {
        title: "Présence & Congés",
        icon: CalendarCheck,
        href: "/attendance",
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