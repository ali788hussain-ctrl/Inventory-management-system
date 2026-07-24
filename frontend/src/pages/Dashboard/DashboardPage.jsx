import { useEffect, useState } from "react";
import {
  Alert,
  Box,
  Button,
  Grid,
  Stack,
} from "@mui/material";
import {
  FiAlertTriangle,
  FiBox,
  FiLayers,
  FiPackage,
  FiRefreshCw,
  FiTruck,
} from "react-icons/fi";

import DashboardHeader from "../../components/dashboard/DashboardHeader";
import StatCard from "../../components/dashboard/StatCard";
import dashboardService from "../../services/dashboardService";

const initialStatistics = {
  total_products: 0,
  active_products: 0,
  total_categories: 0,
  total_suppliers: 0,
  total_stock: 0,
  low_stock_products: 0,
  recent_transactions: 0,
};

const DashboardPage = () => {
  const [statistics, setStatistics] = useState(initialStatistics);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardStatistics = async () => {
    try {
      setLoading(true);
      setError("");

      const data = await dashboardService.getDashboardStatistics();
      setStatistics(data);
    } catch (requestError) {
      console.error("Dashboard request failed:", requestError);

      setError(
        requestError.response?.data?.detail ||
          "Unable to load dashboard statistics. Please try again."
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardStatistics();
  }, []);

  return (
    <Box>
      <Stack
        direction={{ xs: "column", sm: "row" }}
        alignItems={{ xs: "flex-start", sm: "center" }}
        justifyContent="space-between"
        spacing={2}
        sx={{ mb: 4 }}
      >
        <DashboardHeader />

        <Button
          variant="outlined"
          startIcon={<FiRefreshCw />}
          onClick={loadDashboardStatistics}
          disabled={loading}
        >
          Refresh
        </Button>
      </Stack>

      {error && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={loadDashboardStatistics}
            >
              Retry
            </Button>
          }
        >
          {error}
        </Alert>
      )}

      <Grid container spacing={3}>
        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <StatCard
            title="Total Products"
            value={statistics.total_products.toLocaleString()}
            description={`${statistics.active_products.toLocaleString()} active products`}
            icon={<FiPackage />}
            loading={loading}
            accentColor="primary.main"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <StatCard
            title="Categories"
            value={statistics.total_categories.toLocaleString()}
            description="Product categories"
            icon={<FiLayers />}
            loading={loading}
            accentColor="info.main"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <StatCard
            title="Suppliers"
            value={statistics.total_suppliers.toLocaleString()}
            description="Registered suppliers"
            icon={<FiTruck />}
            loading={loading}
            accentColor="success.main"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6, xl: 3 }}>
          <StatCard
            title="Total Stock"
            value={statistics.total_stock.toLocaleString()}
            description="Units currently available"
            icon={<FiBox />}
            loading={loading}
            accentColor="secondary.main"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <StatCard
            title="Low-Stock Products"
            value={statistics.low_stock_products.toLocaleString()}
            description="Products requiring attention"
            icon={<FiAlertTriangle />}
            loading={loading}
            accentColor="warning.main"
          />
        </Grid>

        <Grid size={{ xs: 12, sm: 6 }}>
          <StatCard
            title="Recent Transactions"
            value={statistics.recent_transactions.toLocaleString()}
            description="Latest recorded inventory activity"
            icon={<FiRefreshCw />}
            loading={loading}
            accentColor="primary.main"
          />
        </Grid>
      </Grid>
    </Box>
  );
};

export default DashboardPage;