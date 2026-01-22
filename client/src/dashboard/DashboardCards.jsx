import { Users, Package, FileText, TrendingUp } from "lucide-react";

export default function DashboardCards({ stats }) {
    const statCards = [
        {
            title: "Total Customers",
            value: stats?.totalCustomers?.toLocaleString() ?? "0",
            icon: Users,
            color: "text-indigo-600",
            bg: "bg-indigo-50",
        },
        {
            title: "Total Items",
            value: stats?.totalItems?.toLocaleString() ?? "0",
            icon: Package,
            color: "text-blue-600",
            bg: "bg-blue-50",
        },
        {
            title: "Total Invoices",
            value: stats?.totalInvoices?.toLocaleString() ?? "0",
            icon: FileText,
            color: "text-purple-600",
            bg: "bg-purple-50",
        },
        {
            title: "Total Sales",
            value: `₹${stats?.totalSales?.toLocaleString() ?? "0"}`,
            icon: TrendingUp,
            color: "text-orange-600",
            bg: "bg-orange-50",
        },
        {
            title: "Today Sales",
            value: `₹${stats?.todaySales?.toLocaleString() ?? "0"}`,
            icon: TrendingUp,
            color: "text-green-600",
            bg: "bg-green-50",
        },
    ];


    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-10">
            {statCards.map((card, index) => {
                const Icon = card.icon;
                return (
                    <div
                        key={index}
                        className={`
                ${card.bg} border border-gray-100/50
                rounded-2xl p-6 shadow-lg hover:shadow-xl 
                transition-all duration-300
            `}
                    >
                        <div className="flex justify-between items-start">
                            <div>
                                <p className="text-sm text-gray-600 font-medium">{card.title}</p>
                                <p className="text-2xl md:text-3xl font-bold text-gray-800 mt-2">
                                    {card.value}
                                </p>
                            </div>
                            <div className={`p-3 rounded-xl ${card.bg} bg-opacity-70`}>
                                <Icon className={`h-7 w-7 ${card.color}`} strokeWidth={2} />
                            </div>
                        </div>
                    </div>
                );
            })}
        </div>
    );
}