import { useCallback, useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Grid,
  Snackbar,
  Stack,
} from "@mui/material";
import Inventory2RoundedIcon from "@mui/icons-material/Inventory2Rounded";
import CategoryRoundedIcon from "@mui/icons-material/CategoryRounded";
import LocalShippingRoundedIcon from "@mui/icons-material/LocalShippingRounded";
import WarehouseRoundedIcon from "@mui/icons-material/WarehouseRounded";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import PaidRoundedIcon from "@mui/icons-material/PaidRounded";
import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatCard from "../../components/dashboard/StatCard";
import InventoryChart from "../../components/dashboard/InventoryChart";
import CategoryPieChart from "../../components/dashboard/CategoryPieChart";
import RecentTransactions from "../../components/dashboard/RecentTransactions";
import LowStockTable from "../../components/dashboard/LowStockTable";
import dashboardService from "../../services/dashboardService";

const initialDashboard = {
  total_products: 0,
  active_products: 0,
  total_categories: 0,
  total_suppliers: 0,
  total_stock: 0,
  low_stock_products: 0,
  recent_transactions: 0,
};

const initialInventoryValue = {
  total_products: 0,
  total_quantity: 0,
  total_inventory_value: 0,
};

function DashboardPage() {
  const [dashboard, setDashboard] = useState(initialDashboard);
  const [inventoryValue, setInventoryValue] = useState(initialInventoryValue);
  const [transactionSummary, setTransactionSummary] = useState({
    total_transactions: 0,
    transaction_types: [],
  });
  const [recentTransactions, setRecentTransactions] = useState([]);
  const [lowStockProducts, setLowStockProducts] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState("");

  const loadDashboard = useCallback(async (isRefresh = false) => {
    try {
      if (isRefresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError("");

      const [
        dashboardData,
        inventoryValueData,
        transactionSummaryData,
        recentTransactionsData,
        lowStockData,
      ] = await Promise.all([
        dashboardService.getDashboardStatistics(),
        dashboardService.getInventoryValue(),
        dashboardService.getTransactionSummary(30),
        dashboardService.getRecentTransactions(5),
        dashboardService.getLowStockProducts(10),
      ]);

      setDashboard(dashboardData);
      setInventoryValue(inventoryValueData);
      setTransactionSummary(transactionSummaryData);
      setRecentTransactions(recentTransactionsData);
      setLowStockProducts(lowStockData);
    } catch (err) {
      setError(
        err.response?.data?.detail ||
          "Unable to load dashboard information. Please try again."
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const currencyFormatter = new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  });

  return (
    <Box>
      <DashboardHeader />

      <Stack
        direction={{ xs: "column", sm: "row" }}
        justifyContent="flex-end"
        mb={3}
      >
        <Button
          variant="outlined"
          startIcon={<RefreshRoundedIcon />}
          disabled={refreshing}
          onClick={() => loadDashboard(true)}
        >
          {refreshing ? "Refreshing..." : "Refresh data"}
        </Button>
      </Stack>

      {error && (
        <Alert
          severity="error"
          action={
            <Button color="inherit" size="small" onClick={() => loadDashboard()}>
              Retry
            </Button>
          }
          sx={{ mb: 3 }}
        >
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, lg: 4, xl: 2 }}>
          <StatCard
            title="Total Products"
            value={dashboard.total_products}
            description={`${dashboard.active_products} currently active`}
            icon={<Inventory2RoundedIcon />}
            loading={loading}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 4, xl: 2 }}>
          <StatCard
            title="Categories"
            value={dashboard.total_categories}
            description="Product classifications"
            icon={<CategoryRoundedIcon />}
            loading={loading}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 4, xl: 2 }}>
          <StatCard
            title="Suppliers"
            value={dashboard.total_suppliers}
            description="Registered suppliers"
            icon={<LocalShippingRoundedIcon />}
            loading={loading}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 4, xl: 2 }}>
          <StatCard
            title="Total Stock"
            value={dashboard.total_stock}
            description="Units across inventory"
            icon={<WarehouseRoundedIcon />}
            loading={loading}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 4, xl: 2 }}>
          <StatCard
            title="Inventory Value"
            value={currencyFormatter.format(
              inventoryValue.total_inventory_value
            )}
            description={`${inventoryValue.total_quantity} valued units`}
            icon={<PaidRoundedIcon />}
            loading={loading}
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, lg: 4, xl: 2 }}>
          <StatCard
            title="Low Stock"
            value={dashboard.low_stock_products}
            description="Products requiring attention"
            icon={<WarningAmberRoundedIcon />}
            loading={loading}
          />
        </Grid>

        <Grid size={{ xs: 12, lg: 8 }}>
          <InventoryChart
            data={transactionSummary.transaction_types}
            loading={loading}
          />
        </Grid>

        <Grid size={{ xs: 12, lg: 4 }}>
          <CategoryPieChart
            data={transactionSummary.transaction_types}
            loading={loading}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <RecentTransactions
            transactions={recentTransactions}
            loading={loading}
          />
        </Grid>

        <Grid size={{ xs: 12 }}>
          <LowStockTable products={lowStockProducts} loading={loading} />
        </Grid>
      </Grid>

      <Snackbar
        open={refreshing}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert severity="info" variant="filled">
          Refreshing dashboard data…
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default DashboardPage;