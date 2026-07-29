import {
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

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
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Pagination,
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
import { alpha } from "@mui/material/styles";
import { AddOutlined } from "@mui/icons-material";
import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import VisibilityOutlinedIcon from "@mui/icons-material/VisibilityOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import ArrowDownwardRoundedIcon from "@mui/icons-material/ArrowDownwardRounded";
import ArrowUpwardRoundedIcon from "@mui/icons-material/ArrowUpwardRounded";
import FilterAltOffRoundedIcon from "@mui/icons-material/FilterAltOffRounded";

import inventoryService from "../../services/inventoryService";
import TransactionFormDialog from "../../components/inventory/TransactionFormDialog";
import TransactionDetailsDialog from "../../components/inventory/TransactionDetailsDialog";

const ACCENT = "#4F46E5";

const transactionTypeOptions = [
  { value: "", label: "All transaction types" },
  { value: "STOCK_IN", label: "Stock In" },
  { value: "STOCK_OUT", label: "Stock Out" },
  { value: "ADJUSTMENT_IN", label: "Adjustment In" },
  { value: "ADJUSTMENT_OUT", label: "Adjustment Out" },
  { value: "RETURN_IN", label: "Return In" },
  { value: "RETURN_OUT", label: "Return Out" },
];

const typeLabels = {
  STOCK_IN: "Stock In",
  STOCK_OUT: "Stock Out",
  ADJUSTMENT_IN: "Adjustment In",
  ADJUSTMENT_OUT: "Adjustment Out",
  RETURN_IN: "Return In",
  RETURN_OUT: "Return Out",
};

function InventoryPage() {
  const [transactions, setTransactions] = useState([]);
  const [products, setProducts] = useState([]);
  const [suppliers, setSuppliers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [search, setSearch] = useState("");
  const [productFilter, setProductFilter] = useState("");
  const [typeFilter, setTypeFilter] = useState("");

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [formOpen, setFormOpen] = useState(false);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const [detailsTransaction, setDetailsTransaction] =
    useState(null);

  const [notification, setNotification] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const loadData = useCallback(async () => {
    try {
      setLoading(true);
      setPageError("");

      const [transactionData, productData, supplierData] =
        await Promise.all([
          inventoryService.getAllTransactions(),
          inventoryService.getProducts(),
          inventoryService.getSuppliers(),
        ]);

      setTransactions(transactionData);
      setProducts(productData);
      setSuppliers(supplierData);
    } catch (error) {
      const detail = error.response?.data?.detail;

      setPageError(
        typeof detail === "string"
          ? detail
          : "Unable to load inventory transactions."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadData();
  }, [loadData]);

  const productMap = useMemo(
    () =>
      Object.fromEntries(
        products.map((product) => [product.id, product])
      ),
    [products]
  );

  const supplierMap = useMemo(
    () =>
      Object.fromEntries(
        suppliers.map((supplier) => [
          supplier.id,
          supplier,
        ])
      ),
    [suppliers]
  );

  const filteredTransactions = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    return transactions
      .filter((transaction) => {
        const product =
          productMap[transaction.product_id] ?? null;

        const supplier =
          supplierMap[transaction.supplier_id] ?? null;

        const matchesSearch =
          !normalizedSearch ||
          product?.name
            ?.toLowerCase()
            .includes(normalizedSearch) ||
          product?.sku
            ?.toLowerCase()
            .includes(normalizedSearch) ||
          supplier?.name
            ?.toLowerCase()
            .includes(normalizedSearch) ||
          transaction.reference
            ?.toLowerCase()
            .includes(normalizedSearch) ||
          transaction.notes
            ?.toLowerCase()
            .includes(normalizedSearch);

        const matchesProduct =
          !productFilter ||
          transaction.product_id === productFilter;

        const matchesType =
          !typeFilter ||
          transaction.transaction_type === typeFilter;

        return (
          matchesSearch &&
          matchesProduct &&
          matchesType
        );
      })
      .sort(
        (first, second) =>
          new Date(second.created_at).getTime() -
          new Date(first.created_at).getTime()
      );
  }, [
    transactions,
    productMap,
    supplierMap,
    search,
    productFilter,
    typeFilter,
  ]);

  const totalPages = Math.max(
    Math.ceil(
      filteredTransactions.length / rowsPerPage
    ),
    1
  );

  const visibleTransactions = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;

    return filteredTransactions.slice(
      startIndex,
      startIndex + rowsPerPage
    );
  }, [filteredTransactions, page, rowsPerPage]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const showNotification = (
    message,
    severity = "success"
  ) => {
    setNotification({
      open: true,
      severity,
      message,
    });
  };

  const handleCreateTransaction = async (payload) => {
    try {
      setFormLoading(true);
      setFormError("");

      await inventoryService.createTransaction(payload);

      setFormOpen(false);

      showNotification(
        "Inventory transaction recorded successfully."
      );

      await loadData();
    } catch (error) {
      const detail = error.response?.data?.detail;

      if (typeof detail === "string") {
        setFormError(detail);
      } else if (Array.isArray(detail)) {
        setFormError(
          detail
            .map((item) => item.msg)
            .filter(Boolean)
            .join(", ") ||
            "Unable to record the transaction."
        );
      } else {
        setFormError(
          "Unable to record the transaction. Check the values and try again."
        );
      }
    } finally {
      setFormLoading(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setProductFilter("");
    setTypeFilter("");
    setPage(1);
  };

  const hasFilters =
    Boolean(search) ||
    Boolean(productFilter) ||
    Boolean(typeFilter);

  const isIncoming = (transactionType) =>
    [
      "STOCK_IN",
      "ADJUSTMENT_IN",
      "RETURN_IN",
    ].includes(transactionType);

  const formatDate = (value) => {
    if (!value) {
      return "—";
    }

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "numeric",
      minute: "2-digit",
    }).format(new Date(value));
  };

  return (
    <Box sx={{ width: "100%", minWidth: 0 }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{ xs: "stretch", md: "center" }}
        justifyContent="space-between"
        spacing={1.5}
        mb={2}
      >
        <Box>
          <Typography
            variant="caption"
            sx={{
              display: "block",
              color: ACCENT,
              fontWeight: 750,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
              mb: 0.5,
            }}
          >
            Stock Ledger
          </Typography>

          <Typography variant="h4" fontWeight={800} letterSpacing="-0.02em">
            Inventory Transactions
          </Typography>

          <Typography color="text.secondary" mt={0.5}>
            Record and review stock additions, removals,
            returns, and inventory adjustments.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={() => {
            setFormError("");
            setFormOpen(true);
          }}
          sx={{
            flexShrink: 0,
            minWidth: "auto",
            height: 40,
            px: 2.25,
            py: 0,
            borderRadius: 2,
            whiteSpace: "nowrap",
            bgcolor: ACCENT,
            fontSize: "0.84rem",
            fontWeight: 700,
            lineHeight: 1,
            textTransform: "none",
            boxShadow: "0 4px 10px rgba(79, 70, 229, 0.18)",
            "& .MuiButton-startIcon": {
              mr: 0.75,
              "& svg": { fontSize: 18 },
            },
            "&:hover": {
              bgcolor: "#4338CA",
              boxShadow: "0 5px 12px rgba(79, 70, 229, 0.24)",
            },
          }}
        >
          Record Transaction
        </Button>
      </Stack>

      <Card>
        <CardContent>
          <Stack
            direction={{ xs: "column", lg: "row" }}
            spacing={2}
            alignItems={{ xs: "stretch", lg: "center" }}
          >
            <TextField
              value={search}
              onChange={(event) => {
                setSearch(event.target.value);
                setPage(1);
              }}
              size="small"
              placeholder="Search product, SKU, supplier, reference, or notes"
              sx={{
                flexGrow: 1,
                minWidth: { lg: 350 },
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <FormControl
              size="small"
              sx={{ minWidth: 200 }}
            >
              <InputLabel>Product</InputLabel>

              <Select
                value={productFilter}
                label="Product"
                onChange={(event) => {
                  setProductFilter(event.target.value);
                  setPage(1);
                }}
              >
                <MenuItem value="">All products</MenuItem>

                {products.map((product) => (
                  <MenuItem
                    key={product.id}
                    value={product.id}
                  >
                    {product.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <FormControl
              size="small"
              sx={{ minWidth: 190 }}
            >
              <InputLabel>Transaction type</InputLabel>

              <Select
                value={typeFilter}
                label="Transaction type"
                onChange={(event) => {
                  setTypeFilter(event.target.value);
                  setPage(1);
                }}
              >
                {transactionTypeOptions.map((type) => (
                  <MenuItem
                    key={type.value || "all"}
                    value={type.value}
                  >
                    {type.label}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Tooltip title="Clear filters">
              <span>
                <IconButton
                  disabled={!hasFilters}
                  onClick={clearFilters}
                  sx={{
                    border: "1px solid",
                    borderColor: "divider",
                    borderRadius: 2,
                  }}
                >
                  <FilterAltOffRoundedIcon />
                </IconButton>
              </span>
            </Tooltip>
          </Stack>
        </CardContent>

        <Divider />

        {pageError && (
          <Alert
            severity="error"
            sx={{ m: 2 }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={loadData}
              >
                Retry
              </Button>
            }
          >
            {pageError}
          </Alert>
        )}

        <TableContainer>
          <Table sx={{ minWidth: 1100 }}>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>Type</TableCell>
                <TableCell align="right">
                  Quantity
                </TableCell>
                <TableCell align="right">
                  Previous
                </TableCell>
                <TableCell align="right">
                  New
                </TableCell>
                <TableCell>Supplier</TableCell>
                <TableCell>Reference</TableCell>
                <TableCell>Date</TableCell>
                <TableCell align="right">
                  Details
                </TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading &&
                Array.from({
                  length: rowsPerPage,
                }).map((_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {Array.from({ length: 9 }).map(
                      (__, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <Skeleton />
                        </TableCell>
                      )
                    )}
                  </TableRow>
                ))}

              {!loading &&
                visibleTransactions.map((transaction) => {
                  const product =
                    productMap[transaction.product_id];

                  const supplier =
                    supplierMap[transaction.supplier_id];

                  const incoming = isIncoming(
                    transaction.transaction_type
                  );

                  return (
                    <TableRow
                      key={transaction.id}
                      hover
                    >
                      <TableCell>
                        <Stack
                          direction="row"
                          spacing={1.5}
                          alignItems="center"
                        >
                          <Avatar
                            sx={{
                              width: 40,
                              height: 40,
                              bgcolor: alpha(ACCENT, 0.14),
                              color: ACCENT,
                            }}
                          >
                            <Inventory2OutlinedIcon fontSize="small" />
                          </Avatar>

                          <Box>
                            <Typography fontWeight={700}>
                              {product?.name ??
                                "Unknown product"}
                            </Typography>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                            >
                              {product?.sku ??
                                transaction.product_id}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Chip
                          size="small"
                          icon={
                            incoming ? (
                              <ArrowDownwardRoundedIcon />
                            ) : (
                              <ArrowUpwardRoundedIcon />
                            )
                          }
                          label={
                            typeLabels[
                              transaction.transaction_type
                            ] ??
                            transaction.transaction_type
                          }
                          color={
                            incoming ? "success" : "error"
                          }
                          variant="outlined"
                        />
                      </TableCell>

                      <TableCell align="right">
                        <Typography
                          fontWeight={700}
                          color={
                            incoming
                              ? "success.main"
                              : "error.main"
                          }
                        >
                          {incoming ? "+" : "-"}
                          {transaction.quantity}
                        </Typography>
                      </TableCell>

                      <TableCell align="right" sx={{ color: "text.secondary" }}>
                        {transaction.previous_quantity}
                      </TableCell>

                      <TableCell align="right">
                        <Typography fontWeight={700}>
                          {transaction.new_quantity}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        {supplier?.name ?? "—"}
                      </TableCell>

                      <TableCell>
                        {transaction.reference || "—"}
                      </TableCell>

                      <TableCell sx={{ color: "text.secondary" }}>
                        {formatDate(
                          transaction.created_at
                        )}
                      </TableCell>

                      <TableCell align="right">
                        <Tooltip title="View details">
                          <IconButton
                            size="small"
                            onClick={() =>
                              setDetailsTransaction(
                                transaction
                              )
                            }
                          >
                            <VisibilityOutlinedIcon />
                          </IconButton>
                        </Tooltip>
                      </TableCell>
                    </TableRow>
                  );
                })}

              {!loading &&
                visibleTransactions.length === 0 && (
                  <TableRow>
                    <TableCell colSpan={9}>
                      <Stack
                        alignItems="center"
                        spacing={1.5}
                        sx={{ py: 8 }}
                      >
                        <Box
                          sx={{
                            width: 72,
                            height: 72,
                            borderRadius: "50%",
                            display: "grid",
                            placeItems: "center",
                            bgcolor: alpha(ACCENT, 0.1),
                            color: ACCENT,
                          }}
                        >
                          <Inventory2OutlinedIcon sx={{ fontSize: 32 }} />
                        </Box>

                        <Typography
                          variant="h6"
                          fontWeight={750}
                        >
                          No inventory transactions found
                        </Typography>

                        <Typography
                          color="text.secondary"
                          textAlign="center"
                        >
                          Record a transaction or change the
                          current filters.
                        </Typography>

                        <Button
                          variant="contained"
                          startIcon={<AddRoundedIcon />}
                          onClick={() =>
                            setFormOpen(true)
                          }
                          sx={{
                            bgcolor: ACCENT,
                            "&:hover": { bgcolor: "#4338CA" },
                          }}
                        >
                          Record Transaction
                        </Button>
                      </Stack>
                    </TableCell>
                  </TableRow>
                )}
            </TableBody>
          </Table>
        </TableContainer>

        <Divider />

        <Stack
          direction={{ xs: "column", sm: "row" }}
          justifyContent="space-between"
          alignItems={{ xs: "stretch", sm: "center" }}
          spacing={2}
          sx={{ px: 3, py: 2 }}
        >
          <Typography
            variant="body2"
            color="text.secondary"
          >
            Showing {visibleTransactions.length} of{" "}
            {filteredTransactions.length} transactions
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "stretch", sm: "center" }}
            spacing={2}
          >
            <FormControl
              size="small"
              sx={{ minWidth: 105 }}
            >
              <InputLabel>Rows</InputLabel>

              <Select
                value={rowsPerPage}
                label="Rows"
                onChange={(event) => {
                  setRowsPerPage(
                    Number(event.target.value)
                  );
                  setPage(1);
                }}
              >
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={10}>10</MenuItem>
                <MenuItem value={20}>20</MenuItem>
                <MenuItem value={50}>50</MenuItem>
              </Select>
            </FormControl>

            <Pagination
              page={page}
              count={totalPages}
              color="primary"
              shape="rounded"
              onChange={(_, value) =>
                setPage(value)
              }
              disabled={
                loading || totalPages <= 1
              }
            />
          </Stack>
        </Stack>
      </Card>

      <TransactionFormDialog
        open={formOpen}
        products={products}
        suppliers={suppliers}
        loading={formLoading}
        error={formError}
        onClose={() => {
          if (!formLoading) {
            setFormOpen(false);
            setFormError("");
          }
        }}
        onSubmit={handleCreateTransaction}
      />

      <TransactionDetailsDialog
        open={Boolean(detailsTransaction)}
        transaction={detailsTransaction}
        productName={
          productMap[detailsTransaction?.product_id]
            ?.name ?? "Unknown product"
        }
        supplierName={
          supplierMap[
            detailsTransaction?.supplier_id
          ]?.name ?? ""
        }
        onClose={() =>
          setDetailsTransaction(null)
        }
      />

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

export default InventoryPage;