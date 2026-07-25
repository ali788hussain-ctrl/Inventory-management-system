import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Stack,
} from "@mui/material";

function CategoryStatusDialog({
  open,
  action = "deactivate",
  categoryName = "",
  loading = false,
  onClose,
  onConfirm,
}) {
  const isRestore = action === "restore";

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle sx={{ fontWeight: 700 }}>
        {isRestore ? "Restore Category" : "Deactivate Category"}
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          <DialogContentText>
            {isRestore
              ? `Restore "${categoryName}" and make it available again?`
              : `Deactivate "${categoryName}"?`}
          </DialogContentText>

          {!isRestore && (
            <Alert severity="warning">
              Products already assigned to this category will not be deleted.
              The category will only become inactive.
            </Alert>
          )}
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>

        <Button
          variant="contained"
          color={isRestore ? "success" : "error"}
          onClick={onConfirm}
          disabled={loading}
        >
          {loading
            ? "Processing..."
            : isRestore
              ? "Restore"
              : "Deactivate"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default CategoryStatusDialog;