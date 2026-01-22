export default function RecentInvoices({ invoices = [] }) {
    return (
        <div className="bg-white/80 backdrop-blur-sm rounded-2xl p-6 shadow-lg border border-gray-100 mt-8">
            <h3 className="text-lg font-semibold text-indigo-800 mb-5">
                Recent Invoices
            </h3>

            {invoices.length === 0 ? (
                <p className="text-gray-500 text-center py-10">
                    No recent invoices
                </p>
            ) : (
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="text-left text-gray-500 border-b">
                                <th className="pb-3">Invoice</th>
                                <th className="pb-3">Customer</th>
                                <th className="pb-3">Date</th>
                                <th className="pb-3">Amount</th>
                                <th className="pb-3">Status</th>
                            </tr>
                        </thead>
                        <tbody>
                            {invoices.map((inv) => (
                                <tr key={inv._id} className="border-b last:border-0">
                                    <td className="py-3 font-medium">
                                        {inv.invoiceNumber || inv._id}
                                    </td>
                                    <td>{inv.customerName}</td>
                                    <td>
                                        {new Date(inv.createdAt).toLocaleDateString()}
                                    </td>
                                    <td>₹{inv.amount?.toLocaleString()}</td>
                                    <td
                                        className={`font-medium ${inv.status === "Paid"
                                                ? "text-green-600"
                                                : inv.status === "Pending"
                                                    ? "text-orange-500"
                                                    : "text-red-600"
                                            }`}
                                    >
                                        {inv.status}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
