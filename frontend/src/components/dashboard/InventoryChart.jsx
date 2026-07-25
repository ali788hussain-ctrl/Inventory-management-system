import {
  Box,
  Card,
  CardContent,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const TRANSACTION_LABELS = {
  STOCK_IN: "Stock In",
  STOCK_OUT: "Stock Out",
  ADJUSTMENT_IN: "Adjustment In",
  ADJUSTMENT_OUT: "Adjustment Out",
};

function InventoryChart({ data = [], loading = false }) {
  const chartData = data.map((item) => ({
    name:
      TRANSACTION_LABELS[item.transaction_type] ??
      item.transaction_type.replaceAll("_", " "),
    quantity: item.total_quantity,
    transactions: item.total_transactions,
  }));

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        <Stack
          direction="row"
          justifyContent="space-between"
          alignItems="flex-start"
          mb={3}
        >
          <Box>
            <Typography variant="h6" fontWeight={700}>
              Inventory Movement
            </Typography>

            <Typography variant="body2" color="text.secondary">
              Quantity moved by transaction type during the last 30 days
            </Typography>
          </Box>
        </Stack>

        {loading ? (
          <Skeleton variant="rounded" height={300} />
        ) : chartData.length === 0 ? (
          <Box
            sx={{
              height: 300,
              display: "grid",
              placeItems: "center",
              border: "1px dashed",
              borderColor: "divider",
              borderRadius: 3,
            }}
          >
            <Typography color="text.secondary">
              No inventory movement available
            </Typography>
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <BarChart
              data={chartData}
              margin={{ top: 10, right: 10, left: -10, bottom: 0 }}
            >
              <CartesianGrid strokeDasharray="3 3" vertical={false} />

              <XAxis
                dataKey="name"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />

              <YAxis
                allowDecimals={false}
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 12 }}
              />

              <Tooltip
                cursor={{ fill: "rgba(148, 163, 184, 0.08)" }}
                formatter={(value, name) => [
                  value,
                  name === "quantity" ? "Quantity" : "Transactions",
                ]}
              />

              <Bar
                dataKey="quantity"
                radius={[8, 8, 0, 0]}
                maxBarSize={52}
              />
            </BarChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

export default InventoryChart;