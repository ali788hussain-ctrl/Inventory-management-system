import { useEffect, useMemo } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

const transactionTypes = [
  {
    value: "STOCK_IN",
    label: "Stock In",
    description: "Add newly purchased stock.",
  },
  {
    value: "STOCK_OUT",
    label: "Stock Out",
    description: "Remove sold or issued stock.",
  },
  {
    value: "ADJUSTMENT_IN",
    label: "Adjustment In",
    description: "Increase stock after reconciliation.",
  },
  {
    value: "ADJUSTMENT_OUT",
    label: "Adjustment Out",
    description: "Reduce stock after reconciliation.",
  },
  {
    value: "RETURN_IN",
    label: "Return In",
    description: "Record items returned into inventory.",
  },
  {
    value: "RETURN_OUT",
    label: "Return Out",
    description: "Record inventory returned to a supplier.",
  },
];

const defaultValues = {
  product_id: "",
  supplier_id: "",
  transaction_type: "STOCK_IN",
  quantity: "",
  reference: "",
  notes: "",
};

function TransactionFormDialog({
  open,
  products = [],
  suppliers = [],
  loading = false,
  error = "",
  onClose,
  onSubmit,
}) {
  const {
    control,
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  const selectedProductId = watch("product_id");
  const selectedTransactionType = watch("transaction_type");

  const selectedProduct = useMemo(
    () =>
      products.find(
        (product) => product.id === selectedProductId
      ) ?? null,
    [products, selectedProductId]
  );

  const removesStock = [
    "STOCK_OUT",
    "ADJUSTMENT_OUT",
    "RETURN_OUT",
  ].includes(selectedTransactionType);

  useEffect(() => {
    if (open) {
      reset(defaultValues);
    }
  }, [open, reset]);

  const submitHandler = (values) => {
    const payload = {
      product_id: values.product_id,
      supplier_id: values.supplier_id || null,
      transaction_type: values.transaction_type,
      quantity: Number(values.quantity),
      reference: values.reference.trim() || null,
      notes: values.notes.trim() || null,
    };

    onSubmit(payload);
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle sx={{ fontWeight: 700 }}>
        Record Inventory Transaction
      </DialogTitle>

      <DialogContent dividers>
        <Stack
          component="form"
          id="inventory-transaction-form"
          spacing={2.5}
          onSubmit={handleSubmit(submitHandler)}
        >
          {error && <Alert severity="error">{error}</Alert>}

          <Controller
            name="product_id"
            control={control}
            rules={{
              required: "Select a product.",
            }}
            render={({ field }) => (
              <FormControl
                fullWidth
                error={Boolean(errors.product_id)}
              >
                <InputLabel>Product</InputLabel>

                <Select {...field} label="Product">
                  {products
                    .filter(
                      (product) => product.is_active !== false
                    )
                    .map((product) => (
                      <MenuItem
                        key={product.id}
                        value={product.id}
                      >
                        {product.name}
                        {product.sku
                          ? ` — ${product.sku}`
                          : ""}
                      </MenuItem>
                    ))}
                </Select>

                <FormHelperText>
                  {errors.product_id?.message}
                </FormHelperText>
              </FormControl>
            )}
          />

          {selectedProduct && (
            <Alert
              severity={removesStock ? "warning" : "info"}
            >
              Current quantity:{" "}
              <strong>{selectedProduct.quantity ?? 0}</strong>
              {removesStock &&
                " — ensure the removal quantity does not exceed available stock."}
            </Alert>
          )}

          <Controller
            name="transaction_type"
            control={control}
            rules={{
              required: "Select a transaction type.",
            }}
            render={({ field }) => (
              <FormControl
                fullWidth
                error={Boolean(errors.transaction_type)}
              >
                <InputLabel>Transaction type</InputLabel>

                <Select {...field} label="Transaction type">
                  {transactionTypes.map((type) => (
                    <MenuItem
                      key={type.value}
                      value={type.value}
                    >
                      <Stack>
                        <Typography fontWeight={600}>
                          {type.label}
                        </Typography>

                        <Typography
                          variant="caption"
                          color="text.secondary"
                        >
                          {type.description}
                        </Typography>
                      </Stack>
                    </MenuItem>
                  ))}
                </Select>

                <FormHelperText>
                  {errors.transaction_type?.message}
                </FormHelperText>
              </FormControl>
            )}
          />

          <TextField
            fullWidth
            type="number"
            label="Quantity"
            inputProps={{
              min: 1,
              step: 1,
            }}
            error={Boolean(errors.quantity)}
            helperText={errors.quantity?.message}
            {...register("quantity", {
              required: "Quantity is required.",
              valueAsNumber: true,
              min: {
                value: 1,
                message: "Quantity must be greater than zero.",
              },
              validate: (value) => {
                if (!Number.isInteger(value)) {
                  return "Quantity must be a whole number.";
                }

                if (
                  removesStock &&
                  selectedProduct &&
                  value > Number(selectedProduct.quantity ?? 0)
                ) {
                  return "Quantity exceeds the available stock.";
                }

                return true;
              },
            })}
          />

          <Controller
            name="supplier_id"
            control={control}
            render={({ field }) => (
              <FormControl fullWidth>
                <InputLabel>Supplier (optional)</InputLabel>

                <Select
                  {...field}
                  label="Supplier (optional)"
                >
                  <MenuItem value="">
                    No supplier
                  </MenuItem>

                  {suppliers
                    .filter(
                      (supplier) =>
                        supplier.is_active !== false
                    )
                    .map((supplier) => (
                      <MenuItem
                        key={supplier.id}
                        value={supplier.id}
                      >
                        {supplier.name}
                      </MenuItem>
                    ))}
                </Select>
              </FormControl>
            )}
          />

          <TextField
            fullWidth
            label="Reference"
            placeholder="e.g. PO-2026-001 or SALE-1042"
            error={Boolean(errors.reference)}
            helperText={
              errors.reference?.message ??
              "Optional purchase order, sale, or adjustment reference."
            }
            {...register("reference", {
              maxLength: {
                value: 150,
                message:
                  "Reference cannot exceed 150 characters.",
              },
            })}
          />

          <TextField
            fullWidth
            multiline
            minRows={3}
            label="Notes"
            placeholder="Add useful details about this transaction"
            error={Boolean(errors.notes)}
            helperText={errors.notes?.message}
            {...register("notes", {
              maxLength: {
                value: 500,
                message:
                  "Notes cannot exceed 500 characters.",
              },
            })}
          />
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>

        <Button
          type="submit"
          form="inventory-transaction-form"
          variant="contained"
          disabled={loading || products.length === 0}
        >
          {loading ? "Recording..." : "Record Transaction"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default TransactionFormDialog;