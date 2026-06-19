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
import RevenueExpenseBarChart from "../widgets/RevnueExpensesBarChart";
import PageLoader from "@/shared/components/ui/pageLoader";

export function BillingDashboard() {
  const currentYear = new Date().getFullYear();
  const currentMonth = new Date().toLocaleString("fr-FR", {
    month: "long",
  });

  const [loadingClientsStats, setLoadingClientsStats]=useState(false)
  const [loadingSuppliersStats, setLoadingSuppliersStats]=useState(false)

  const currentNumericMonth = new Date().getMonth(); // 0-based


  const [clientInvoices, setclientInvoices]=useState<ClientInvoiceDashboardStats[]|[]>([])

  const fetchClientsInvoices = async () => {
    try {
      setLoadingClientsStats(true);

      const response = await DashboardAPI.clientDashbordStats();

      setclientInvoices(response);
    } catch (error) {
      appToast.error("Erreur de fetch clients: ",getApiErrorMessage(error))
    } finally {
      setLoadingClientsStats(false);
    }
  };

    const [supplierInvoices, setSupplierInvoices]=useState<ClientInvoiceDashboardStats[]|[]>([])

  const fetchSupplierssInvoices = async () => {
    try {
      setLoadingSuppliersStats(true);

      const response = await DashboardAPI.supplierDashbordStats();

      setSupplierInvoices(response);
    } catch (error) {
      appToast.error("Erreur de fetch clients: ",getApiErrorMessage(error))
    } finally {
      setLoadingSuppliersStats(false);
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
  const monthIndex = currentNumericMonth - 3 + index;

  const date = new Date(currentYear, monthIndex);

  return {
    label: date.toLocaleString("fr-FR", { month: "short" }),
    value: date.getMonth() + 1,
  };
});

const clientsByMonth = months.map((month) => ({
  month: month.label,
  montant: clientInvoices
    .filter((inv) => inv.month === month.value)
    .reduce((sum, inv) => sum + inv.amountEUR, 0).toFixed(2),
}));

  const suppliersByMonth = months.map((month) => ({
    month: month.label,
    montant: supplierInvoices
      .filter((inv) => inv.month === month.value)
      .reduce((sum, inv) => sum + inv.amountEUR, 0).toFixed(2),
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
  )  .sort((a, b) => b.montant - a.montant) 
     .slice(0, 3);

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
  ) .sort((a, b) => b.montant - a.montant) 
     .slice(0, 3);

    // Mock chart data
  const chartData = [
    { month: 'Jan 2025', revenus: 12500, depenses: 8200 },
    { month: 'Fév 2025', revenus: 8750, depenses: 6100 },
    { month: 'Mar 2025', revenus: 15200, depenses: 9800 },
    { month: 'Avr 2025', revenus: 9800, depenses: 7400 },
    { month: 'Mai 2025', revenus: 11200, depenses: 8600 },
    { month: 'Juin 2025', revenus: 500, depenses: 20 },
  ];

  const [selectedPeriod, setSelectedPeriod] = useState(6);
  
  // Calculate statistics
    const totalRevenueLastSixMonths = chartData.reduce((sum, item) => sum + item.revenus, 0);
    const totalExpensesLastSixMonths = chartData.reduce((sum, item) => sum + item.depenses, 0);
  const monthlyData = chartData.map(item => ({
          period: item.month,
          monthLabel: item.month,
          revenueHT: item.revenus,
          revenueTVA: 0,
          revenueTTC: item.revenus,
          overdueHT: item.depenses,
          overdueTVA: item.depenses,
          overdueTTC: item.depenses,
          nombreFactures: 0,
      }));

      if(loadingClientsStats  || loadingSuppliersStats){
        return(
          <PageLoader label="Chargement des données..."/>
        )
      }

  return (
    <div className="flex min-h-screen flex-col bg-gray-50/30">
    <header className="border-b border-slate-200 bg-white px-5 py-4">
  <div className="mx-auto">

    {/* Header */}
    <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

      <div>
        <h1 className="text-xl font-semibold tracking-tight text-slate-900">
          Tableau de bord
        </h1>

        <p className="mt-0.5 text-xs text-slate-500">
          Vue d'ensemble de l'activité financière
        </p>
      </div>

      <div className="inline-flex items-center gap-2 rounded-lg border border-slate-200 bg-slate-50 px-3 py-1.5">
        <Calendar className="h-3.5 w-3.5 text-slate-500" />

        <span className="text-xs font-medium text-slate-700">
          {currentMonth} {currentYear}
        </span>
      </div>

    </div>

    {/* KPIs */}
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-4">

      <KpiCard
        color="blue"
        icon={<TrendingUp />}
        title={`Clients ${currentYear}`}
        value={`${totalClientsYearEUR.toLocaleString()} EUR`}
        secondValue={`${totalClientsYearTND.toLocaleString()} TND`}
        footer={`${clientInvoices.length} factures`}
      />

      <KpiCard
        color="emerald"
        icon={<TrendingDown />}
        title={`Fournisseurs ${currentYear}`}
        value={`${totalSuppliersYearEUR.toLocaleString()} EUR`}
        secondValue={`${totalSuppliersYearTND.toLocaleString()} TND`}
        footer={`${supplierInvoices.length} factures`}
      />

      <KpiCard
        color="purple"
        icon={<ShieldCheck />}
        title="Validation E-Facture"
        value={`${tauxValidation}%`}
        footer={`${totalConformes}/${clientInvoices.length} conformes`}
      />

      <KpiCard
        color="amber"
        icon={<Calendar />}
        title="Période"
        value={currentMonth}
        secondValue={currentYear.toString()}
        footer="Exercice en cours"
      />

    </div>

  </div>
</header>

      <main className="flex-1 p-8">
        <div className="mx-auto space-y-8">
          <RevenueExpenseBarChart
            mode="both"
            data={monthlyData}
            selectedPeriod={selectedPeriod}
            onPeriodChange={setSelectedPeriod}
            onRefresh={() => console.log("Refresh revenus et dépenses")}
            totalLabel={`Total net (${selectedPeriod} derniers mois)`}
            totalValue={totalRevenueLastSixMonths - totalExpensesLastSixMonths}
          />
            <Section
              icon={<Users />}
              iconBg="bg-blue-600 text-white"
              title="Factures clients"
              subtitle="Analyse des ventes"
            >
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <ChartCard title="Évolution mensuelle" subtitle="Total facturé en EUR">
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart
                      data={clientsByMonth}
                      margin={{ top: 10, right: 16, left: 0, bottom: 8 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />

                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12, fill: "#64748b" }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <YAxis
                        tick={{ fontSize: 12, fill: "#64748b" }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <Tooltip
                        cursor={{ stroke: "#cbd5e1", strokeWidth: 1 }}
                        contentStyle={{
                          borderRadius: "12px",
                          border: "1px solid #e2e8f0",
                          boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
                          fontSize: "12px",
                        }}
                      />

                      <Line
                        type="monotone"
                        dataKey="montant"
                        stroke="#2563eb"
                        strokeWidth={2.5}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard
                  title="Top clients"
                  subtitle={`Total par client ${currentYear} en EUR`}
                >
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart
                      data={clientsGrouped}
                      margin={{ top: 10, right: 16, left: 0, bottom: 24 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />

                      <XAxis
                        dataKey="client"
                        angle={-12}
                        textAnchor="end"
                        height={60}
                        tick={{ fontSize: 11, fill: "#64748b" }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <YAxis
                        tick={{ fontSize: 12, fill: "#64748b" }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <Tooltip
                        cursor={{ fill: "#f8fafc" }}
                        contentStyle={{
                          borderRadius: "12px",
                          border: "1px solid #e2e8f0",
                          boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
                          fontSize: "12px",
                        }}
                      />

                      <Bar
                        dataKey="montant"
                        fill="#2563eb"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={42}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </Section>

            <Section
              icon={<Truck />}
              iconBg="bg-emerald-600 text-white"
              title="Factures fournisseurs"
              subtitle="Analyse des achats"
            >
              <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">
                <ChartCard title="Évolution mensuelle" subtitle="Total facturé en EUR">
                  <ResponsiveContainer width="100%" height={260}>
                    <LineChart
                      data={suppliersByMonth}
                      margin={{ top: 10, right: 16, left: 0, bottom: 8 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />

                      <XAxis
                        dataKey="month"
                        tick={{ fontSize: 12, fill: "#64748b" }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <YAxis
                        tick={{ fontSize: 12, fill: "#64748b" }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <Tooltip
                        cursor={{ stroke: "#cbd5e1", strokeWidth: 1 }}
                        contentStyle={{
                          borderRadius: "12px",
                          border: "1px solid #e2e8f0",
                          boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
                          fontSize: "12px",
                        }}
                      />

                      <Line
                        type="monotone"
                        dataKey="montant"
                        stroke="#059669"
                        strokeWidth={2.5}
                        dot={{ r: 3 }}
                        activeDot={{ r: 5 }}
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartCard>

                <ChartCard
                  title="Top fournisseurs"
                  subtitle={`Total par fournisseur ${currentYear} en EUR`}
                >
                  <ResponsiveContainer width="100%" height={260}>
                    <BarChart
                      data={suppliersGrouped}
                      margin={{ top: 10, right: 16, left: 0, bottom: 24 }}
                    >
                      <CartesianGrid strokeDasharray="3 3" stroke="#e2e8f0" vertical={false} />

                      <XAxis
                        dataKey="client"
                        angle={-12}
                        textAnchor="end"
                        height={60}
                        tick={{ fontSize: 11, fill: "#64748b" }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <YAxis
                        tick={{ fontSize: 12, fill: "#64748b" }}
                        axisLine={false}
                        tickLine={false}
                      />

                      <Tooltip
                        cursor={{ fill: "#f8fafc" }}
                        contentStyle={{
                          borderRadius: "12px",
                          border: "1px solid #e2e8f0",
                          boxShadow: "0 10px 25px rgba(15, 23, 42, 0.08)",
                          fontSize: "12px",
                        }}
                      />

                      <Bar
                        dataKey="montant"
                        fill="#059669"
                        radius={[8, 8, 0, 0]}
                        maxBarSize={42}
                      />
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

