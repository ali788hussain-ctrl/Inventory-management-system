import {
  Box,
  CircularProgress,
  Stack,
  Typography,
} from "@mui/material";

function AppLoader() {
  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        placeItems: "center",
        bgcolor: "background.default",
      }}
    >
      <Stack alignItems="center" spacing={2}>
        <CircularProgress size={38} />

        <Typography
          variant="body2"
          color="text.secondary"
        >
          Preparing your workspace...
        </Typography>
      </Stack>
    </Box>
  );
}

export default AppLoader;