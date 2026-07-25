import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Card,
  CardContent,
  Chip,
  Divider,
  FormControl,
  Grid,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Skeleton,
  Snackbar,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";

import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";

import RefreshRoundedIcon from "@mui/icons-material/RefreshRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import WarningAmberRoundedIcon from "@mui/icons-material/WarningAmberRounded";
import RemoveShoppingCartOutlinedIcon from "@mui/icons-material/RemoveShoppingCartOutlined";
import ReceiptLongOutlinedIcon from "@mui/icons-material/ReceiptLongOutlined";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import DownloadRoundedIcon from "@mui/icons-material/DownloadRounded";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";

import reportService from "../../services/reportService";

const transactionTypeLabels = {
  STOCK_IN: "Stock In",
  STOCK_OUT: "Stock Out",
  ADJUSTMENT_IN: "Adjustment In",
  ADJUSTMENT_OUT: "Adjustment Out",
  RETURN_IN: "Return In",
  RETURN_OUT: "Return Out",
};

const chartColors = [
  "#24449A",
  "#16A34A",
  "#DC2626",
  "#F59E0B",
  "#7C3AED",
  "#0891B2",
];

function ReportsPage() {
  const [lowStock, setLowStock] = useState([]);
  const [outOfStock, setOutOfStock] = useState([]);

  const [inventoryValue, setInventoryValue] = useState({
    total_products: 0,
    total_quantity: 0,
    total_inventory_value: 0,
  });

  const [transactionSummary, setTransactionSummary] = useState({
    start_date: null,
    end_date: null,
    total_transactions: 0,
    transaction_types: [],
  });

  const [threshold, setThreshold] = useState(10);
  const [days, setDays] = useState(30);

  const [lowStockSearch, setLowStockSearch] = useState("");
  const [outOfStockSearch, setOutOfStockSearch] = useState("");

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [pageError, setPageError] = useState("");

  const [notification, setNotification] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const loadReports = useCallback(
    async ({ showRefreshing = false } = {}) => {
      try {
        if (showRefreshing) {
          setRefreshing(true);
        } else {
          setLoading(true);
        }

        setPageError("");

        const reports = await reportService.getAllReports({
          threshold,
          days,
        });

        setLowStock(reports.lowStock);
        setOutOfStock(reports.outOfStock);

        setInventoryValue({
          total_products:
            reports.inventoryValue?.total_products ?? 0,
          total_quantity:
            reports.inventoryValue?.total_quantity ?? 0,
          total_inventory_value:
            reports.inventoryValue?.total_inventory_value ?? 0,
        });

        setTransactionSummary({
          start_date:
            reports.transactionSummary?.start_date ?? null,
          end_date:
            reports.transactionSummary?.end_date ?? null,
          total_transactions:
            reports.transactionSummary?.total_transactions ?? 0,
          transaction_types: Array.isArray(
            reports.transactionSummary?.transaction_types
          )
            ? reports.transactionSummary.transaction_types
            : [],
        });

        if (showRefreshing) {
          setNotification({
            open: true,
            severity: "success",
            message: "Reports refreshed successfully.",
          });
        }
      } catch (error) {
        const detail = error.response?.data?.detail;

        setPageError(
          typeof detail === "string"
            ? detail
            : "Unable to load report data. Please try again."
        );
      } finally {
        setLoading(false);
        setRefreshing(false);
      }
    },
    [threshold, days]
  );

  useEffect(() => {
    loadReports();
  }, [loadReports]);

  const filteredLowStock = useMemo(() => {
    const query = lowStockSearch.trim().toLowerCase();

    if (!query) {
      return lowStock;
    }

    return lowStock.filter((product) => {
      return (
        product.name?.toLowerCase().includes(query) ||
        product.sku?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query)
      );
    });
  }, [lowStock, lowStockSearch]);

  const filteredOutOfStock = useMemo(() => {
    const query = outOfStockSearch.trim().toLowerCase();

    if (!query) {
      return outOfStock;
    }

    return outOfStock.filter((product) => {
      return (
        product.name?.toLowerCase().includes(query) ||
        product.sku?.toLowerCase().includes(query) ||
        product.category?.toLowerCase().includes(query)
      );
    });
  }, [outOfStock, outOfStockSearch]);

  const transactionChartData = useMemo(() => {
    return transactionSummary.transaction_types.map((item) => ({
      type:
        transactionTypeLabels[item.transaction_type] ??
        item.transaction_type,
      transactions: item.total_transactions ?? 0,
      quantity: item.total_quantity ?? 0,
    }));
  }, [transactionSummary.transaction_types]);

  const totalIncomingQuantity = useMemo(() => {
    return transactionSummary.transaction_types.reduce(
      (total, item) => {
        const incomingTypes = [
          "STOCK_IN",
          "ADJUSTMENT_IN",
          "RETURN_IN",
        ];

        if (incomingTypes.includes(item.transaction_type)) {
          return total + Number(item.total_quantity ?? 0);
        }

        return total;
      },
      0
    );
  }, [transactionSummary.transaction_types]);

  const totalOutgoingQuantity = useMemo(() => {
    return transactionSummary.transaction_types.reduce(
      (total, item) => {
        const outgoingTypes = [
          "STOCK_OUT",
          "ADJUSTMENT_OUT",
          "RETURN_OUT",
        ];

        if (outgoingTypes.includes(item.transaction_type)) {
          return total + Number(item.total_quantity ?? 0);
        }

        return total;
      },
      0
    );
  }, [transactionSummary.transaction_types]);

  const stockMovementData = useMemo(
    () => [
      {
        name: "Incoming",
        value: totalIncomingQuantity,
      },
      {
        name: "Outgoing",
        value: totalOutgoingQuantity,
      },
    ],
    [totalIncomingQuantity, totalOutgoingQuantity]
  );

  const formatCurrency = (value) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(Number(value ?? 0));
  };

  const formatNumber = (value) => {
    return new Intl.NumberFormat("en-US").format(
      Number(value ?? 0)
    );
  };

  const formatDate = (value) => {
    if (!value) {
      return "—";
    }

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
      return "—";
    }

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(date);
  };

  const getInitials = (name = "") => {
    return name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();
  };

  const escapeCsvValue = (value) => {
    const stringValue = String(value ?? "");

    return `"${stringValue.replaceAll('"', '""')}"`;
  };

  const downloadCsv = (filename, headers, rows) => {
    const csvContent = [
      headers.map(escapeCsvValue).join(","),
      ...rows.map((row) =>
        row.map(escapeCsvValue).join(",")
      ),
    ].join("\n");

    const blob = new Blob([csvContent], {
      type: "text/csv;charset=utf-8;",
    });

    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = filename;

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    URL.revokeObjectURL(url);

    setNotification({
      open: true,
      severity: "success",
      message: `${filename} downloaded successfully.`,
    });
  };

  const exportLowStock = () => {
    downloadCsv(
      "low-stock-report.csv",
      [
        "Product",
        "SKU",
        "Category",
        "Quantity",
        "Price",
        "Status",
      ],
      filteredLowStock.map((product) => [
        product.name,
        product.sku,
        product.category,
        product.quantity,
        product.price,
        product.is_active ? "Active" : "Inactive",
      ])
    );
  };

  const exportOutOfStock = () => {
    downloadCsv(
      "out-of-stock-report.csv",
      [
        "Product",
        "SKU",
        "Category",
        "Quantity",
        "Status",
      ],
      filteredOutOfStock.map((product) => [
        product.name,
        product.sku,
        product.category,
        product.quantity,
        product.is_active ? "Active" : "Inactive",
      ])
    );
  };

  const reportCards = [
    {
      title: "Inventory Value",
      value: formatCurrency(
        inventoryValue.total_inventory_value
      ),
      description: `${formatNumber(
        inventoryValue.total_quantity
      )} total units`,
      icon: <Inventory2OutlinedIcon />,
    },
    {
      title: "Total Products",
      value: formatNumber(inventoryValue.total_products),
      description: "Products currently tracked",
      icon: <CategoryOutlinedIcon />,
    },
    {
      title: "Low Stock",
      value: formatNumber(lowStock.length),
      description: `At or below ${threshold} units`,
      icon: <WarningAmberRoundedIcon />,
    },
    {
      title: "Out of Stock",
      value: formatNumber(outOfStock.length),
      description: "Products requiring attention",
      icon: <RemoveShoppingCartOutlinedIcon />,
    },
    {
      title: "Transactions",
      value: formatNumber(
        transactionSummary.total_transactions
      ),
      description: `During the last ${days} days`,
      icon: <ReceiptLongOutlinedIcon />,
    },
  ];

  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{ xs: "stretch", md: "center" }}
        justifyContent="space-between"
        spacing={2}
        mb={3}
      >
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Reports
          </Typography>

          <Typography color="text.secondary" mt={0.5}>
            Review inventory value, stock alerts, and transaction
            summaries.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<RefreshRoundedIcon />}
          disabled={loading || refreshing}
          onClick={() =>
            loadReports({
              showRefreshing: true,
            })
          }
          sx={{
            flexShrink: 0,
            whiteSpace: "nowrap",
          }}
        >
          {refreshing ? "Refreshing..." : "Refresh Reports"}
        </Button>
      </Stack>

      {pageError && (
        <Alert
          severity="error"
          sx={{ mb: 3 }}
          action={
            <Button
              color="inherit"
              size="small"
              onClick={() => loadReports()}
            >
              Retry
            </Button>
          }
        >
          {pageError}
        </Alert>
      )}

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack
            direction={{ xs: "column", md: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", md: "center" }}
          >
            <TextField
              type="number"
              size="small"
              label="Low-stock threshold"
              value={threshold}
              inputProps={{
                min: 0,
                step: 1,
              }}
              onChange={(event) => {
                const value = Number(event.target.value);

                setThreshold(
                  Number.isNaN(value) ? 0 : Math.max(value, 0)
                );
              }}
              sx={{ minWidth: 210 }}
            />

            <FormControl
              size="small"
              sx={{ minWidth: 210 }}
            >
              <InputLabel>Transaction period</InputLabel>

              <Select
                label="Transaction period"
                value={days}
                onChange={(event) =>
                  setDays(Number(event.target.value))
                }
              >
                <MenuItem value={7}>Last 7 days</MenuItem>
                <MenuItem value={14}>Last 14 days</MenuItem>
                <MenuItem value={30}>Last 30 days</MenuItem>
                <MenuItem value={60}>Last 60 days</MenuItem>
                <MenuItem value={90}>Last 90 days</MenuItem>
                <MenuItem value={180}>Last 180 days</MenuItem>
                <MenuItem value={365}>Last 365 days</MenuItem>
              </Select>
            </FormControl>

            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ ml: { md: "auto" } }}
            >
              Transaction period:{" "}
              {formatDate(transactionSummary.start_date)} –{" "}
              {formatDate(transactionSummary.end_date)}
            </Typography>
          </Stack>
        </CardContent>
      </Card>

      <Grid container spacing={2.5} mb={3}>
        {reportCards.map((card) => (
          <Grid
            item
            xs={12}
            sm={6}
            lg={2.4}
            key={card.title}
          >
            <Card sx={{ height: "100%" }}>
              <CardContent>
                {loading ? (
                  <Stack spacing={1.5}>
                    <Skeleton variant="circular" width={44} height={44} />
                    <Skeleton width="70%" />
                    <Skeleton width="50%" />
                  </Stack>
                ) : (
                  <Stack spacing={2}>
                    <Avatar
                      sx={{
                        bgcolor: "primary.main",
                        width: 44,
                        height: 44,
                      }}
                    >
                      {card.icon}
                    </Avatar>

                    <Box>
                      <Typography
                        color="text.secondary"
                        variant="body2"
                      >
                        {card.title}
                      </Typography>

                      <Typography
                        variant="h5"
                        fontWeight={800}
                        mt={0.5}
                      >
                        {card.value}
                      </Typography>

                      <Typography
                        variant="caption"
                        color="text.secondary"
                      >
                        {card.description}
                      </Typography>
                    </Box>
                  </Stack>
                )}
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      <Grid container spacing={3} mb={3}>
        <Grid item xs={12} lg={8}>
          <Card sx={{ height: 420 }}>
            <CardContent sx={{ height: "100%" }}>
              <Stack spacing={0.5} mb={2}>
                <Typography variant="h6" fontWeight={700}>
                  Transaction Summary
                </Typography>

                <Typography
                  variant="body2"
                  color="text.secondary"
                >
                  Transactions and quantities grouped by type.
                </Typography>
              </Stack>

              <Box sx={{ height: 315 }}>
                {loading ? (
                  <Skeleton
                    variant="rounded"
                    width="100%"
                    height="100%"
                  />
                ) : transactionChartData.length === 0 ? (
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    height="100%"
                    spacing={1}
                  >
                    <ReceiptLongOutlinedIcon
                      sx={{
                        fontSize: 48,
                        color: "text.disabled",
                      }}
                    />

                    <Typography fontWeight={700}>
                      No transactions found
                    </Typography>

                    <Typography
                      variant="body2"
                      color="text.secondary"
                    >
                      There are no transactions in this period.
                    </Typography>
                  </Stack>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={transactionChartData}>
                      <CartesianGrid
                        strokeDasharray="3 3"
                        vertical={false}
                      />

                      <XAxis
                        dataKey="type"
                        tick={{ fontSize: 12 }}
                        interval={0}
                        angle={-15}
                        textAnchor="end"
                        height={65}
                      />

                      <YAxis allowDecimals={false} />

                      <RechartsTooltip />

                      <Legend />

                      <Bar
                        dataKey="transactions"
                        name="Transactions"
                        fill="#24449A"
                        radius={[6, 6, 0, 0]}
                      />

                      <Bar
                        dataKey="quantity"
                        name="Quantity"
                        fill="#16A34A"
                        radius={[6, 6, 0, 0]}
                      />
                    </BarChart>
                  </ResponsiveContainer>
                )}
              </Box>
            </CardContent>
          </Card>
        </Grid>

        <Grid item xs={12} lg={4}>
          <Card sx={{ height: 420 }}>
            <CardContent sx={{ height: "100%" }}>
              <Typography variant="h6" fontWeight={700}>
                Stock Movement
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
                mb={2}
              >
                Incoming and outgoing quantities.
              </Typography>

              <Box sx={{ height: 260 }}>
                {loading ? (
                  <Skeleton
                    variant="circular"
                    width={230}
                    height={230}
                    sx={{ mx: "auto" }}
                  />
                ) : totalIncomingQuantity === 0 &&
                  totalOutgoingQuantity === 0 ? (
                  <Stack
                    alignItems="center"
                    justifyContent="center"
                    height="100%"
                    spacing={1}
                  >
                    <Inventory2OutlinedIcon
                      sx={{
                        fontSize: 48,
                        color: "text.disabled",
                      }}
                    />

                    <Typography fontWeight={700}>
                      No stock movement
                    </Typography>
                  </Stack>
                ) : (
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={stockMovementData}
                        dataKey="value"
                        nameKey="name"
                        innerRadius={65}
                        outerRadius={95}
                        paddingAngle={4}
                      >
                        {stockMovementData.map((entry, index) => (
                          <Cell
                            key={entry.name}
                            fill={chartColors[index]}
                          />
                        ))}
                      </Pie>

                      <RechartsTooltip />

                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                )}
              </Box>

              <Stack
                direction="row"
                justifyContent="space-around"
                mt={1}
              >
                <Box textAlign="center">
                  <Typography
                    variant="h6"
                    fontWeight={800}
                    color="success.main"
                  >
                    {formatNumber(totalIncomingQuantity)}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Incoming
                  </Typography>
                </Box>

                <Box textAlign="center">
                  <Typography
                    variant="h6"
                    fontWeight={800}
                    color="error.main"
                  >
                    {formatNumber(totalOutgoingQuantity)}
                  </Typography>

                  <Typography
                    variant="caption"
                    color="text.secondary"
                  >
                    Outgoing
                  </Typography>
                </Box>
              </Stack>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems={{ xs: "stretch", md: "center" }}
            justifyContent="space-between"
            spacing={2}
          >
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Low-Stock Products
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Products with quantities at or below {threshold}.
              </Typography>
            </Box>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
            >
              <TextField
                size="small"
                placeholder="Search low-stock products"
                value={lowStockSearch}
                onChange={(event) =>
                  setLowStockSearch(event.target.value)
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                variant="outlined"
                startIcon={<DownloadRoundedIcon />}
                disabled={filteredLowStock.length === 0}
                onClick={exportLowStock}
              >
                Export CSV
              </Button>
            </Stack>
          </Stack>
        </CardContent>

        <Divider />

        <TableContainer>
          <Table sx={{ minWidth: 850 }}>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Stock Value</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading &&
                Array.from({ length: 4 }).map((_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {Array.from({ length: 6 }).map(
                      (__, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <Skeleton />
                        </TableCell>
                      )
                    )}
                  </TableRow>
                ))}

              {!loading &&
                filteredLowStock.map((product) => (
                  <TableRow key={product.id} hover>
                    <TableCell>
                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                      >
                        <Avatar
                          sx={{
                            bgcolor: "warning.main",
                            width: 40,
                            height: 40,
                            fontWeight: 700,
                          }}
                        >
                          {getInitials(product.name) || "P"}
                        </Avatar>

                        <Box>
                          <Typography fontWeight={700}>
                            {product.name}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            {product.sku}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      {product.category || "—"}
                    </TableCell>

                    <TableCell align="right">
                      <Typography
                        fontWeight={700}
                        color={
                          product.quantity === 0
                            ? "error.main"
                            : "warning.main"
                        }
                      >
                        {formatNumber(product.quantity)}
                      </Typography>
                    </TableCell>

                    <TableCell align="right">
                      {formatCurrency(product.price)}
                    </TableCell>

                    <TableCell align="right">
                      {formatCurrency(
                        Number(product.quantity ?? 0) *
                          Number(product.price ?? 0)
                      )}
                    </TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={
                          product.is_active ? "Active" : "Inactive"
                        }
                        color={
                          product.is_active ? "success" : "default"
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}

              {!loading && filteredLowStock.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Stack
                      alignItems="center"
                      justifyContent="center"
                      spacing={1}
                      sx={{ py: 7 }}
                    >
                      <WarningAmberRoundedIcon
                        sx={{
                          fontSize: 50,
                          color: "text.disabled",
                        }}
                      />

                      <Typography variant="h6" fontWeight={700}>
                        No low-stock products
                      </Typography>

                      <Typography color="text.secondary">
                        No products match the current threshold or
                        search.
                      </Typography>
                    </Stack>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Card>
        <CardContent>
          <Stack
            direction={{ xs: "column", md: "row" }}
            alignItems={{ xs: "stretch", md: "center" }}
            justifyContent="space-between"
            spacing={2}
          >
            <Box>
              <Typography variant="h6" fontWeight={700}>
                Out-of-Stock Products
              </Typography>

              <Typography
                variant="body2"
                color="text.secondary"
              >
                Products with no available inventory.
              </Typography>
            </Box>

            <Stack
              direction={{ xs: "column", sm: "row" }}
              spacing={1.5}
            >
              <TextField
                size="small"
                placeholder="Search out-of-stock products"
                value={outOfStockSearch}
                onChange={(event) =>
                  setOutOfStockSearch(event.target.value)
                }
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <SearchRoundedIcon color="action" />
                    </InputAdornment>
                  ),
                }}
              />

              <Button
                variant="outlined"
                startIcon={<DownloadRoundedIcon />}
                disabled={filteredOutOfStock.length === 0}
                onClick={exportOutOfStock}
              >
                Export CSV
              </Button>
            </Stack>
          </Stack>
        </CardContent>

        <Divider />

        <TableContainer>
          <Table sx={{ minWidth: 750 }}>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell>Status</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading &&
                Array.from({ length: 4 }).map((_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {Array.from({ length: 4 }).map(
                      (__, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <Skeleton />
                        </TableCell>
                      )
                    )}
                  </TableRow>
                ))}

              {!loading &&
                filteredOutOfStock.map((product) => (
                  <TableRow key={product.id} hover>
                    <TableCell>
                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                      >
                        <Avatar
                          sx={{
                            bgcolor: "error.main",
                            width: 40,
                            height: 40,
                            fontWeight: 700,
                          }}
                        >
                          {getInitials(product.name) || "P"}
                        </Avatar>

                        <Box>
                          <Typography fontWeight={700}>
                            {product.name}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            {product.sku}
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      {product.category || "—"}
                    </TableCell>

                    <TableCell align="right">
                      <Typography
                        fontWeight={800}
                        color="error.main"
                      >
                        {formatNumber(product.quantity)}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        size="small"
                        label={
                          product.is_active ? "Active" : "Inactive"
                        }
                        color={
                          product.is_active ? "success" : "default"
                        }
                      />
                    </TableCell>
                  </TableRow>
                ))}

              {!loading &&
                filteredOutOfStock.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={4}>
                      <Stack
                        alignItems="center"
                        justifyContent="center"
                        spacing={1}
                        sx={{ py: 7 }}
                      >
                        <RemoveShoppingCartOutlinedIcon
                          sx={{
                            fontSize: 50,
                            color: "text.disabled",
                          }}
                        />

                        <Typography variant="h6" fontWeight={700}>
                          No out-of-stock products
                        </Typography>

                        <Typography color="text.secondary">
                          All active products currently have inventory.
                        </Typography>
                      </Stack>
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </TableContainer>
      </Card>

      <Snackbar
        open={notification.open}
        autoHideDuration={3500}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        onClose={() =>
          setNotification((current) => ({
            ...current,
            open: false,
          }))
        }
      >
        <Alert
          severity={notification.severity}
          variant="filled"
          onClose={() =>
            setNotification((current) => ({
              ...current,
              open: false,
            }))
          }
        >
          {notification.message}
        </Alert>
      </Snackbar>
    </Box>
  );
}

export default ReportsPage;