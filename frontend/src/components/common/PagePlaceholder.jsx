import { Box, Card, CardContent, Typography } from "@mui/material";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import { alpha } from "@mui/material/styles";

function PagePlaceholder({ title, description }) {
  return (
    <Box>
      <Box sx={{ mb: 3 }}>
        <Typography variant="h3">
          {title}
        </Typography>

        <Typography
          color="text.secondary"
          sx={{ mt: 0.75 }}
        >
          {description}
        </Typography>
      </Box>

      <Card>
        <CardContent sx={{ p: 5, textAlign: "center" }}>
          <Box
            sx={{
              width: 64,
              height: 64,
              mx: "auto",
              mb: 2,
              borderRadius: "50%",
              display: "grid",
              placeItems: "center",
              bgcolor: alpha("#3157C8", 0.1),
              color: "primary.main",
            }}
          >
            <Inventory2OutlinedIcon sx={{ fontSize: 28 }} />
          </Box>

          <Typography variant="h5" fontWeight={750}>
            {title} module
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 1, maxWidth: 420, mx: "auto" }}
          >
            This page is ready for professional content and API
            integration.
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
}

export default PagePlaceholder;