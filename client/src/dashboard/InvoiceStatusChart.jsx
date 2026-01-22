import { Doughnut } from "react-chartjs-2";
import { FileText } from "lucide-react";

const invoiceStatusData = {
    labels: ["Paid", "Pending", "Overdue"],
    datasets: [
        {
            data: [65, 25, 10],
            backgroundColor: ["#4F46E5", "#F59E0B", "#EF4444"],
            hoverOffset: 20,
        },
    ],
};

export default function InvoiceStatusChart() {
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100">
            <h3 className="text-lg font-semibold text-indigo-800 mb-5 flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Invoice Status Distribution
            </h3>
            <div className="h-80 flex items-center justify-center">
                <Doughnut
                    data={invoiceStatusData}
                    options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: {
                            legend: {
                                position: "bottom",
                                labels: { padding: 20, font: { size: 14 } },
                            },
                        },
                    }}
                />
            </div>
        </div>
    );
}