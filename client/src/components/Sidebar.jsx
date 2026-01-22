import { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";

import {
    LayoutDashboard,
    Users,
    Package,
    FileText,
    BarChart3,
    LogOut,
    Menu,
    X,
} from "lucide-react";

const Sidebar = ({ onHoverChange }) => {
    const navigate = useNavigate();

    const [isMobileOpen, setIsMobileOpen] = useState(false);

    const handleLogout = () => {
        // logout();
        navigate("/login");
        setIsMobileOpen(false);
    };

    const navItems = [
        { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard, end: true },
        { to: "/dashboard/customers", label: "Customers", icon: Users },
        { to: "/dashboard/items", label: "Items", icon: Package },
        { to: "/dashboard/invoices", label: "Invoices", icon: FileText },
        { to: "/dashboard/reports", label: "Reports", icon: BarChart3 },
    ];

    const linkClass = ({ isActive }) =>
        `group flex items-center gap-3 px-3 py-3 rounded-lg transition-all duration-200
    ${isActive
            ? "bg-indigo-100 text-indigo-700 font-medium"
            : "text-gray-600 hover:bg-indigo-50 hover:text-indigo-700"
        }`;

    return (
        <>
            {/* Mobile Hamburger Button */}
            <button
                className="lg:hidden fixed top-4 left-4 z-50 p-3 bg-white rounded-full shadow-lg text-indigo-600 hover:bg-indigo-50 transition-colors"
                onClick={() => setIsMobileOpen(!isMobileOpen)}
            >
                {isMobileOpen ? <X size={26} /> : <Menu size={26} />}
            </button>

            {/* Sidebar */}
            <aside
                onMouseEnter={() => onHoverChange?.(true)}
                onMouseLeave={() => onHoverChange?.(false)}
                className={`
            fixed inset-y-0 left-0 z-40
            bg-white shadow-2xl
                    
            /* Default width + hover expand */
            w-16 lg:w-16
            group/sidebar
            hover:w-56 lg:group-hover/sidebar:w-56
                    
            /* Mobile override */
            ${isMobileOpen ? "w-64 translate-x-0!" : "-translate-x-full"}
                    
            /* Desktop always visible */
            lg:translate-x-0
                    
            transition-all duration-300 ease-in-out
            overflow-hidden
        `}
            >
                {/* Header / Logo */}
                <div className="p-4 flex items-center justify-center lg:justify-start">
                    <h2 className="text-xl font-bold text-indigo-700 whitespace-nowrap hidden lg:group-hover/sidebar:inline-block">
                        Billing Software
                    </h2>
                </div>

                {/* Navigation */}
                <nav className="mt-2 px-2 space-y-1">
                    {navItems.map((item) => (
                        <NavLink
                            key={item.to}
                            to={item.to}
                            end={item.end}
                            className={linkClass}
                            onClick={() => setIsMobileOpen(false)}
                        >
                            <item.icon
                                size={24}
                                className="min-w-6 shrink-0"
                                strokeWidth={2}
                            />
                            <span
                                className={`
    text-base font-medium
    ${isMobileOpen ? "inline-block" : "hidden"}
    lg:hidden
    lg:group-hover/sidebar:inline-block
    `}
                            >

                                {item.label}
                            </span>
                        </NavLink>
                    ))}
                </nav>

                {/* Logout Section */}
                <div className="mt-auto p-3">
                    <button
                        onClick={handleLogout}
                        className="w-full flex items-center gap-3 px-3 py-3 rounded-lg
              text-red-600 hover:bg-red-50 hover:text-red-700
              transition-colors duration-200"
                    >
                        <LogOut size={24} className="min-w-6" />
                        <span className="hidden lg:group-hover/sidebar:inline-block font-medium">
                            Logout
                        </span>
                    </button>
                </div>
            </aside>

            {/* Mobile Overlay */}
            {isMobileOpen && (
                <div
                    className="fixed inset-0 bg-black/40 backdrop-blur-sm z-30 lg:hidden transition-opacity duration-300"
                    onClick={() => setIsMobileOpen(false)}
                />
            )}
        </>
    );
};

export default Sidebar;