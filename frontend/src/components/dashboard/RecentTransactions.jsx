import {
  Card,
  CardContent,
  Chip,
  Skeleton,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";

const transactionConfig = {
  STOCK_IN: {
    label: "Stock In",
    color: "success",
  },
  STOCK_OUT: {
    label: "Stock Out",
    color: "error",
  },
  ADJUSTMENT_IN: {
    label: "Adjustment In",
    color: "info",
  },
  ADJUSTMENT_OUT: {
    label: "Adjustment Out",
    color: "warning",
  },
};

function RecentTransactions({ transactions = [], loading = false }) {
  return (
    <Card>
      <CardContent sx={{ p: 0 }}>
        <Stack sx={{ px: 3, pt: 3, pb: 2 }}>
          <Typography variant="h6" fontWeight={700}>
            Recent Transactions
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Latest inventory activity
          </Typography>
        </Stack>

        {loading ? (
          <Stack spacing={1.5} sx={{ px: 3, pb: 3 }}>
            {[1, 2, 3, 4, 5].map((item) => (
              <Skeleton key={item} variant="rounded" height={48} />
            ))}
          </Stack>
        ) : transactions.length === 0 ? (
          <Typography
            color="text.secondary"
            textAlign="center"
            sx={{ py: 7 }}
          >
            No transactions found
          </Typography>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Type</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Stock Change</TableCell>
                  <TableCell>Reference</TableCell>
                  <TableCell>Date</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {transactions.map((transaction) => {
                  const config =
                    transactionConfig[transaction.transaction_type] ?? {
                      label: transaction.transaction_type,
                      color: "default",
                    };

                  return (
                    <TableRow key={transaction.id} hover>
                      <TableCell>
                        <Chip
                          label={config.label}
                          color={config.color}
                          size="small"
                          variant="outlined"
                        />
                      </TableCell>

                      <TableCell>{transaction.quantity}</TableCell>

                      <TableCell>
                        {transaction.previous_quantity} →{" "}
                        <strong>{transaction.new_quantity}</strong>
                      </TableCell>

                      <TableCell>
                        {transaction.reference || "—"}
                      </TableCell>

                      <TableCell>
                        {new Intl.DateTimeFormat("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                          hour: "numeric",
                          minute: "2-digit",
                        }).format(new Date(transaction.created_at))}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
}

export default RecentTransactions;