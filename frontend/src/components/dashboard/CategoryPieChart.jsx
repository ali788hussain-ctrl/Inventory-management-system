import {
  Box,
  Card,
  CardContent,
  Skeleton,
  Stack,
  Typography,
} from "@mui/material";
import {
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
} from "recharts";

const CHART_COLORS = ["#16A34A", "#DC2626", "#0284C7", "#D97706"];

const TRANSACTION_LABELS = {
  STOCK_IN: "Stock In",
  STOCK_OUT: "Stock Out",
  ADJUSTMENT_IN: "Adjustment In",
  ADJUSTMENT_OUT: "Adjustment Out",
};

function CategoryPieChart({ data = [], loading = false }) {
  const chartData = data.map((item) => ({
    name:
      TRANSACTION_LABELS[item.transaction_type] ??
      item.transaction_type.replaceAll("_", " "),
    value: item.total_transactions,
  }));

  return (
    <Card sx={{ height: "100%" }}>
      <CardContent sx={{ p: 3 }}>
        <Stack mb={2}>
          <Typography variant="h6" fontWeight={750}>
            Transaction Distribution
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Number of transactions by type
          </Typography>
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
              No transaction data available
            </Typography>
          </Box>
        ) : (
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
              <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                innerRadius={65}
                outerRadius={95}
                paddingAngle={4}
              >
                {chartData.map((entry, index) => (
                  <Cell
                    key={entry.name}
                    fill={CHART_COLORS[index % CHART_COLORS.length]}
                  />
                ))}
              </Pie>

              <Tooltip
                contentStyle={{
                  borderRadius: 10,
                  border: "1px solid #E2E8F0",
                  fontSize: "0.8rem",
                }}
              />
              <Legend verticalAlign="bottom" iconType="circle" />
            </PieChart>
          </ResponsiveContainer>
        )}
      </CardContent>
    </Card>
  );
}

export default CategoryPieChart;