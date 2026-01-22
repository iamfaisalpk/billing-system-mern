import { create } from "zustand";
import { getDashboardStats } from "../api/dashboard.api";

const useDashboardStore = create((set) => ({
    stats: null,
    loading: false,
    error: null,

    fetchStats: async () => {
        set({ loading: true });
        try {
            const data = await getDashboardStats();
            set({ stats: data, loading: false });
        } catch (error) {
            console.error("Failed to load dashboard stats:", error);
            set({ error: "Failed to load dashboard", loading: false });
        }
    }
}));

export default useDashboardStore;
