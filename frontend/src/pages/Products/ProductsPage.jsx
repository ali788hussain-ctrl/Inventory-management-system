import { useCallback, useEffect, useMemo, useState } from "react";
import {
  Alert,
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
  Menu,
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

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import FilterAltOffRoundedIcon from "@mui/icons-material/FilterAltOffRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import RestoreRoundedIcon from "@mui/icons-material/RestoreRounded";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";

import productService from "../../services/productService";
import ProductFormDialog from "../../components/products/ProductFormDialog";
import ProductActionDialog from "../../components/products/ProductActionDialog";

const initialPagination = {
  total: 0,
  page: 1,
  limit: 10,
  pages: 0,
};

function ProductsPage() {
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(initialPagination);

  const [page, setPage] = useState(1);
  const [limit, setLimit] = useState(10);

  const [searchInput, setSearchInput] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [order, setOrder] = useState("desc");

  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [formDialog, setFormDialog] = useState({
    open: false,
    mode: "create",
    product: null,
  });

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const [actionDialog, setActionDialog] = useState({
    open: false,
    action: "deactivate",
    product: null,
  });

  const [actionLoading, setActionLoading] = useState(false);

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuProduct, setMenuProduct] = useState(null);

  const [notification, setNotification] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const loadProducts = useCallback(async () => {
    try {
      setLoading(true);
      setPageError("");

      const data = await productService.getProducts({
        page,
        limit,
        search,
        category,
        isActive: status,
        sortBy,
        order,
      });

      setProducts(data.items ?? []);
      setPagination({
        total: data.total ?? 0,
        page: data.page ?? 1,
        limit: data.limit ?? limit,
        pages: data.pages ?? 0,
      });
    } catch (error) {
      setPageError(
        error.response?.data?.detail ||
          "Unable to load products. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, [page, limit, search, category, status, sortBy, order]);

  useEffect(() => {
    loadProducts();
  }, [loadProducts]);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setPage(1);
      setSearch(searchInput.trim());
    }, 450);

    return () => clearTimeout(timeout);
  }, [searchInput]);

  const categoryOptions = useMemo(() => {
    return [...new Set(products.map((product) => product.category).filter(Boolean))]
      .sort((a, b) => a.localeCompare(b));
  }, [products]);

  const formatCurrency = (value) =>
    new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
      maximumFractionDigits: 2,
    }).format(value);

  const formatDate = (value) =>
    new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));

  const getStockStatus = (quantity) => {
    if (quantity === 0) {
      return {
        label: "Out of stock",
        color: "error",
      };
    }

    if (quantity <= 10) {
      return {
        label: "Low stock",
        color: "warning",
      };
    }

    return {
      label: "In stock",
      color: "success",
    };
  };

  const openCreateDialog = () => {
    setFormError("");
    setFormDialog({
      open: true,
      mode: "create",
      product: null,
    });
  };

  const openEditDialog = (product) => {
    setFormError("");
    setFormDialog({
      open: true,
      mode: "edit",
      product,
    });

    closeMenu();
  };

  const closeFormDialog = () => {
    if (formLoading) {
      return;
    }

    setFormDialog({
      open: false,
      mode: "create",
      product: null,
    });

    setFormError("");
  };

  const handleProductSubmit = async (payload) => {
    try {
      setFormLoading(true);
      setFormError("");

      if (formDialog.mode === "edit") {
        await productService.updateProduct(formDialog.product.id, payload);

        setNotification({
          open: true,
          severity: "success",
          message: "Product updated successfully.",
        });
      } else {
        await productService.createProduct(payload);

        setNotification({
          open: true,
          severity: "success",
          message: "Product created successfully.",
        });
      }

      closeFormDialog();
      await loadProducts();
    } catch (error) {
      const detail = error.response?.data?.detail;

      setFormError(
        typeof detail === "string"
          ? detail
          : "Unable to save the product. Please review the form and try again."
      );
    } finally {
      setFormLoading(false);
    }
  };

  const openMenu = (event, product) => {
    setMenuAnchor(event.currentTarget);
    setMenuProduct(product);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
    setMenuProduct(null);
  };

  const openActionDialog = (product, action) => {
    setActionDialog({
      open: true,
      action,
      product,
    });

    closeMenu();
  };

  const closeActionDialog = () => {
    if (actionLoading) {
      return;
    }

    setActionDialog({
      open: false,
      action: "deactivate",
      product: null,
    });
  };

  const handleProductAction = async () => {
    if (!actionDialog.product) {
      return;
    }

    try {
      setActionLoading(true);

      if (actionDialog.action === "restore") {
        await productService.restoreProduct(actionDialog.product.id);

        setNotification({
          open: true,
          severity: "success",
          message: "Product restored successfully.",
        });
      } else {
        await productService.deactivateProduct(actionDialog.product.id);

        setNotification({
          open: true,
          severity: "success",
          message: "Product deactivated successfully.",
        });
      }

      closeActionDialog();
      await loadProducts();
    } catch (error) {
      setNotification({
        open: true,
        severity: "error",
        message:
          error.response?.data?.detail ||
          "Unable to update product status.",
      });
    } finally {
      setActionLoading(false);
    }
  };

  const clearFilters = () => {
    setSearchInput("");
    setSearch("");
    setCategory("");
    setStatus("");
    setSortBy("created_at");
    setOrder("desc");
    setPage(1);
  };

  const hasFilters =
    Boolean(search) ||
    Boolean(category) ||
    status !== "" ||
    sortBy !== "created_at" ||
    order !== "desc";

  return (
    <Box>
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{ xs: "stretch", md: "center" }}
        justifyContent="space-between"
        spacing={2}
        mb={3}
      >
        <Box>
          <Typography variant="h4" fontWeight={800}>
            Products
          </Typography>

          <Typography color="text.secondary" mt={0.5}>
            Manage product details, pricing, stock levels, and availability.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={openCreateDialog}
          sx={{
            alignSelf: { xs: "stretch", md: "center" },
            px: 2.5,
          }}
        >
          Add Product
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
              value={searchInput}
              onChange={(event) => setSearchInput(event.target.value)}
              placeholder="Search by product name, SKU, or description"
              size="small"
              sx={{ minWidth: { lg: 330 }, flexGrow: 1 }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon color="action" />
                  </InputAdornment>
                ),
              }}
            />

            <TextField
              value={category}
              onChange={(event) => {
                setCategory(event.target.value);
                setPage(1);
              }}
              label="Category"
              size="small"
              sx={{ minWidth: 170 }}
              placeholder="Exact category"
            />

            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Status</InputLabel>

              <Select
                value={status}
                label="Status"
                onChange={(event) => {
                  setStatus(event.target.value);
                  setPage(1);
                }}
              >
                <MenuItem value="">All statuses</MenuItem>
                <MenuItem value={true}>Active</MenuItem>
                <MenuItem value={false}>Inactive</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 170 }}>
              <InputLabel>Sort by</InputLabel>

              <Select
                value={sortBy}
                label="Sort by"
                onChange={(event) => {
                  setSortBy(event.target.value);
                  setPage(1);
                }}
              >
                <MenuItem value="created_at">Date created</MenuItem>
                <MenuItem value="name">Product name</MenuItem>
                <MenuItem value="price">Price</MenuItem>
                <MenuItem value="quantity">Quantity</MenuItem>
              </Select>
            </FormControl>

            <FormControl size="small" sx={{ minWidth: 135 }}>
              <InputLabel>Order</InputLabel>

              <Select
                value={order}
                label="Order"
                onChange={(event) => {
                  setOrder(event.target.value);
                  setPage(1);
                }}
              >
                <MenuItem value="desc">Descending</MenuItem>
                <MenuItem value="asc">Ascending</MenuItem>
              </Select>
            </FormControl>

            <Tooltip title="Clear filters">
              <span>
                <IconButton
                  onClick={clearFilters}
                  disabled={!hasFilters}
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
            action={
              <Button color="inherit" size="small" onClick={loadProducts}>
                Retry
              </Button>
            }
            sx={{ m: 2 }}
          >
            {pageError}
          </Alert>
        )}

        <TableContainer>
          <Table sx={{ minWidth: 1050 }}>
            <TableHead>
              <TableRow>
                <TableCell>Product</TableCell>
                <TableCell>SKU</TableCell>
                <TableCell>Category</TableCell>
                <TableCell align="right">Price</TableCell>
                <TableCell align="right">Quantity</TableCell>
                <TableCell>Stock Status</TableCell>
                <TableCell>Availability</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading &&
                Array.from({ length: limit }).map((_, index) => (
                  <TableRow key={index}>
                    {Array.from({ length: 9 }).map((__, cellIndex) => (
                      <TableCell key={cellIndex}>
                        <Skeleton variant="text" />
                      </TableCell>
                    ))}
                  </TableRow>
                ))}

              {!loading &&
                products.map((product) => {
                  const stockStatus = getStockStatus(product.quantity);

                  return (
                    <TableRow key={product.id} hover>
                      <TableCell>
                        <Stack direction="row" spacing={1.5} alignItems="center">
                          <Box
                            sx={{
                              width: 42,
                              height: 42,
                              borderRadius: 2,
                              display: "grid",
                              placeItems: "center",
                              bgcolor: "action.hover",
                              color: "primary.main",
                              flexShrink: 0,
                            }}
                          >
                            <Inventory2OutlinedIcon />
                          </Box>

                          <Box sx={{ minWidth: 0 }}>
                            <Typography fontWeight={700} noWrap>
                              {product.name}
                            </Typography>

                            <Typography
                              variant="body2"
                              color="text.secondary"
                              noWrap
                              sx={{ maxWidth: 240 }}
                            >
                              {product.description}
                            </Typography>
                          </Box>
                        </Stack>
                      </TableCell>

                      <TableCell>
                        <Typography
                          variant="body2"
                          fontWeight={600}
                          sx={{ fontFamily: "monospace" }}
                        >
                          {product.sku}
                        </Typography>
                      </TableCell>

                      <TableCell>{product.category}</TableCell>

                      <TableCell align="right">
                        <Typography fontWeight={700}>
                          {formatCurrency(product.price)}
                        </Typography>
                      </TableCell>

                      <TableCell align="right">
                        <Typography fontWeight={700}>
                          {product.quantity}
                        </Typography>
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={stockStatus.label}
                          color={stockStatus.color}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>

                      <TableCell>
                        <Chip
                          label={product.is_active ? "Active" : "Inactive"}
                          color={product.is_active ? "success" : "default"}
                          size="small"
                        />
                      </TableCell>

                      <TableCell>{formatDate(product.created_at)}</TableCell>

                      <TableCell align="right">
                        <IconButton
                          size="small"
                          onClick={(event) => openMenu(event, product)}
                        >
                          <MoreVertRoundedIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  );
                })}

              {!loading && products.length === 0 && (
                <TableRow>
                  <TableCell colSpan={9}>
                    <Stack
                      alignItems="center"
                      justifyContent="center"
                      spacing={1.5}
                      sx={{ py: 8 }}
                    >
                      <Inventory2OutlinedIcon
                        sx={{
                          fontSize: 52,
                          color: "text.disabled",
                        }}
                      />

                      <Typography variant="h6" fontWeight={700}>
                        No products found
                      </Typography>

                      <Typography
                        color="text.secondary"
                        textAlign="center"
                        maxWidth={420}
                      >
                        Try changing your search or filters, or create a new
                        product.
                      </Typography>

                      <Button
                        variant="contained"
                        startIcon={<AddRoundedIcon />}
                        onClick={openCreateDialog}
                      >
                        Add Product
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
          alignItems="center"
          justifyContent="space-between"
          spacing={2}
          sx={{ px: 3, py: 2 }}
        >
          <Typography variant="body2" color="text.secondary">
            Showing {products.length} of {pagination.total} products
          </Typography>

          <Stack direction="row" alignItems="center" spacing={2}>
            <FormControl size="small" sx={{ minWidth: 105 }}>
              <InputLabel>Rows</InputLabel>

              <Select
                value={limit}
                label="Rows"
                onChange={(event) => {
                  setLimit(Number(event.target.value));
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
              count={Math.max(pagination.pages, 1)}
              color="primary"
              shape="rounded"
              onChange={(_, value) => setPage(value)}
              disabled={loading || pagination.pages <= 1}
            />
          </Stack>
        </Stack>
      </Card>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
      >
        <MenuItem onClick={() => openEditDialog(menuProduct)}>
          <EditRoundedIcon fontSize="small" sx={{ mr: 1.5 }} />
          Edit
        </MenuItem>

        {menuProduct?.is_active ? (
          <MenuItem
            onClick={() => openActionDialog(menuProduct, "deactivate")}
            sx={{ color: "error.main" }}
          >
            <DeleteOutlineRoundedIcon fontSize="small" sx={{ mr: 1.5 }} />
            Deactivate
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() => openActionDialog(menuProduct, "restore")}
            sx={{ color: "success.main" }}
          >
            <RestoreRoundedIcon fontSize="small" sx={{ mr: 1.5 }} />
            Restore
          </MenuItem>
        )}
      </Menu>

      <ProductFormDialog
        open={formDialog.open}
        mode={formDialog.mode}
        product={formDialog.product}
        loading={formLoading}
        error={formError}
        onClose={closeFormDialog}
        onSubmit={handleProductSubmit}
      />

      <ProductActionDialog
        open={actionDialog.open}
        action={actionDialog.action}
        productName={actionDialog.product?.name ?? ""}
        loading={actionLoading}
        onClose={closeActionDialog}
        onConfirm={handleProductAction}
      />

      <Snackbar
        open={notification.open}
        autoHideDuration={3500}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
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

export default ProductsPage;