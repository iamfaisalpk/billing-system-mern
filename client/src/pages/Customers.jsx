import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { customerSchema } from "../schemas/customer.schema";
import api from "../api/axios";
import useAuthStore from "../store/authStore";
import ProtectedRoute from "../components/ProtectedRoute";
import FormInput from "../components/FormInput";
import { Clock, Users, Edit2, Trash2, Mail, Phone, MapPin, UserPlus } from "lucide-react";

const Customers = () => {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [editing, setEditing] = useState(null);
    const { token } = useAuthStore();

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm({
        resolver: zodResolver(customerSchema),
    });

    const fetchCustomers = async () => {
        try {
            setLoading(true);
            const res = await api.get("/api/customers", {
                headers: { Authorization: `Bearer ${token}` },
            });
            setCustomers(res.data.data);
        } catch (err) {
            console.error(err);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCustomers();
        // eslint-disable-next-line
    }, []);

    const onSubmit = async (data) => {
        try {
            if (editing) {
                await api.put(`/api/customers/${editing._id}`, data, {
                    headers: { Authorization: `Bearer ${token}` },
                });
                setEditing(null);
            } else {
                await api.post("/api/customers", data, {
                    headers: { Authorization: `Bearer ${token}` },
                });
            }
            reset();
            fetchCustomers();
        } catch (err) {
            console.error(err);
        }
    };

    const handleEdit = (customer) => {
        setEditing(customer);
        reset({
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            address: customer.address,
        });
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this customer?")) return;
        try {
            await api.delete(`/api/customers/${id}`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            fetchCustomers();
        } catch (err) {
            console.error(err);
        }
    };

    if (loading) return (
        <div className="min-h-screen bg-linear-to-br from-indigo-50 via-blue-50 to-purple-50 flex items-center justify-center">
            <div className="text-indigo-600 text-xl font-medium flex items-center gap-3">
                <Clock className="animate-spin h-8 w-8" />
                Loading...
            </div>
        </div>
    );

    return (
        <ProtectedRoute>
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-8">
                {/* Add/Edit Customer Form */}
                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        {editing ? (
                            <Edit2 className="h-7 w-7 text-indigo-600" />
                        ) : (
                            <UserPlus className="h-7 w-7 text-indigo-600" />
                        )}
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">
                            {editing ? "Edit Customer" : "Add Customer"}
                        </h2>
                    </div>

                    <form className="space-y-5" onSubmit={handleSubmit(onSubmit)}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <FormInput
                                label="Name"
                                {...register("name")}
                                error={errors.name?.message}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />
                            <FormInput
                                label="Email"
                                type="email"
                                {...register("email")}
                                error={errors.email?.message}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                            <FormInput
                                label="Phone"
                                {...register("phone")}
                                error={errors.phone?.message}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />
                            <FormInput
                                label="Address"
                                {...register("address")}
                                error={errors.address?.message}
                                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent transition-all"
                            />
                        </div>

                        <div className="flex gap-3 pt-2">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="px-6 py-3 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg font-semibold transition-all disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer shadow-lg hover:shadow-xl"
                            >
                                {isSubmitting ? "Saving..." : editing ? "Update Customer" : "Add Customer"}
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

                {/* Customer List */}
                <div className="bg-white rounded-2xl shadow-lg p-6 sm:p-8">
                    <div className="flex items-center gap-3 mb-6">
                        <Users className="h-7 w-7 text-indigo-600" />
                        <h2 className="text-2xl sm:text-3xl font-bold text-gray-800">Customer List</h2>
                    </div>

                    {customers.length === 0 ? (
                        <div className="text-center py-12">
                            <Users className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                            <p className="text-gray-500 text-lg">No customers found</p>
                        </div>
                    ) : (
                        <>
                            {/* Desktop Table View */}
                            <div className="hidden lg:block overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="bg-indigo-50 border-b-2 border-indigo-200">
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Name</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Email</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Phone</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Address</th>
                                            <th className="px-6 py-4 text-left text-sm font-semibold text-gray-700">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-gray-200">
                                        {customers.map((c) => (
                                            <tr key={c._id} className="hover:bg-gray-50 transition-colors">
                                                <td className="px-6 py-4 text-sm font-medium text-gray-900">{c.name}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700">{c.email}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700">{c.phone}</td>
                                                <td className="px-6 py-4 text-sm text-gray-700">{c.address}</td>
                                                <td className="px-6 py-4">
                                                    <div className="flex gap-2">
                                                        <button
                                                            onClick={() => handleEdit(c)}
                                                            className="flex items-center gap-1 px-3 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg text-sm font-medium transition-all cursor-pointer"
                                                        >
                                                            <Edit2 className="h-4 w-4" />
                                                            Edit
                                                        </button>
                                                        <button
                                                            onClick={() => handleDelete(c._id)}
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
                                {customers.map((c) => (
                                    <div key={c._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 space-y-3">
                                        <div className="flex justify-between items-start">
                                            <div>
                                                <h3 className="text-lg font-bold text-gray-900">{c.name}</h3>
                                            </div>
                                        </div>

                                        <div className="space-y-2 pt-2 border-t border-gray-200">
                                            <div className="flex items-center gap-2">
                                                <Mail className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm text-gray-700">{c.email}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <Phone className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm text-gray-700">{c.phone}</span>
                                            </div>
                                            <div className="flex items-center gap-2">
                                                <MapPin className="h-4 w-4 text-gray-400" />
                                                <span className="text-sm text-gray-700">{c.address}</span>
                                            </div>
                                        </div>

                                        <div className="flex gap-2 pt-3 border-t border-gray-200">
                                            <button
                                                onClick={() => handleEdit(c)}
                                                className="flex-1 flex items-center justify-center gap-2 px-4 py-2 bg-yellow-500 hover:bg-yellow-600 text-white rounded-lg font-medium transition-all cursor-pointer"
                                            >
                                                <Edit2 className="h-4 w-4" />
                                                Edit
                                            </button>
                                            <button
                                                onClick={() => handleDelete(c._id)}
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

export default Customers;