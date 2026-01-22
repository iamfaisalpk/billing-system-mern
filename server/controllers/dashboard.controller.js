import Customer from "../models/Customer.model.js";
import Item from "../models/Item.model.js";
import Invoice from "../models/Invoice.model.js";

export const getDashboardStats = async (req, res, next) => {
    try {
        const userId = req.user._id;

        const startOfDay = new Date();
        startOfDay.setHours(0, 0, 0, 0);

        const [
            totalCustomers,
            totalItems,
            totalInvoices,
            salesAgg,
            todayAgg,
            lastInvoices
        ] = await Promise.all([
            Customer.countDocuments({ user: userId }),
            Item.countDocuments({ user: userId }),
            Invoice.countDocuments({ user: userId }),

            Invoice.aggregate([
                { $match: { user: userId } },
                { $group: { _id: null, totalSales: { $sum: "$grandTotal" } } }
            ]),

            Invoice.aggregate([
                {
                    $match: {
                        user: userId,
                        createdAt: { $gte: startOfDay }
                    }
                },
                { $group: { _id: null, todaySales: { $sum: "$grandTotal" } } }
            ]),

            Invoice.find({ user: userId })
                .sort({ createdAt: -1 })
                .limit(5)
                .populate("customer", "name")
        ]);

        const formattedInvoices = lastInvoices.map(inv => ({
            _id: inv._id,
            invoiceNumber: inv.invoiceNumber,
            customerName: inv.customer?.name || "N/A",
            amount: inv.grandTotal,
            status: "Generated",
            createdAt: inv.createdAt
        }));

        res.status(200).json({
            success: true,
            data: {
                totalCustomers,
                totalItems,
                totalInvoices,
                totalSales: salesAgg[0]?.totalSales || 0,
                todaySales: todayAgg[0]?.todaySales || 0,
                lastFiveInvoices: formattedInvoices
            }
        });
    } catch (error) {
        next(error);
    }
};

