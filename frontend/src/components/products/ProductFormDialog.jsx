import { useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  Grid,
  InputAdornment,
  Stack,
  Switch,
  TextField,
} from "@mui/material";

const defaultValues = {
  name: "",
  description: "",
  sku: "",
  category: "",
  price: "",
  quantity: "",
  is_active: true,
};

function ProductFormDialog({
  open,
  mode = "create",
  product = null,
  loading = false,
  error = "",
  onClose,
  onSubmit,
}) {
  const isEditMode = mode === "edit";

  const {
    control,
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    defaultValues,
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    if (isEditMode && product) {
      reset({
        name: product.name ?? "",
        description: product.description ?? "",
        sku: product.sku ?? "",
        category: product.category ?? "",
        price: product.price ?? "",
        quantity: product.quantity ?? "",
        is_active: product.is_active ?? true,
      });
    } else {
      reset(defaultValues);
    }
  }, [open, isEditMode, product, reset]);

  const submitHandler = (values) => {
    const payload = {
      name: values.name.trim(),
      description: values.description.trim(),
      sku: values.sku.trim().toUpperCase(),
      category: values.category.trim(),
      price: Number(values.price),
    };

    if (isEditMode) {
      payload.is_active = values.is_active;
    } else {
      payload.quantity = Number(values.quantity);
    }

    onSubmit(payload);
  };

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="md"
    >
      <DialogTitle sx={{ fontWeight: 750 }}>
        {isEditMode ? "Edit Product" : "Add New Product"}
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={3} component="form" id="product-form">
          {error && <Alert severity="error">{error}</Alert>}

          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Product name"
                placeholder="e.g. Dell Wireless Mouse"
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
                {...register("name", {
                  required: "Product name is required.",
                  minLength: {
                    value: 2,
                    message: "Product name must contain at least 2 characters.",
                  },
                  maxLength: {
                    value: 120,
                    message: "Product name cannot exceed 120 characters.",
                  },
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="SKU"
                placeholder="e.g. DM-001"
                error={Boolean(errors.sku)}
                helperText={errors.sku?.message}
                {...register("sku", {
                  required: "SKU is required.",
                  minLength: {
                    value: 2,
                    message: "SKU must contain at least 2 characters.",
                  },
                  maxLength: {
                    value: 50,
                    message: "SKU cannot exceed 50 characters.",
                  },
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Category"
                placeholder="e.g. Accessories"
                error={Boolean(errors.category)}
                helperText={errors.category?.message}
                {...register("category", {
                  required: "Category is required.",
                  maxLength: {
                    value: 100,
                    message: "Category cannot exceed 100 characters.",
                  },
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="number"
                label="Price"
                inputProps={{
                  min: 1,
                  step: "0.01",
                }}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">$</InputAdornment>
                  ),
                }}
                error={Boolean(errors.price)}
                helperText={errors.price?.message}
                {...register("price", {
                  required: "Price is required.",
                  min: {
                    value: 1,
                    message: "Price must be at least 1.",
                  },
                })}
              />
            </Grid>

            {!isEditMode && (
              <Grid size={{ xs: 12, md: 6 }}>
                <TextField
                  fullWidth
                  type="number"
                  label="Opening quantity"
                  inputProps={{
                    min: 0,
                    step: 1,
                  }}
                  error={Boolean(errors.quantity)}
                  helperText={errors.quantity?.message}
                  {...register("quantity", {
                    required: "Opening quantity is required.",
                    min: {
                      value: 0,
                      message: "Quantity cannot be negative.",
                    },
                    validate: (value) =>
                      Number.isInteger(Number(value)) ||
                      "Quantity must be a whole number.",
                  })}
                />
              </Grid>
            )}

            {isEditMode && (
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  control={control}
                  name="is_active"
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={field.value}
                          onChange={field.onChange}
                        />
                      }
                      label="Product is active"
                    />
                  )}
                />
              </Grid>
            )}

            <Grid size={{ xs: 12 }}>
              <TextField
                fullWidth
                multiline
                minRows={3}
                label="Description"
                placeholder="Add a short product description"
                error={Boolean(errors.description)}
                helperText={errors.description?.message}
                {...register("description", {
                  required: "Description is required.",
                  maxLength: {
                    value: 500,
                    message: "Description cannot exceed 500 characters.",
                  },
                })}
              />
            </Grid>
          </Grid>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>

        <Button
          type="submit"
          form="product-form"
          variant="contained"
          disabled={loading}
          onClick={handleSubmit(submitHandler)}
        >
          {loading
            ? isEditMode
              ? "Saving..."
              : "Creating..."
            : isEditMode
              ? "Save Changes"
              : "Create Product"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default ProductFormDialog;