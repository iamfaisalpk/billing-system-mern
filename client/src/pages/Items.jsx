// Items.tsx (or Items.jsx)
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { itemSchema } from "../schemas/item.schema";
import api from "../api/axios";
import useAuthStore from "../store/authStore";
import ProtectedRoute from "../components/ProtectedRoute";
import FormInput from "../components/FormInput";
import { Clock, Package, Edit2, Trash2, DollarSign, Box } from "lucide-react";

const Items = () => {
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const { token } = useAuthStore();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(itemSchema),
        defaultValues: {
            name: "",
            price: "",
            stock: "",
        },
    });

    const fetchItems = async () => {
        try {
            setLoading(true);
            const res = await api.get("/api/items", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setItems(res.data.data || []);
        } catch (err) {
            console.error("Failed to fetch items:", err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchItems();
        // eslint-disable-next-line
    }, []);

    const onSubmit = async (data) => {
        // Convert price & stock back to numbers before sending to API
        const payload = {
            ...data,
            price: Number(data.price),
            stock: Number(data.stock),
        };

        try {
            if (editing) {
                await api.put(`/api/items/${editing._id}`, payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setEditing(null);
            } else {
                await api.post("/api/items", payload, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
            reset();
            fetchItems();
        } catch (err) {
            console.error("Error saving item:", err);
            alert(err.response?.data?.message || "Something went wrong");
        }
    };

    const handleEdit = (item) => {
        setEditing(item);
        reset({
            name: item.name,
            price: String(item.price),    // important: convert to string
            stock: String(item.stock),    // important: convert to string
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this item?")) return;

        try {
            await api.delete(`/api/items/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchItems();
        } catch (err) {
            console.error("Error deleting item:", err);
            alert("Failed to delete item");
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
                {/* Add/Edit Item Form */}
                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        {editing ? (
                            <Edit2 className="h-7 w-7 text-indigo-600" />
                        ) : (
                            <Package className="h-7 w-7 text-indigo-600" />
                        )}
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                            {editing ? "Edit Item" : "Add New Item"}
                        </h2>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                            <FormInput
                                label="Item Name"
                                {...register("name")}
                                error={errors.name?.message}
                                className="w-full px-4 py-3 border border-black rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />

                            <FormInput
                                label="Price (₹)"
                                type="number"
                                step="0.01"
                                {...register("price")}
                                error={errors.price?.message}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />

                            <FormInput
                                label="Stock"
                                type="number"
                                {...register("stock")}
                                error={errors.stock?.message}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg hover:shadow-xl"
                            >
                                {isSubmitting
                                    ? "Saving..."
                                    : editing
                                        ? "Update Item"
                                        : "Add Item"}
                            </button>

                            {editing && (
                                <button
                                    type="button"
                                    onClick={() => {
                                        setEditing(null);
                                        reset();
                                    }}
                                    className="px-6 py-3 bg-gray-500 hover:bg-gray-600 text-white rounded-lg font-semibold transition-all cursor-pointer"
                                >
                                    Cancel
                                </button>
                            )}
                        </div>
                    </form>
                </div>

                {/* Items List */}
                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Package className="h-7 w-7 text-indigo-600" />
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Items List</h2>
                    </div>

                    {items.length === 0 ? (
                        <div className="text-center py-12">
                            <Package className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No items found. Add your first item above!</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-indigo-50 border-b-2 border-indigo-200">
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Price (₹)</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Stock</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {items.map((item) => (
                                            <tr key={item._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{item.name}</td>
                                                <td className="px-6 py-4 text-sm font-semibold text-indigo-600">
                                                    ₹{Number(item.price).toFixed(2)}
                                                </td>
                                                <td className="px-6 py-4 text-sm text-gray-700">
                                                    <span
                                                        className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${item.stock > 10
                                                                ? "bg-green-100 text-green-700"
                                                                : item.stock > 0
                                                                    ? "bg-yellow-100 text-yellow-700"
                                                                    : "bg-red-100 text-red-700"
                                                            }`}
                                                    >
                                                        {item.stock} units
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleEdit(item)}
                                                            className="flex items-center gap-1 px-3 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg text-sm font-medium transition-all cursor-pointer"
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(item._id)}
                                                            className="flex items-center gap-1 px-3 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg text-sm font-medium transition-all cursor-pointer"
                                                        >
                                                            <Trash2 className="h-4 w-4" />
                                                            Delete
                                                        </button>
                                                    </div>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Mobile Card View */}
                            <div className="lg:hidden space-y-4">
                                {items.map((item) => (
                                    <div
                                        key={item._id}
                                        className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-3"
                                    >
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">{item.name}</h3>
                                            </div>
                                            <span
                                                className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold ${item.stock > 10
                                                        ? "bg-green-100 text-green-700"
                                                        : item.stock > 0
                                                            ? "bg-yellow-100 text-yellow-700"
                                                            : "bg-red-100 text-red-700"
                                                    }`}
                                            >
                                                {item.stock} units
                                            </span>
                                        </div>

                                        <div className="grid grid-cols-2 gap-3 pt-2 border-t border-gray-200">
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                                                    <DollarSign className="h-3 w-3" />
                                                    Price
                                                </p>
                                                <p className="text-lg font-bold text-indigo-600">
                                                    ₹{Number(item.price).toFixed(2)}
                                                </p>
                                            </div>
                                            <div>
                                                <p className="text-xs text-gray-500 font-medium flex items-center gap-1">
                                                    <Box className="h-3 w-3" />
                                                    Stock
                                                </p>
                                                <p className="text-lg font-bold text-gray-900">{item.stock}</p>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 pt-3 border-t border-gray-200">
                                            <button
                                                onClick={() => handleEdit(item)}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-all cursor-pointer"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(item._id)}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-medium transition-all cursor-pointer"
                                            >
                                                <Trash2 className="h-4 w-4" />
                                                Delete
                                            </button>
                                        </div>
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

export default Items;