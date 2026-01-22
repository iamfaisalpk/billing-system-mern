import { create } from "zustand";
import { jwtDecode } from "jwt-decode";

const useAuthStore = create((set, get) => ({
    token: localStorage.getItem("token") || null,
    user: null,

    login: (token) => {
        try {
            const decoded = jwtDecode(token);

            localStorage.setItem("token", token);

            set({
                token,
                user: decoded,
            });

            console.log("Login success - token saved:", token.substring(0, 20) + "...");
        } catch (err) {
            console.error("Invalid token format:", err);
            // Optional: show toast/notification
        }
    },

    logout: () => {
        localStorage.removeItem("token");
        set({ token: null, user: null });
    },

    // This is very important!
    isAuthenticated: () => {
        const token = get().token || localStorage.getItem("token");

        if (!token) return false;

        try {
            const { exp } = jwtDecode(token);
            const isValid = Date.now() < exp * 1000;

            // If token expired → clean up
            if (!isValid) {
                localStorage.removeItem("token");
                set({ token: null, user: null });
            }

            return isValid;
        } catch (err) {
            console.error("Token decode failed:", err);
            localStorage.removeItem("token");
            return false;
        }
    },
}));

useAuthStore.getState().isAuthenticated();

export default useAuthStore;