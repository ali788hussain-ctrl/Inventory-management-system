import { Box, Card, CardContent, Typography } from "@mui/material";

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
        <CardContent sx={{ p: 4 }}>
          <Typography variant="h5">
            {title} module
          </Typography>

          <Typography
            color="text.secondary"
            sx={{ mt: 1 }}
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