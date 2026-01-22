import { useEffect, useState } from "react";
import { useForm, useFieldArray } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { invoiceSchema } from "../schemas/invoice.schema";
import api from "../api/axios";
import useAuthStore from "../store/authStore";
import ProtectedRoute from "../components/ProtectedRoute";
import FormInput from "../components/FormInput";
import {
    Clock,
    Plus,
    Trash2,
    Download,
    Receipt,
    User,
    Calendar,
    DollarSign,
    AlertCircle,
} from "lucide-react";

const Invoices = () => {
    const [customers, setCustomers] = useState([]);
    const [items, setItems] = useState([]);
    const [invoices, setInvoices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [downloadingId, setDownloadingId] = useState(null);

    const { token } = useAuthStore();

    const {
        register,
        control,
        handleSubmit,
        reset,
        watch,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(invoiceSchema),
        defaultValues: {
            customerId: "",
            items: [{ itemId: "", quantity: "1" }],
        },
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "items",
    });

    const watchItems = watch("items");

    const fetchData = async () => {
        try {
            setLoading(true);
            const [custRes, itemRes, invRes] = await Promise.all([
                api.get("/api/customers", { headers: { Authorization: `Bearer ${token}` } }),
                api.get("/api/items", { headers: { Authorization: `Bearer ${token}` } }),
                api.get("/api/invoices", { headers: { Authorization: `Bearer ${token}` } }),
            ]);

            setCustomers(custRes.data.data || []);
            setItems(itemRes.data.data || []);
            setInvoices(invRes.data.data || []);
        } catch (error) {
            console.error("Failed to fetch data:", error);
            alert("Failed to load data. Please check your connection.");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
        // eslint-disable-next-line
    }, []);

    const calculateTotal = (item) => {
        const selectedItem = items.find((i) => i._id === item.itemId);
        const qty = Number(item.quantity) || 0;
        return selectedItem ? selectedItem.price * qty : 0;
    };

    const calculateSubTotal = () =>
        watchItems?.reduce((sum, item) => sum + calculateTotal(item), 0) || 0;

    const onSubmit = async (data) => {
        const payload = {
            customerId: data.customerId,
            items: data.items.map((item) => ({
                itemId: item.itemId,
                quantity: Number(item.quantity),
            })),
        };

        try {
            await api.post("/api/invoices", payload, {
                headers: { Authorization: `Bearer ${token}` },
            });

            alert("Invoice created successfully!");
            reset({
                customerId: "",
                items: [{ itemId: "", quantity: "1" }],
            });
            fetchData();
        } catch (error) {
            const msg = error.response?.data?.message || "Failed to create invoice.";
            alert(msg);
            console.error("Creation failed:", error.response?.data);
        }
    };

    const handleDownload = async (id) => {
        try {
            setDownloadingId(id);
            const res = await api.get(`/api/invoices/${id}/pdf`, {
                headers: { Authorization: `Bearer ${token}` },
                responseType: "blob",
            });

            const blob = new Blob([res.data], { type: "application/pdf" });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement("a");
            link.href = url;
            link.download = `invoice-${id}.pdf`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            window.URL.revokeObjectURL(url);
        } catch (error) {
            alert("Failed to download PDF.");
            console.error(error);
        } finally {
            setDownloadingId(null);
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-linear-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center">
                <div className="text-indigo-600 text-xl font-medium flex items-center gap-3">
                    <Clock className="animate-spin h-8 w-8" />
                    Loading...
                </div>
            </div>
        );
    }

    return (
        <ProtectedRoute>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
                {/* Create Invoice Form */}
                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Receipt className="h-7 w-7 text-indigo-600" />
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                            Create New Invoice
                        </h2>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* Customer Selection */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-2">
                                Select Customer
                            </label>
                            <div className="relative">
                                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400 pointer-events-none" />
                                <select
                                    {...register("customerId", { required: "Customer is " })}
                                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer bg-white"
                                >
                                    <option value="">Choose a customer</option>
                                    {customers.map((c) => (
                                        <option key={c._id} value={c._id}>
                                            {c.name} ({c.email})
                                        </option>
                                    ))}
                                </select>
                            </div>
                            {errors.customerId && (
                                <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                    <AlertCircle size={16} />
                                    {errors.customerId.message}
                                </p>
                            )}
                        </div>

                        {/* Items Section */}
                        <div>
                            <h3 className="text-lg font-semibold text-gray-700 mb-3">Invoice Items</h3>

                            <div className="space-y-4">
                                {fields.map((field, index) => {
                                    const selectedItemId = watch(`items.${index}.itemId`);
                                    const selectedItem = items.find((it) => it._id === selectedItemId);

                                    return (
                                        <div
                                            key={field.id}
                                            className="flex flex-col sm:flex-row gap-4 p-4 bg-gray-50 rounded-lg border border-gray-200"
                                        >
                                            {/* Item Select */}
                                            <div className="flex-1">
                                                <select
                                                    {...register(`items.${index}.itemId`, { required: "Select an item" })}
                                                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all cursor-pointer bg-white"
                                                >
                                                    <option value="">Select Item</option>
                                                    {items.map((i) => (
                                                        <option key={i._id} value={i._id}>
                                                            {i.name} (₹{Number(i.price).toFixed(2)}) — Stock: {i.stock}
                                                            {i.stock <= 5 && " (Low Stock ⚠)"}
                                                        </option>
                                                    ))}
                                                </select>
                                                {errors.items?.[index]?.itemId && (
                                                    <p className="text-red-500 text-sm mt-1 flex items-center gap-1">
                                                        <AlertCircle size={16} />
                                                        {errors.items[index].itemId.message}
                                                    </p>
                                                )}
                                            </div>

                                            {/* Quantity */}
                                            <div className="w-full sm:w-32">
                                                <FormInput
                                                    type="number"
                                                    min="1"
                                                    placeholder="Qty"
                                                    {...register(`items.${index}.quantity`, {
                                                        required: "Quantity is",
                                                        min: { value: 1, message: "Minimum quantity is 1" },
                                                        validate: (value) => {
                                                            if (!selectedItem) return true;
                                                            const qty = Number(value);
                                                            if (isNaN(qty)) return "Invalid number";
                                                            if (qty > selectedItem.stock) {
                                                                return `Only ${selectedItem.stock} available in stock`;
                                                            }
                                                            return true;
                                                        },
                                                    })}
                                                    error={errors.items?.[index]?.quantity?.message}
                                                />
                                            </div>

                                            {/* Total & Delete */}
                                            <div className="flex items-center gap-4 min-w-35">
                                                <div className="text-right">
                                                    <p className="text-sm text-gray-500">Total</p>
                                                    <p className="text-base font-bold text-indigo-700">
                                                        ₹{calculateTotal(watchItems[index]).toFixed(2)}
                                                    </p>
                                                </div>

                                                <button
                                                    type="button"
                                                    onClick={() => remove(index)}
                                                    disabled={fields.length === 1}
                                                    className="p-3 cursor-pointer bg-red-500 hover:bg-red-600 text-white rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                                                >
                                                    <Trash2 className="h-5 w-5" />
                                                </button>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>

                            <button
                                type="button"
                                onClick={() => append({ itemId: "", quantity: "1" })}
                                className="mt-5  flex items-center gap-2 px-5 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-all cursor-pointer font-medium shadow-sm hover:shadow"
                            >
                                <Plus className="h-5 w-5" />
                                Add Item
                            </button>
                        </div>

                        {/* Subtotal */}
                        <div className="flex flex-col sm:flex-row justify-between items-center p-5 bg-indigo-50 rounded-xl border border-indigo-200">
                            <div className="flex items-center gap-3 mb-3 sm:mb-0">
                                <DollarSign className="h-6 w-6 text-indigo-600" />
                                <span className="text-lg font-semibold text-gray-800">Subtotal</span>
                            </div>
                            <span className="text-3xl font-bold text-indigo-700">
                                ₹{calculateSubTotal().toFixed(2)}
                            </span>
                        </div>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isSubmitting}
                            className="w-full py-4 cursor-pointer bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-semibold text-lg transition-all disabled:opacity-60 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
                        >
                            {isSubmitting ? "Creating..." : "Create Invoice"}
                        </button>
                    </form>
                </div>

                {/* Recent Invoices Section */}
                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                    <h2 className="text-2xl sm:text-3xl font-bold text-gray-800 mb-6">
                        Recent Invoices
                    </h2>

                    {invoices.length === 0 ? (
                        <div className="text-center py-12">
                            <Receipt className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No invoices yet. Create your first one above!</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-indigo-50 border-b-2 border-indigo-200">
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Invoice #</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Customer</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Total</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Date</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {invoices.map((inv) => (
                                            <tr key={inv._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{inv.invoiceNumber}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700">{inv.customer.name}</td>
                                                <td className="px-6 py-4 text-sm font-semibold text-indigo-600">
                                                    ₹{Number(inv.grandTotal).toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    {new Date(inv.invoiceDate).toLocaleDateString()}
                                                </td>
                                                <td className="px-6 py-4">
                                                    <button
                                                        onClick={() => handleDownload(inv._id)}
                                                        disabled={downloadingId === inv._id}
                                                        className="flex cursor-pointer items-center gap-2 px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg text-sm font-medium transition-all disabled:opacity-50"
                                                    >
                                                        <Download className="h-4 w-4" />
                                                        {downloadingId === inv._id ? "Downloading..." : "Download PDF"}
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Cards */}
                            <div className="lg:hidden space-y-4">
                                {invoices.map((inv) => (
                                    <div
                                        key={inv._id}
                                        className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-3"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium">Invoice Number</p>
                                                <p className="text-lg font-bold text-gray-900">{inv.invoiceNumber}</p>
                                            </div>
                                            <div className="text-right">
                                                <p className="text-xs text-gray-500 font-medium">Total</p>
                                                <p className="text-xl font-bold text-indigo-600">
                                                    ₹{Number(inv.grandTotal).toFixed(2)}
                                                </p>
                                            </div>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                                                    <User className="h-3 w-3" />
                                                    Customer
                                                </p>
                                                <p className="text-sm font-semibold text-gray-700">{inv.customer.name}</p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                                                    <Calendar className="h-3 w-3" />
                                                    Date
                                                </p>
                                                <p className="text-sm font-semibold text-gray-700">
                                                    {new Date(inv.invoiceDate).toLocaleDateString()}
                                                </p>
                                            </div>
                                        </div>

                                        <button
                                            onClick={() => handleDownload(inv._id)}
                                            disabled={downloadingId === inv._id}
                                            className="w-full cursor-pointer flex items-center justify-center gap-2 px-4 py-3 bg-green-600 hover:bg-green-700 text-white rounded-lg font-medium transition-all disabled:opacity-50"
                                        >
                                            <Download className="h-5 w-5" />
                                            {downloadingId === inv._id ? "Downloading..." : "Download PDF"}
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </>
                    )}
                </div>
            </div>
        </ProtectedRoute>
    );
};

export default Invoices;