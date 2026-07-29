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
import { alpha } from "@mui/material/styles";

import AddRoundedIcon from "@mui/icons-material/AddRounded";
import SearchRoundedIcon from "@mui/icons-material/SearchRounded";
import MoreVertRoundedIcon from "@mui/icons-material/MoreVertRounded";
import EditRoundedIcon from "@mui/icons-material/EditRounded";
import BlockRoundedIcon from "@mui/icons-material/BlockRounded";
import RestoreRoundedIcon from "@mui/icons-material/RestoreRounded";
import FilterAltOffRoundedIcon from "@mui/icons-material/FilterAltOffRounded";
import CategoryOutlinedIcon from "@mui/icons-material/CategoryOutlined";

import categoryService from "../../services/categoryService";
import CategoryFormDialog from "../../components/categories/CategoryFormDialog";
import CategoryStatusDialog from "../../components/categories/CategoryStatusDialog";

const ACCENT = "#7C3AED";

function CategoriesPage() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [order, setOrder] = useState("desc");

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuCategory, setMenuCategory] = useState(null);

  const [formDialog, setFormDialog] = useState({
    open: false,
    mode: "create",
    category: null,
  });

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const [statusDialog, setStatusDialog] = useState({
    open: false,
    action: "deactivate",
    category: null,
  });

  const [statusLoading, setStatusLoading] = useState(false);

  const [notification, setNotification] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const loadCategories = useCallback(async () => {
    try {
      setLoading(true);
      setPageError("");

      const data = await categoryService.getAllCategories();
      setCategories(Array.isArray(data) ? data : []);
    } catch (error) {
      const detail = error.response?.data?.detail;

      setPageError(
        typeof detail === "string"
          ? detail
          : "Unable to load categories. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCategories();
  }, [loadCategories]);

  const filteredCategories = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const filtered = categories.filter((category) => {
      const categoryName = category.name?.toLowerCase() ?? "";
      const categoryDescription =
        category.description?.toLowerCase() ?? "";

      const matchesSearch =
        !normalizedSearch ||
        categoryName.includes(normalizedSearch) ||
        categoryDescription.includes(normalizedSearch);

      const matchesStatus =
        status === "" ||
        category.is_active === (status === "active");

      return matchesSearch && matchesStatus;
    });

    return [...filtered].sort((first, second) => {
      let firstValue = first[sortBy];
      let secondValue = second[sortBy];

      if (sortBy === "created_at") {
        firstValue = new Date(firstValue ?? 0).getTime();
        secondValue = new Date(secondValue ?? 0).getTime();
      } else {
        firstValue = String(firstValue ?? "").toLowerCase();
        secondValue = String(secondValue ?? "").toLowerCase();
      }

      if (firstValue < secondValue) {
        return order === "asc" ? -1 : 1;
      }

      if (firstValue > secondValue) {
        return order === "asc" ? 1 : -1;
      }

      return 0;
    });
  }, [categories, search, status, sortBy, order]);

  const totalPages = Math.max(
    Math.ceil(filteredCategories.length / rowsPerPage),
    1
  );

  const visibleCategories = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;

    return filteredCategories.slice(
      startIndex,
      startIndex + rowsPerPage
    );
  }, [filteredCategories, page, rowsPerPage]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

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

  const getInitials = (name = "") =>
    name
      .split(" ")
      .filter(Boolean)
      .slice(0, 2)
      .map((word) => word[0])
      .join("")
      .toUpperCase();

  const showNotification = (message, severity = "success") => {
    setNotification({
      open: true,
      severity,
      message,
    });
  };

  const openCreateDialog = () => {
    setFormError("");

    setFormDialog({
      open: true,
      mode: "create",
      category: null,
    });
  };

  const openEditDialog = (category) => {
    if (!category) {
      return;
    }

    setFormError("");

    setFormDialog({
      open: true,
      mode: "edit",
      category,
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
      category: null,
    });

    setFormError("");
  };

  const handleCategorySubmit = async (payload) => {
    try {
      setFormLoading(true);
      setFormError("");

      if (formDialog.mode === "edit" && formDialog.category) {
        await categoryService.updateCategory(
          formDialog.category.id,
          payload
        );

        showNotification("Category updated successfully.");
      } else {
        await categoryService.createCategory(payload);

        showNotification("Category created successfully.");
      }

      setFormDialog({
        open: false,
        mode: "create",
        category: null,
      });

      await loadCategories();
    } catch (error) {
      const detail = error.response?.data?.detail;

      setFormError(
        typeof detail === "string"
          ? detail
          : "Unable to save the category. Review the form and try again."
      );
    } finally {
      setFormLoading(false);
    }
  };

  const openMenu = (event, category) => {
    setMenuAnchor(event.currentTarget);
    setMenuCategory(category);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
    setMenuCategory(null);
  };

  const openStatusDialog = (category, action) => {
    if (!category) {
      return;
    }

    setStatusDialog({
      open: true,
      action,
      category,
    });

    closeMenu();
  };

  const closeStatusDialog = () => {
    if (statusLoading) {
      return;
    }

    setStatusDialog({
      open: false,
      action: "deactivate",
      category: null,
    });
  };

  const handleStatusChange = async () => {
    const selectedCategory = statusDialog.category;

    if (!selectedCategory) {
      return;
    }

    try {
      setStatusLoading(true);

      if (statusDialog.action === "restore") {
        await categoryService.restoreCategory(selectedCategory);
        showNotification("Category restored successfully.");
      } else {
        await categoryService.deactivateCategory(selectedCategory);
        showNotification("Category deactivated successfully.");
      }

      setStatusDialog({
        open: false,
        action: "deactivate",
        category: null,
      });

      await loadCategories();
    } catch (error) {
      const detail = error.response?.data?.detail;

      showNotification(
        typeof detail === "string"
          ? detail
          : "Unable to update the category status.",
        "error"
      );
    } finally {
      setStatusLoading(false);
    }
  };

  const clearFilters = () => {
    setSearch("");
    setStatus("");
    setSortBy("created_at");
    setOrder("desc");
    setPage(1);
  };

  const hasFilters =
    Boolean(search) ||
    status !== "" ||
    sortBy !== "created_at" ||
    order !== "desc";

  return (
    <Box sx={{ width: "100%" }}>
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{ xs: "stretch", md: "center" }}
        justifyContent="space-between"
        spacing={2}
        mb={3}
      >
        <Box sx={{ minWidth: 0 }}>
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
            Catalog
          </Typography>

          <Typography variant="h4" fontWeight={800} letterSpacing="-0.02em">
            Categories
          </Typography>

          <Typography color="text.secondary" mt={0.5}>
            Organize products into structured and searchable categories.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={openCreateDialog}
          sx={{
            alignSelf: {
              xs: "stretch",
              md: "center",
            },
            flexShrink: 0,
            px: 2.5,
            py: 1.1,
            whiteSpace: "nowrap",
            bgcolor: ACCENT,
            "&:hover": {
              bgcolor: "#6D28D9",
            },
          }}
        >
          Add Category
        </Button>
      </Stack>

      <Card
        sx={{
          width: "100%",
          overflow: "hidden",
        }}
      >
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
              placeholder="Search by category name or description"
              sx={{
                minWidth: {
                  xs: "100%",
                  lg: 350,
                },
                flexGrow: 1,
              }}
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">
                    <SearchRoundedIcon color="action" />
                  </InputAdornment>
                ),
              }}
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
                <MenuItem value="active">Active</MenuItem>
                <MenuItem value="inactive">Inactive</MenuItem>
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
                <MenuItem value="name">Category name</MenuItem>
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
                    width: 40,
                    height: 40,
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
                onClick={loadCategories}
              >
                Retry
              </Button>
            }
          >
            {pageError}
          </Alert>
        )}

        <TableContainer>
          <Table sx={{ minWidth: 900 }}>
            <TableHead>
              <TableRow>
                <TableCell>Category</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell>Updated</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading &&
                Array.from({ length: rowsPerPage }).map(
                  (_, rowIndex) => (
                    <TableRow key={`loading-row-${rowIndex}`}>
                      {Array.from({ length: 6 }).map(
                        (__, cellIndex) => (
                          <TableCell
                            key={`loading-cell-${rowIndex}-${cellIndex}`}
                          >
                            <Skeleton variant="text" />
                          </TableCell>
                        )
                      )}
                    </TableRow>
                  )
                )}

              {!loading &&
                visibleCategories.map((category) => (
                  <TableRow key={category.id} hover>
                    <TableCell>
                      <Stack
                        direction="row"
                        spacing={1.5}
                        alignItems="center"
                      >
                        <Avatar
                          sx={{
                            width: 42,
                            height: 42,
                            bgcolor: alpha(ACCENT, 0.14),
                            color: ACCENT,
                            fontSize: 15,
                            fontWeight: 750,
                          }}
                        >
                          {getInitials(category.name) || (
                            <CategoryOutlinedIcon />
                          )}
                        </Avatar>

                        <Box sx={{ minWidth: 0 }}>
                          <Typography
                            fontWeight={700}
                            noWrap
                            title={category.name}
                          >
                            {category.name}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            Product category
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Typography
                        variant="body2"
                        color="text.secondary"
                        sx={{
                          maxWidth: 420,
                          display: "-webkit-box",
                          WebkitLineClamp: 2,
                          WebkitBoxOrient: "vertical",
                          overflow: "hidden",
                        }}
                      >
                        {category.description || "No description provided"}
                      </Typography>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={
                          category.is_active ? "Active" : "Inactive"
                        }
                        color={
                          category.is_active ? "success" : "default"
                        }
                        size="small"
                      />
                    </TableCell>

                    <TableCell sx={{ color: "text.secondary" }}>
                      {formatDate(category.created_at)}
                    </TableCell>

                    <TableCell sx={{ color: "text.secondary" }}>
                      {formatDate(category.updated_at)}
                    </TableCell>

                    <TableCell align="right">
                      <Tooltip title="Category actions">
                        <IconButton
                          size="small"
                          onClick={(event) =>
                            openMenu(event, category)
                          }
                        >
                          <MoreVertRoundedIcon />
                        </IconButton>
                      </Tooltip>
                    </TableCell>
                  </TableRow>
                ))}

              {!loading && visibleCategories.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6}>
                    <Stack
                      alignItems="center"
                      justifyContent="center"
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
                        <CategoryOutlinedIcon sx={{ fontSize: 32 }} />
                      </Box>

                      <Typography variant="h6" fontWeight={750}>
                        No categories found
                      </Typography>

                      <Typography
                        color="text.secondary"
                        textAlign="center"
                        maxWidth={420}
                      >
                        Change your search or filters, or create a new
                        category.
                      </Typography>

                      <Button
                        variant="contained"
                        startIcon={<AddRoundedIcon />}
                        onClick={openCreateDialog}
                        sx={{
                          bgcolor: ACCENT,
                          "&:hover": { bgcolor: "#6D28D9" },
                        }}
                      >
                        Add Category
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
          alignItems={{ xs: "stretch", sm: "center" }}
          justifyContent="space-between"
          spacing={2}
          sx={{
            px: 3,
            py: 2,
          }}
        >
          <Typography variant="body2" color="text.secondary">
            Showing {visibleCategories.length} of{" "}
            {filteredCategories.length} categories
          </Typography>

          <Stack
            direction={{ xs: "column", sm: "row" }}
            alignItems={{ xs: "stretch", sm: "center" }}
            spacing={2}
          >
            <FormControl size="small" sx={{ minWidth: 105 }}>
              <InputLabel>Rows</InputLabel>

              <Select
                value={rowsPerPage}
                label="Rows"
                onChange={(event) => {
                  setRowsPerPage(Number(event.target.value));
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
              onChange={(_, value) => setPage(value)}
              disabled={loading || totalPages <= 1}
            />
          </Stack>
        </Stack>
      </Card>

      <Menu
        anchorEl={menuAnchor}
        open={Boolean(menuAnchor)}
        onClose={closeMenu}
      >
        <MenuItem onClick={() => openEditDialog(menuCategory)}>
          <EditRoundedIcon fontSize="small" sx={{ mr: 1.5 }} />
          Edit
        </MenuItem>

        {menuCategory?.is_active ? (
          <MenuItem
            onClick={() =>
              openStatusDialog(menuCategory, "deactivate")
            }
            sx={{ color: "error.main" }}
          >
            <BlockRoundedIcon fontSize="small" sx={{ mr: 1.5 }} />
            Deactivate
          </MenuItem>
        ) : (
          <MenuItem
            onClick={() =>
              openStatusDialog(menuCategory, "restore")
            }
            sx={{ color: "success.main" }}
          >
            <RestoreRoundedIcon
              fontSize="small"
              sx={{ mr: 1.5 }}
            />
            Restore
          </MenuItem>
        )}
      </Menu>

      <CategoryFormDialog
        open={formDialog.open}
        mode={formDialog.mode}
        category={formDialog.category}
        loading={formLoading}
        error={formError}
        onClose={closeFormDialog}
        onSubmit={handleCategorySubmit}
      />

      <CategoryStatusDialog
        open={statusDialog.open}
        action={statusDialog.action}
        categoryName={statusDialog.category?.name ?? ""}
        loading={statusLoading}
        onClose={closeStatusDialog}
        onConfirm={handleStatusChange}
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

export default CategoriesPage;