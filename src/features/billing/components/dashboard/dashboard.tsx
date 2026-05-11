// components/dashboard/Dashboard.tsx
"use client";

import { KpiCard } from "@/shared/components/ui/KPIcard";
import { ChartCard } from "@/shared/components/widgets/chartCard";
import { Section } from "@/shared/components/widgets/section";
import {
  TrendingUp,
  TrendingDown,
  Users,
  Truck,
  Calendar,
  ShieldCheck,
} from "lucide-react";
import { useEffect, useState } from "react";

import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { ClientInvoiceDashboardStats } from "../../types/clientDashboardStats";
import { DashboardAPI } from "../../api/partners-api";
import { appToast } from "@/shared/lib/toast";
import { getApiErrorMessage } from "@/shared/api/handle-api-error";

export function BillingDashboard() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().toLocaleString("fr-FR", {
    month: "long",
  });

  const [clientInvoices, setclientInvoices]=useState<ClientInvoiceDashboardStats[]|[]>([])

  const fetchClientsInvoices = async () => {
    try {
      //setLoading(true);

      const response = await DashboardAPI.clientDashbordStats();

      setclientInvoices(response);
    } catch (error) {
      appToast.error("Erreur de fetch clients: ",getApiErrorMessage(error))
    } finally {
      //setLoading(false);
    }
  };

    const [supplierInvoices, setSupplierInvoices]=useState<ClientInvoiceDashboardStats[]|[]>([])

  const fetchSupplierssInvoices = async () => {
    try {
      //setLoading(true);

      const response = await DashboardAPI.supplierDashbordStats();

      setSupplierInvoices(response);
    } catch (error) {
      appToast.error("Erreur de fetch clients: ",getApiErrorMessage(error))
    } finally {
      //setLoading(false);
    }
  };

  useEffect(()=>{
    fetchClientsInvoices()
    fetchSupplierssInvoices()
  },[])


  const totalClientsYearEUR = clientInvoices.reduce((sum, inv) => sum + inv.amountEUR, 0);
  const totalClientsYearTND = clientInvoices.reduce((sum, inv) => sum + inv.amountTND, 0);

  const totalSuppliersYearEUR = supplierInvoices.reduce((sum, inv) => sum + inv.amountEUR, 0);
  const totalSuppliersYearTND = supplierInvoices.reduce((sum, inv) => sum + inv.amountTND, 0);

  const totalConformes = clientInvoices.filter((inv) => inv.conformite).length;
  const tauxValidation = ((totalConformes / clientInvoices.length) * 100).toFixed(1);


const months = Array.from({ length: 6 }, (_, index) => {
  const date = new Date(currentYear, index);

  return {
    label: date.toLocaleString("fr-FR", { month: "short" }),
    value: index + 1, // Janvier = 1, Février = 2, etc.
  };
});

const clientsByMonth = months.map((month) => ({
  month: month.label,
  montant: clientInvoices
    .filter((inv) => inv.month === month.value)
    .reduce((sum, inv) => sum + inv.amountEUR, 0),
}));

  const suppliersByMonth = months.map((month) => ({
    month: month.label,
    montant: supplierInvoices
      .filter((inv) => inv.month === month.value)
      .reduce((sum, inv) => sum + inv.amountEUR, 0),
  }));
console.log("suppliersByMonth: ",suppliersByMonth)
  const clientsGrouped = clientInvoices.reduce<{ client: string; montant: number }[]>(
    (acc, inv) => {
      const existing = acc.find((item) => item.client === inv.client);

      if (existing) {
        existing.montant += inv.amountEUR;
      } else {
        acc.push({ client: inv.client, montant: inv.amountEUR });
      }

      return acc;
    },
    []
  );

    const suppliersGrouped = supplierInvoices.reduce<{ client: string; montant: number }[]>(
    (acc, inv) => {
      const existing = acc.find((item) => item.client === inv.client);

      if (existing) {
        existing.montant += inv.amountEUR;
      } else {
        acc.push({ client: inv.client, montant: inv.amountEUR });
      }

      return acc;
    },
    []
  );



  return (
    <div className="flex min-h-screen flex-col bg-gray-50/30">
      <header className="border-b border-gray-100 bg-white px-8 py-8">
        <div className="mx-auto max-w-[1600px]">
          <div className="mb-8">
            <h1 className="text-3xl font-black tracking-tighter text-gray-900">
              Tableau de Bord
            </h1>
            <p className="mt-1 text-sm font-bold text-gray-600">
              Vue d&apos;ensemble de l&apos;activité financière
            </p>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
            <KpiCard
              color="blue"
              icon={<TrendingUp className="h-6 w-6 text-white" />}
              title={`Clients ${currentYear}`}
              value={`${totalClientsYearEUR.toLocaleString()} EUR`}
              secondValue={`${totalClientsYearTND.toLocaleString()} TND`}
              footer={`${clientInvoices.length} factures`}
            />

            <KpiCard
              color="emerald"
              icon={<TrendingDown className="h-6 w-6 text-white" />}
              title={`Fournisseurs ${currentYear}`}
              value={`${totalSuppliersYearEUR.toLocaleString()} EUR`}
              secondValue={`${totalSuppliersYearTND.toLocaleString()} TND`}
              footer={`${supplierInvoices.length} factures`}
            />

            <KpiCard
              color="purple"
              icon={<ShieldCheck className="h-6 w-6 text-white" />}
              title="Validation E-Facture"
              value={`${tauxValidation}%`}
              footer={`${totalConformes}/${clientInvoices.length} conformes`}
            />

            <KpiCard
              color="amber"
              icon={<Calendar className="h-6 w-6 text-white" />}
              title="Période"
              value={currentMonth}
              secondValue={`${currentYear}`}
              footer="Exercice en cours"
            />
          </div>
        </div>
      </header>

      <main className="flex-1 p-8">
        <div className="mx-auto max-w-[1600px] space-y-8">
          <Section
            icon={<Users className="h-6 w-6 text-blue-600" />}
            iconBg="bg-blue-100"
            title="Factures Clients"
            subtitle="Analyse des ventes"
          >
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <ChartCard title="Total par Mois (EUR)">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={clientsByMonth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="montant"
                      stroke="#3b82f6"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title={`Total par Client ${currentYear} (EUR)`}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={clientsGrouped}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="client" angle={-15} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="montant" fill="#3b82f6" radius={[12, 12, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </Section>

          <Section
            icon={<Truck className="h-6 w-6 text-emerald-600" />}
            iconBg="bg-emerald-100"
            title="Factures Fournisseurs"
            subtitle="Analyse des achats"
          >
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-2">
              <ChartCard title="Total par Mois (EUR)">
                <ResponsiveContainer width="100%" height={300}>
                  <LineChart data={suppliersByMonth}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="month" />
                    <YAxis />
                    <Tooltip />
                    <Line
                      type="monotone"
                      dataKey="montant"
                      stroke="#10b981"
                      strokeWidth={3}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title={`Total par Fournisseur ${currentYear} (EUR)`}>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={suppliersGrouped}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="client" angle={-15} textAnchor="end" height={80} />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="montant" fill="#10b981" radius={[12, 12, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>
          </Section>

        </div>
      </main>
    </div>
  );
}

