import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Login from "./auth/Login";
import Register from "./auth/Register";
import ProtectedRoute from "./components/ProtectedRoute";
import DashboardHome from "./dashboard/DashboardHome";
import Customers from "./pages/Customers";
import Items from "./pages/Items";
import Invoices from "./pages/Invoices";
import Reports from "./pages/Reports";
import Dashboard from "./dashboard/Dashboard";

const router = createBrowserRouter([
  { path: "/", element: <Login /> },
  { path: "/login", element: <Login /> },
  { path: "/register", element: <Register /> },

  {
    path: "/dashboard",
    element: (
      <ProtectedRoute>
        <Dashboard />
      </ProtectedRoute>
    ),
    children: [
      { index: true, element: <DashboardHome /> },
      { path: "customers", element: <Customers /> },
      { path: "items", element: <Items /> },
      { path: "invoices", element: <Invoices /> },
      { path: "reports", element: <Reports /> },
    ],
  },

  { path: "*", element: <h2>404 – Page Not Found</h2> },
]);

const App = () => <RouterProvider router={router} />;

export default App;
