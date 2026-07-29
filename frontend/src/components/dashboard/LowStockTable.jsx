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
import CheckCircleOutlineRoundedIcon from "@mui/icons-material/CheckCircleOutlineRounded";

function LowStockTable({ products = [], loading = false }) {
  return (
    <Card>
      <CardContent sx={{ p: 0 }}>
        <Stack sx={{ px: 3, pt: 3, pb: 2 }}>
          <Typography variant="h6" fontWeight={750}>
            Low Stock Products
          </Typography>

          <Typography variant="body2" color="text.secondary">
            Products with 10 units or fewer
          </Typography>
        </Stack>

        {loading ? (
          <Stack spacing={1.5} sx={{ px: 3, pb: 3 }}>
            {[1, 2, 3].map((item) => (
              <Skeleton key={item} variant="rounded" height={48} />
            ))}
          </Stack>
        ) : products.length === 0 ? (
          <Stack
            alignItems="center"
            justifyContent="center"
            spacing={1}
            sx={{ width: "100%", textAlign: "center", py: 7 }}
          >
            

            <Typography fontWeight={750}>Stock levels look healthy</Typography>

            <Typography variant="body2" color="text.secondary">
              No products are currently below the selected threshold.
            </Typography>
          </Stack>
        ) : (
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Product</TableCell>
                  <TableCell>SKU</TableCell>
                  <TableCell>Category</TableCell>
                  <TableCell>Quantity</TableCell>
                  <TableCell>Status</TableCell>
                </TableRow>
              </TableHead>

              <TableBody>
                {products.map((product) => (
                  <TableRow key={product.id} hover>
                    <TableCell>
                      <Typography fontWeight={650}>{product.name}</Typography>
                    </TableCell>

                    <TableCell sx={{ color: "text.secondary" }}>
                      {product.sku}
                    </TableCell>
                    <TableCell>{product.category || "Uncategorized"}</TableCell>
                    <TableCell sx={{ fontWeight: 650 }}>
                      {product.quantity}
                    </TableCell>

                    <TableCell>
                      <Chip
                        label={product.quantity === 0 ? "Out of stock" : "Low"}
                        color={product.quantity === 0 ? "error" : "warning"}
                        size="small"
                      />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </CardContent>
    </Card>
  );
}

export default LowStockTable;