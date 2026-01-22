import { useState } from "react";
import { Outlet } from "react-router-dom";
import Sidebar from "../components/Sidebar";

const Dashboard = () => {
    const [isSidebarHovered, setIsSidebarHovered] = useState(false);

    return (
        <div className="min-h-screen bg-linear-to-br from-indigo-50 via-blue-50 to-purple-50">
            <Sidebar onHoverChange={setIsSidebarHovered} />

            <main
                className={`
                    p-6 overflow-y-auto
                    transition-all duration-300
                    ml-0
                    lg:ml-16
                    ${isSidebarHovered ? 'lg:ml-56' : ''}
                `}
            >
                <Outlet />
            </main>
        </div>
    );
};

export default Dashboard;