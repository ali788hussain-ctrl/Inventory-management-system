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

function SupplierDeleteDialog({
  open,
  supplierName = "",
  loading = false,
  onClose,
  onConfirm,
}) {
  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      fullWidth
      maxWidth="xs"
    >
      <DialogTitle sx={{ fontWeight: 700 }}>
        Remove Supplier
      </DialogTitle>

      <DialogContent>
        <Stack spacing={2}>
          <DialogContentText>
            Are you sure you want to remove{" "}
            <strong>{supplierName}</strong>?
          </DialogContentText>

          <Alert severity="warning">
            The API does not provide a restore endpoint. This supplier may not
            be recoverable after removal.
          </Alert>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, pb: 2 }}>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>

        <Button
          color="error"
          variant="contained"
          onClick={onConfirm}
          disabled={loading}
        >
          {loading ? "Removing..." : "Remove Supplier"}
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default SupplierDeleteDialog;