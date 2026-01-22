import { IndianRupee } from "lucide-react";

export default function TotalRevenueHighlight({ totalSales }) {
    return (
        <div className="mt-10 bg-linear-to-r from-indigo-600 to-blue-600 text-white rounded-2xl p-8 shadow-xl">
            <div className="flex flex-col md:flex-row justify-between items-center gap-6">
                <div>
                    <p className="text-indigo-100 text-lg font-medium">All-Time Revenue</p>
                    <p className="text-4xl md:text-5xl font-bold mt-2">
                        ₹{totalSales?.toLocaleString() ?? "0"}
                    </p>
                </div>
                <IndianRupee className="h-20 w-20 opacity-20" />
            </div>
        </div>
    );
}