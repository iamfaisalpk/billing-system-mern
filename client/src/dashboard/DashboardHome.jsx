import { useEffect, useState } from "react";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
    ArcElement,
} from "chart.js";
import { Clock } from "lucide-react";
import DashboardCards from "./DashboardCards";
import MonthlySalesChart from "./MonthlySalesChart";
import InvoiceStatusChart from "./InvoiceStatusChart";
import TotalRevenueHighlight from "./TotalRevenueHighlight";

import { fetchDashboardStats } from "../api/dashboard.api";
import RecentInvoices from "./RecentInvoices";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

export default function DashboardHome() {
    const [stats, setStats] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadStats = async () => {
            try {
                const res = await fetchDashboardStats();
                setStats(res.data.data);
            } catch (error) {
                console.error("Failed to load dashboard stats:", error);
            } finally {
                setLoading(false);
            }
        };
        loadStats();
    }, []);

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center">
                <div className="text-indigo-600 text-xl font-medium flex items-center gap-3">
                    <Clock className="animate-spin h-6 w-6" />
                    Loading dashboard...
                </div>
            </div>
        );
    }

    if (!stats) return <div className="text-center p-10 text-gray-500">No data available</div>;

    return (
        <div className="w-full">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-indigo-800">Dashboard</h1>
                <p className="text-indigo-600/80 mt-1">
                    Business overview • {new Date().toLocaleDateString()}
                </p>
            </div>

            {/* Stats Cards */}
            <DashboardCards stats={stats} />

            {/* Recent Invoices */}
            <RecentInvoices invoices={stats.lastFiveInvoices} />


            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-8">
                <MonthlySalesChart />
                <InvoiceStatusChart />
            </div>

            {/* Total Revenue */}
            <div className="mt-8">
                <TotalRevenueHighlight totalSales={stats.totalSales} />
            </div>
        </div>
    );

}