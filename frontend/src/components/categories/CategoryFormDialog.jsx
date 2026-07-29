import { useEffect } from "react";
import {
  Alert,
  Box,
  Button,
  CircularProgress,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { Controller, useForm } from "react-hook-form";

const ACCENT = "#7C3AED";

function getApiErrorMessage(error) {
  const detail = error?.response?.data?.detail;

  if (typeof detail === "string") {
    return detail;
  }

  if (Array.isArray(detail)) {
    return detail
      .map((item) => item?.msg)
      .filter(Boolean)
      .join(", ");
  }

  return (
    error?.response?.data?.message ||
    error?.message ||
    "Something went wrong. Please try again."
  );
}

function CategoryFormDialog({
  open,
  category = null,
  loading = false,
  error = "",
  onClose,
  onSubmit,
}) {
  const isEditMode = Boolean(category?.id);

  const {
    control,
    handleSubmit,
    reset,
    setError,
    formState: { errors, isSubmitting },
  } = useForm({
    defaultValues: {
      name: "",
      description: "",
    },
  });

  useEffect(() => {
    if (!open) {
      return;
    }

    reset({
      name: category?.name || "",
      description: category?.description || "",
    });
  }, [open, category, reset]);

  const handleFormSubmit = async (values) => {
    const payload = {
      name: values.name.trim(),
      description: values.description.trim(),
    };

    try {
      await onSubmit(payload);
    } catch (submitError) {
      setError("root", {
        type: "server",
        message: getApiErrorMessage(submitError),
      });
    }
  };

  const handleDialogClose = () => {
    if (loading || isSubmitting) {
      return;
    }

    reset({
      name: "",
      description: "",
    });

    onClose();
  };

  const submitting = loading || isSubmitting;
  const serverError = error || errors.root?.message;

  return (
    <Dialog
      open={open}
      onClose={handleDialogClose}
      fullWidth
      maxWidth="sm"
      PaperProps={{
        component: "form",
        onSubmit: handleSubmit(handleFormSubmit),
      }}
    >
      <DialogTitle>
        <Typography variant="h6" fontWeight={750}>
          {isEditMode ? "Edit Category" : "Add Category"}
        </Typography>

        <Typography
          variant="body2"
          color="text.secondary"
          sx={{ mt: 0.4 }}
        >
          {isEditMode
            ? "Update the category information below."
            : "Create a new category for organizing products."}
        </Typography>
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          {serverError && (
            <Alert severity="error">{serverError}</Alert>
          )}

          <Controller
            name="name"
            control={control}
            rules={{
              required: "Category name is required.",
              minLength: {
                value: 2,
                message:
                  "Category name must contain at least 2 characters.",
              },
              maxLength: {
                value: 100,
                message:
                  "Category name cannot exceed 100 characters.",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                autoFocus
                fullWidth
                label="Category Name"
                placeholder="Enter category name"
                error={Boolean(errors.name)}
                helperText={
                  errors.name?.message ||
                  "Use a clear and unique category name."
                }
                disabled={submitting}
                inputProps={{
                  maxLength: 100,
                }}
              />
            )}
          />

          <Controller
            name="description"
            control={control}
            rules={{
              maxLength: {
                value: 500,
                message:
                  "Description cannot exceed 500 characters.",
              },
            }}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                multiline
                minRows={4}
                maxRows={8}
                label="Description"
                placeholder="Enter a short description"
                error={Boolean(errors.description)}
                helperText={
                  errors.description?.message ||
                  `${field.value?.length || 0}/500 characters`
                }
                disabled={submitting}
                inputProps={{
                  maxLength: 500,
                }}
              />
            )}
          />

          {isEditMode && (
            <Box
              sx={{
                px: 1.5,
                py: 1.25,
                border: "1px solid",
                borderColor: "divider",
                borderRadius: 2,
                bgcolor: "background.default",
              }}
            >
              <Typography
                variant="caption"
                color="text.secondary"
              >
                Category status is managed separately through the
                activate/deactivate action.
              </Typography>
            </Box>
          )}
        </Stack>
      </DialogContent>

      <DialogActions>
        <Button
          type="button"
          variant="outlined"
          onClick={handleDialogClose}
          disabled={submitting}
        >
          Cancel
        </Button>

        <Button
          type="submit"
          variant="contained"
          disabled={submitting}
          startIcon={
            submitting ? (
              <CircularProgress
                size={16}
                color="inherit"
              />
            ) : null
          }
          sx={{
            bgcolor: ACCENT,
            "&:hover": { bgcolor: "#6D28D9" },
          }}
        >
          {submitting
            ? isEditMode
              ? "Updating..."
              : "Creating..."
            : isEditMode
              ? "Update Category"
              : "Create Category"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CategoryFormDialog;