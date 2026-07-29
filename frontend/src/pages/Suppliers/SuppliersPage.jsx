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
import DeleteOutlineRoundedIcon from "@mui/icons-material/DeleteOutlineRounded";
import FilterAltOffRoundedIcon from "@mui/icons-material/FilterAltOffRounded";
import LocalShippingOutlinedIcon from "@mui/icons-material/LocalShippingOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import PhoneOutlinedIcon from "@mui/icons-material/PhoneOutlined";
import LocationOnOutlinedIcon from "@mui/icons-material/LocationOnOutlined";

import supplierService from "../../services/supplierService";
import SupplierFormDialog from "../../components/suppliers/SupplierFormDialog";
import SupplierDeleteDialog from "../../components/suppliers/SupplierDeleteDialog";

const ACCENT = "#0D9488";

function SuppliersPage() {
  const [suppliers, setSuppliers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [pageError, setPageError] = useState("");

  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [sortBy, setSortBy] = useState("created_at");
  const [order, setOrder] = useState("desc");

  const [page, setPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(5);

  const [menuAnchor, setMenuAnchor] = useState(null);
  const [menuSupplier, setMenuSupplier] = useState(null);

  const [formDialog, setFormDialog] = useState({
    open: false,
    mode: "create",
    supplier: null,
  });

  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState("");

  const [deleteDialog, setDeleteDialog] = useState({
    open: false,
    supplier: null,
  });

  const [deleteLoading, setDeleteLoading] = useState(false);

  const [notification, setNotification] = useState({
    open: false,
    severity: "success",
    message: "",
  });

  const loadSuppliers = useCallback(async () => {
    try {
      setLoading(true);
      setPageError("");

      const data = await supplierService.getAllSuppliers();
      setSuppliers(Array.isArray(data) ? data : []);
    } catch (error) {
      setPageError(
        error.response?.data?.detail ||
          "Unable to load suppliers. Please try again."
      );
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadSuppliers();
  }, [loadSuppliers]);

  const filteredSuppliers = useMemo(() => {
    const normalizedSearch = search.trim().toLowerCase();

    const filtered = suppliers.filter((supplier) => {
      const matchesSearch =
        !normalizedSearch ||
        supplier.name?.toLowerCase().includes(normalizedSearch) ||
        supplier.email?.toLowerCase().includes(normalizedSearch) ||
        supplier.phone?.toLowerCase().includes(normalizedSearch) ||
        supplier.address?.toLowerCase().includes(normalizedSearch);

      const matchesStatus =
        status === "" ||
        supplier.is_active === (status === "active");

      return matchesSearch && matchesStatus;
    });

    return [...filtered].sort((firstSupplier, secondSupplier) => {
      let firstValue = firstSupplier[sortBy];
      let secondValue = secondSupplier[sortBy];

      if (sortBy === "created_at") {
        firstValue = new Date(firstValue).getTime();
        secondValue = new Date(secondValue).getTime();
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
  }, [suppliers, search, status, sortBy, order]);

  const totalPages = Math.max(
    Math.ceil(filteredSuppliers.length / rowsPerPage),
    1
  );

  const visibleSuppliers = useMemo(() => {
    const startIndex = (page - 1) * rowsPerPage;
    return filteredSuppliers.slice(
      startIndex,
      startIndex + rowsPerPage
    );
  }, [filteredSuppliers, page, rowsPerPage]);

  useEffect(() => {
    if (page > totalPages) {
      setPage(totalPages);
    }
  }, [page, totalPages]);

  const formatDate = (value) => {
    if (!value) {
      return "—";
    }

    return new Intl.DateTimeFormat("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }).format(new Date(value));
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

  const openCreateDialog = () => {
    setFormError("");
    setFormDialog({
      open: true,
      mode: "create",
      supplier: null,
    });
  };

  const openEditDialog = (supplier) => {
    setFormError("");
    setFormDialog({
      open: true,
      mode: "edit",
      supplier,
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
      supplier: null,
    });

    setFormError("");
  };

  const handleSupplierSubmit = async (payload) => {
    try {
      setFormLoading(true);
      setFormError("");

      if (formDialog.mode === "edit") {
        await supplierService.updateSupplier(
          formDialog.supplier.id,
          payload
        );

        setNotification({
          open: true,
          severity: "success",
          message: "Supplier updated successfully.",
        });
      } else {
        await supplierService.createSupplier(payload);

        setNotification({
          open: true,
          severity: "success",
          message: "Supplier created successfully.",
        });
      }

      setFormDialog({
        open: false,
        mode: "create",
        supplier: null,
      });

      await loadSuppliers();
    } catch (error) {
      const detail = error.response?.data?.detail;

      setFormError(
        typeof detail === "string"
          ? detail
          : "Unable to save the supplier. Review the information and try again."
      );
    } finally {
      setFormLoading(false);
    }
  };

  const openMenu = (event, supplier) => {
    setMenuAnchor(event.currentTarget);
    setMenuSupplier(supplier);
  };

  const closeMenu = () => {
    setMenuAnchor(null);
    setMenuSupplier(null);
  };

  const openDeleteDialog = (supplier) => {
    setDeleteDialog({
      open: true,
      supplier,
    });

    closeMenu();
  };

  const closeDeleteDialog = () => {
    if (deleteLoading) {
      return;
    }

    setDeleteDialog({
      open: false,
      supplier: null,
    });
  };

  const handleDeleteSupplier = async () => {
    if (!deleteDialog.supplier) {
      return;
    }

    try {
      setDeleteLoading(true);

      await supplierService.deleteSupplier(
        deleteDialog.supplier.id
      );

      setDeleteDialog({
        open: false,
        supplier: null,
      });

      setNotification({
        open: true,
        severity: "success",
        message: "Supplier removed successfully.",
      });

      await loadSuppliers();
    } catch (error) {
      setNotification({
        open: true,
        severity: "error",
        message:
          error.response?.data?.detail ||
          "Unable to remove the supplier.",
      });
    } finally {
      setDeleteLoading(false);
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
    <Box>
      <Stack
        direction={{ xs: "column", md: "row" }}
        alignItems={{ xs: "stretch", md: "center" }}
        justifyContent="space-between"
        spacing={2}
        mb={3}
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
            Sourcing
          </Typography>

          <Typography variant="h4" fontWeight={800} letterSpacing="-0.02em">
            Suppliers
          </Typography>

          <Typography color="text.secondary" mt={0.5}>
            Maintain supplier records, contact details, and sourcing
            information.
          </Typography>
        </Box>

        <Button
          variant="contained"
          startIcon={<AddRoundedIcon />}
          onClick={openCreateDialog}
          sx={{
            alignSelf: { xs: "stretch", md: "center" },
            px: 2.5,
            bgcolor: ACCENT,
            "&:hover": { bgcolor: "#0B7A70" },
          }}
        >
          Add Supplier
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
              placeholder="Search by name, email, phone, or address"
              sx={{
                minWidth: { lg: 360 },
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
                <MenuItem value="name">Supplier name</MenuItem>
                <MenuItem value="email">Email address</MenuItem>
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
            sx={{ m: 2 }}
            action={
              <Button
                color="inherit"
                size="small"
                onClick={loadSuppliers}
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
                <TableCell>Supplier</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>Address</TableCell>
                <TableCell>Status</TableCell>
                <TableCell>Created</TableCell>
                <TableCell align="right">Actions</TableCell>
              </TableRow>
            </TableHead>

            <TableBody>
              {loading &&
                Array.from({ length: rowsPerPage }).map((_, rowIndex) => (
                  <TableRow key={rowIndex}>
                    {Array.from({ length: 7 }).map(
                      (__, cellIndex) => (
                        <TableCell key={cellIndex}>
                          <Skeleton variant="text" />
                        </TableCell>
                      )
                    )}
                  </TableRow>
                ))}

              {!loading &&
                visibleSuppliers.map((supplier) => (
                  <TableRow key={supplier.id} hover>
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
                          {getInitials(supplier.name) || (
                            <LocalShippingOutlinedIcon />
                          )}
                        </Avatar>

                        <Box>
                          <Typography fontWeight={700}>
                            {supplier.name}
                          </Typography>

                          <Typography
                            variant="body2"
                            color="text.secondary"
                          >
                            Supplier
                          </Typography>
                        </Box>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                      >
                        <EmailOutlinedIcon
                          fontSize="small"
                          color="action"
                        />

                        <Typography variant="body2">
                          {supplier.email}
                        </Typography>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="center"
                      >
                        <PhoneOutlinedIcon
                          fontSize="small"
                          color="action"
                        />

                        <Typography variant="body2">
                          {supplier.phone}
                        </Typography>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Stack
                        direction="row"
                        spacing={1}
                        alignItems="flex-start"
                      >
                        <LocationOnOutlinedIcon
                          fontSize="small"
                          color="action"
                        />

                        <Typography
                          variant="body2"
                          sx={{
                            maxWidth: 280,
                            display: "-webkit-box",
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: "vertical",
                            overflow: "hidden",
                          }}
                        >
                          {supplier.address}
                        </Typography>
                      </Stack>
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={
                          supplier.is_active ? "Active" : "Inactive"
                        }
                        color={
                          supplier.is_active ? "success" : "default"
                        }
                        size="small"
                      />
                    </TableCell>

                    <TableCell sx={{ color: "text.secondary" }}>
                      {formatDate(supplier.created_at)}
                    </TableCell>

                    <TableCell align="right">
                      <IconButton
                        size="small"
                        onClick={(event) =>
                          openMenu(event, supplier)
                        }
                      >
                        <MoreVertRoundedIcon />
                      </IconButton>
                    </TableCell>
                  </TableRow>
                ))}

              {!loading && visibleSuppliers.length === 0 && (
                <TableRow>
                  <TableCell colSpan={7}>
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
                        <LocalShippingOutlinedIcon sx={{ fontSize: 32 }} />
                      </Box>

                      <Typography variant="h6" fontWeight={750}>
                        No suppliers found
                      </Typography>

                      <Typography
                        color="text.secondary"
                        textAlign="center"
                        maxWidth={420}
                      >
                        Change your search or filters, or add a new
                        supplier.
                      </Typography>

                      <Button
                        variant="contained"
                        startIcon={<AddRoundedIcon />}
                        onClick={openCreateDialog}
                        sx={{
                          bgcolor: ACCENT,
                          "&:hover": { bgcolor: "#0B7A70" },
                        }}
                      >
                        Add Supplier
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
            Showing {visibleSuppliers.length} of{" "}
            {filteredSuppliers.length} suppliers
          </Typography>

          <Stack direction="row" alignItems="center" spacing={2}>
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
        <MenuItem onClick={() => openEditDialog(menuSupplier)}>
          <EditRoundedIcon fontSize="small" sx={{ mr: 1.5 }} />
          Edit
        </MenuItem>

        <MenuItem
          onClick={() => openDeleteDialog(menuSupplier)}
          sx={{ color: "error.main" }}
        >
          <DeleteOutlineRoundedIcon
            fontSize="small"
            sx={{ mr: 1.5 }}
          />
          Remove
        </MenuItem>
      </Menu>

      <SupplierFormDialog
        open={formDialog.open}
        mode={formDialog.mode}
        supplier={formDialog.supplier}
        loading={formLoading}
        error={formError}
        onClose={closeFormDialog}
        onSubmit={handleSupplierSubmit}
      />

      <SupplierDeleteDialog
        open={deleteDialog.open}
        supplierName={deleteDialog.supplier?.name ?? ""}
        loading={deleteLoading}
        onClose={closeDeleteDialog}
        onConfirm={handleDeleteSupplier}
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

export default SuppliersPage;