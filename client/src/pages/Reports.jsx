import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { reportSchema } from "../schemas/report.schema";
import { fetchDateWiseReport, fetchCustomerReport } from "../api/reports.api";
import api from "../api/axios";
import {
    Clock,
    Calendar,
    Users,
    IndianRupee,
    FileText,
    AlertCircle,
    Download,
    Receipt,
} from "lucide-react";

const Reports = () => {
    const [totalSales, setTotalSales] = useState(0);
    const [invoices, setInvoices] = useState([]);
    const [customers, setCustomers] = useState([]);
    const [customerId, setCustomerId] = useState("");
    const [loading, setLoading] = useState(true);
    const [reportLoading, setReportLoading] = useState(false);

    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(reportSchema),
    });

    useEffect(() => {
        const loadCustomers = async () => {
            try {
                setLoading(true);
                const res = await api.get("/api/customers");
                setCustomers(res.data.data || []);
            } catch (err) {
                console.error(err);
            } finally {
                setLoading(false);
            }
        };
        loadCustomers();
    }, []);

    const onDateSubmit = async (data) => {
        setReportLoading(true);
        try {
            const res = await fetchDateWiseReport(data.from, data.to);
            setTotalSales(res.data.data.totalSales || 0);
            setInvoices(res.data.data.invoices || []);
            setCustomerId("");
        } catch (err) {
            console.error(err);
            alert("Failed to generate date-wise report");
        } finally {
            setReportLoading(false);
        }
    };

    const handleCustomerChange = async (id) => {
        setCustomerId(id);
        if (!id) {
            setInvoices([]);
            setTotalSales(0);
            return;
        }

        setReportLoading(true);
        try {
            const res = await fetchCustomerReport(id);
            const invoiceList = res.data.data || [];
            setInvoices(invoiceList);

            const total = invoiceList.reduce((sum, inv) => sum + (inv.grandTotal || 0), 0);
            setTotalSales(total);
        } catch (err) {
            console.error(err);
            alert("Failed to fetch customer report");
        } finally {
            setReportLoading(false);
        }
    };

    // Helper function to safely get customer display text
    const getCustomerDisplay = (customer) => {
        // Check if customer is populated (is an object with name/email properties)
        if (customer && typeof customer === 'object' && customer.name) {
            return `${customer.name} (${customer.email || 'No Email'})`;
        }
        // If customer is just an ID string or null
        return 'Unknown Customer';
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center">
                <div className="text-indigo-600 text-xl font-medium flex items-center gap-3">
                    <Clock className="animate-spin h-8 w-8" />
                    Loading Reports...
                </div>
            </div>
        );
    }

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
            {/* Header */}
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
                    <FileText className="h-8 w-8 text-indigo-600" />
                    Sales Reports
                </h1>
            </div>

            {/* Filters Card */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    {/* Date-wise Report */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                            <Calendar className="h-6 w-6 text-indigo-600" />
                            Date Range Report
                        </h2>

                        <form onSubmit={handleSubmit(onDateSubmit)} className="space-y-5">
                            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        From Date
                                    </label>
                                    <input
                                        type="date"
                                        {...register("from")}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    />
                                    {errors.from && (
                                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                            <AlertCircle size={16} />
                                            {errors.from.message}
                                        </p>
                                    )}
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        To Date
                                    </label>
                                    <input
                                        type="date"
                                        {...register("to")}
                                        className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                                    />
                                    {errors.to && (
                                        <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                            <AlertCircle size={16} />
                                            {errors.to.message}
                                        </p>
                                    )}
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={isSubmitting || reportLoading}
                                className="w-full sm:w-auto px-8 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                            >
                                {isSubmitting || reportLoading ? (
                                    <>
                                        <Clock className="h-5 w-5 animate-spin" />
                                        Generating...
                                    </>
                                ) : (
                                    "Generate Report"
                                )}
                            </button>
                        </form>
                    </div>

                    {/* Customer-wise Report */}
                    <div className="space-y-6">
                        <h2 className="text-xl font-semibold text-gray-800 flex items-center gap-3">
                            <Users className="h-6 w-6 text-indigo-600" />
                            Customer-wise Report
                        </h2>

                        <select
                            value={customerId}
                            onChange={(e) => handleCustomerChange(e.target.value)}
                            disabled={reportLoading}
                            className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer bg-white disabled:opacity-60"
                        >
                            <option value="">Select Customer</option>
                            {customers.map((c) => (
                                <option key={c._id} value={c._id}>
                                    {c.name} ({c.email})
                                </option>
                            ))}
                        </select>

                        {reportLoading && (
                            <div className="text-indigo-600 flex items-center gap-2 mt-2">
                                <Clock className="h-5 w-5 animate-spin" />
                                Loading customer report...
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Summary Card */}
            <div className="bg-linear-to-r from-indigo-600 to-indigo-700 text-white rounded-2xl shadow-lg p-6 sm:p-8">
                <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <IndianRupee className="h-10 w-10 opacity-90" />
                        <div>
                            <p className="text-lg opacity-90">Total Sales</p>
                            <h3 className="text-4xl font-bold">₹{totalSales.toFixed(2)}</h3>
                        </div>
                    </div>
                </div>
            </div>

            {/* Invoices List */}
            <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center gap-3">
                    <FileText className="h-7 w-7 text-indigo-600" />
                    Invoice List
                </h2>

                {invoices.length === 0 ? (
                    <div className="text-center py-12">
                        <Receipt className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                        <p className="text-gray-500 text-lg">No invoices found in this period/customer</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full min-w-150">
                            <thead>
                                <tr className="bg-indigo-50 border-b-2 border-indigo-200">
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Invoice #</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer</th>
                                    <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Total</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-200">
                                {invoices.map((inv) => (
                                    <tr key={inv._id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-6 py-4 text-sm font-medium text-gray-900">
                                            {inv.invoiceNumber}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700">
                                            {new Date(inv.invoiceDate).toLocaleDateString("en-IN")}
                                        </td>
                                        <td className="px-6 py-4 text-sm text-gray-700 font-medium">
                                            {getCustomerDisplay(inv.customer)}
                                        </td>
                                        <td className="px-6 py-4 text-sm font-semibold text-indigo-600">
                                            ₹{Number(inv.grandTotal).toFixed(2)}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Reports;