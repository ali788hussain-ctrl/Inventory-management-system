import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";

function ProductActionDialog({
  open,
  action = "deactivate",
  productName = "",
  loading = false,
  onClose,
  onConfirm,
}) {
  const isRestore = action === "restore";

  return (
    <Dialog
      open={open}
      onClose={loading ? undefined : onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle sx={{ fontWeight: 750 }}>
        {isRestore ? "Restore Product" : "Deactivate Product"}
      </DialogTitle>

      <DialogContent>
        <DialogContentText>
          {isRestore
            ? `Restore "${productName}" and make it active again?`
            : `Deactivate "${productName}"? It will remain available in the system and can be restored later.`}
        </DialogContentText>
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

export default ProductActionDialog;