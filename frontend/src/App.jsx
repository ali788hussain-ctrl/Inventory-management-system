import {
  Navigate,
  Route,
  Routes,
} from "react-router-dom";

import DashboardLayout from "./layouts/DashboardLayout";
import ProtectedRoute from "./routes/ProtectedRoute";

import LoginPage from "./pages/Auth/LoginPage";
import DashboardPage from "./pages/Dashboard/DashboardPage";
import ProductsPage from "./pages/Products/ProductsPage";
import CategoriesPage from "./pages/Categories/CategoriesPage";
import SuppliersPage from "./pages/Suppliers/SuppliersPage";
import InventoryPage from "./pages/Inventory/InventoryPage";
import ReportsPage from "./pages/Reports/ReportsPage";

function App() {
  return (
    <Routes>
      <Route
        path="/login"
        element={<LoginPage />}
      />

      <Route element={<ProtectedRoute />}>
        <Route element={<DashboardLayout />}>
          <Route
            index
            element={
              <Navigate
                to="/dashboard"
                replace
              />
            }
          />

          <Route
            path="dashboard"
            element={<DashboardPage />}
          />

          <Route
            path="products"
            element={<ProductsPage />}
          />

          <Route
            path="categories"
            element={<CategoriesPage />}
          />

          <Route
            path="suppliers"
            element={<SuppliersPage />}
          />

          <Route
            path="inventory"
            element={<InventoryPage />}
          />

          <Route
            path="reports"
            element={<ReportsPage />}
          />
        </Route>
      </Route>

      <Route
        path="*"
        element={
          <Navigate
            to="/dashboard"
            replace
          />
        }
      />
    </Routes>
  );
}

export default App;