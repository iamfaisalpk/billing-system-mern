import api from "./axios";

export const fetchDashboardStats = () =>
    api.get("/api/dashboard");
