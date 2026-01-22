import { Bar } from "react-chartjs-2";
import { IndianRupee } from "lucide-react";

const monthlySalesData = {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
        {
            label: "Monthly Sales (₹)",
            data: [120000, 190000, 150000, 220000, 280000, 320000, 300000, 350000, 400000, 380000, 420000, 450000],
            backgroundColor: "rgba(79, 70, 229, 0.65)",
            borderColor: "rgb(79, 70, 229)",
            borderWidth: 1,
        },
    ],
};

export default function MonthlySalesChart() {
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-indigo-800 mb-5 flex items-center gap-2">
                <IndianRupee className="h-5 w-5" />
                Monthly Sales Overview
            </h3>
            <div className="h-80">
                <Bar
                    data={monthlySalesData}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                            y: {
                                beginAtZero: true,
                                ticks: { callback: (v) => "₹" + v.toLocaleString() },
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
}