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
  Stack,
  Switch,
  TextField,
} from "@mui/material";

const defaultValues = {
  name: "",
  email: "",
  phone: "",
  address: "",
  is_active: true,
};

function SupplierFormDialog({
  open,
  mode = "create",
  supplier = null,
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

    if (isEditMode && supplier) {
      reset({
        name: supplier.name ?? "",
        email: supplier.email ?? "",
        phone: supplier.phone ?? "",
        address: supplier.address ?? "",
        is_active: supplier.is_active ?? true,
      });
    } else {
      reset(defaultValues);
    }
  }, [open, isEditMode, supplier, reset]);

  const submitHandler = (values) => {
    const payload = {
      name: values.name.trim(),
      email: values.email.trim().toLowerCase(),
      phone: values.phone.trim(),
      address: values.address.trim(),
    };

    if (isEditMode) {
      payload.is_active = values.is_active;
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
      <DialogTitle sx={{ fontWeight: 700 }}>
        {isEditMode ? "Edit Supplier" : "Add New Supplier"}
      </DialogTitle>

      <DialogContent dividers>
        <Stack
          component="form"
          id="supplier-form"
          spacing={3}
          onSubmit={handleSubmit(submitHandler)}
        >
          {error && <Alert severity="error">{error}</Alert>}

          <Grid container spacing={2.5}>
            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Supplier name"
                placeholder="e.g. Tech Distribution Ltd."
                error={Boolean(errors.name)}
                helperText={errors.name?.message}
                {...register("name", {
                  required: "Supplier name is required.",
                  minLength: {
                    value: 2,
                    message: "Supplier name must contain at least 2 characters.",
                  },
                  maxLength: {
                    value: 120,
                    message: "Supplier name cannot exceed 120 characters.",
                  },
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                type="email"
                label="Email address"
                placeholder="supplier@example.com"
                error={Boolean(errors.email)}
                helperText={errors.email?.message}
                {...register("email", {
                  required: "Email address is required.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address.",
                  },
                })}
              />
            </Grid>

            <Grid size={{ xs: 12, md: 6 }}>
              <TextField
                fullWidth
                label="Phone number"
                placeholder="+1 555 123 4567"
                error={Boolean(errors.phone)}
                helperText={errors.phone?.message}
                {...register("phone", {
                  required: "Phone number is required.",
                  minLength: {
                    value: 7,
                    message: "Phone number must contain at least 7 characters.",
                  },
                  maxLength: {
                    value: 30,
                    message: "Phone number cannot exceed 30 characters.",
                  },
                })}
              />
            </Grid>

            {isEditMode && (
              <Grid size={{ xs: 12, md: 6 }}>
                <Controller
                  name="is_active"
                  control={control}
                  render={({ field }) => (
                    <FormControlLabel
                      control={
                        <Switch
                          checked={Boolean(field.value)}
                          onChange={(event) =>
                            field.onChange(event.target.checked)
                          }
                        />
                      }
                      label="Supplier is active"
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
                label="Address"
                placeholder="Enter the supplier's complete address"
                error={Boolean(errors.address)}
                helperText={errors.address?.message}
                {...register("address", {
                  required: "Supplier address is required.",
                  minLength: {
                    value: 5,
                    message: "Address must contain at least 5 characters.",
                  },
                  maxLength: {
                    value: 300,
                    message: "Address cannot exceed 300 characters.",
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
          form="supplier-form"
          variant="contained"
          disabled={loading}
        >
          {loading
            ? isEditMode
              ? "Saving..."
              : "Creating..."
            : isEditMode
              ? "Save Changes"
              : "Create Supplier"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SupplierFormDialog;