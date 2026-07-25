import {
  Box,
  Button,
  Chip,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  Stack,
  Typography,
} from "@mui/material";

const typeLabels = {
  STOCK_IN: "Stock In",
  STOCK_OUT: "Stock Out",
  ADJUSTMENT_IN: "Adjustment In",
  ADJUSTMENT_OUT: "Adjustment Out",
  RETURN_IN: "Return In",
  RETURN_OUT: "Return Out",
};

function TransactionDetailsDialog({
  open,
  transaction,
  productName,
  supplierName,
  onClose,
}) {
  if (!transaction) {
    return null;
  }

  const isIncoming = [
    "STOCK_IN",
    "ADJUSTMENT_IN",
    "RETURN_IN",
  ].includes(transaction.transaction_type);

  const formatDateTime = (value) => {
    if (!value) {
      return "—";
    }

    return new Intl.DateTimeFormat("en-US", {
      dateStyle: "medium",
      timeStyle: "short",
    }).format(new Date(value));
  };

  const DetailRow = ({ label, value }) => (
    <Stack
      direction="row"
      justifyContent="space-between"
      spacing={3}
    >
      <Typography color="text.secondary">
        {label}
      </Typography>

      <Typography fontWeight={600} textAlign="right">
        {value ?? "—"}
      </Typography>
    </Stack>
  );

  return (
    <Dialog
      open={open}
      onClose={onClose}
      fullWidth
      maxWidth="sm"
    >
      <DialogTitle sx={{ fontWeight: 700 }}>
        Transaction Details
      </DialogTitle>

      <DialogContent dividers>
        <Stack spacing={2}>
          <Stack
            direction="row"
            justifyContent="space-between"
            alignItems="center"
          >
            <Typography variant="h6" fontWeight={700}>
              {productName}
            </Typography>

            <Chip
              label={
                typeLabels[transaction.transaction_type] ??
                transaction.transaction_type
              }
              color={isIncoming ? "success" : "error"}
            />
          </Stack>

          <Divider />

          <DetailRow
            label="Quantity"
            value={`${isIncoming ? "+" : "-"}${
              transaction.quantity
            }`}
          />

          <DetailRow
            label="Previous quantity"
            value={transaction.previous_quantity}
          />

          <DetailRow
            label="New quantity"
            value={transaction.new_quantity}
          />

          <DetailRow
            label="Supplier"
            value={supplierName || "No supplier"}
          />

          <DetailRow
            label="Reference"
            value={transaction.reference || "—"}
          />

          <DetailRow
            label="Performed by"
            value={transaction.performed_by || "—"}
          />

          <DetailRow
            label="Date"
            value={formatDateTime(transaction.created_at)}
          />

          <Divider />

          <Box>
            <Typography
              color="text.secondary"
              gutterBottom
            >
              Notes
            </Typography>

            <Typography>
              {transaction.notes || "No notes provided."}
            </Typography>
          </Box>
        </Stack>
      </DialogContent>

      <DialogActions sx={{ px: 3, py: 2 }}>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}

export default TransactionDetailsDialog;