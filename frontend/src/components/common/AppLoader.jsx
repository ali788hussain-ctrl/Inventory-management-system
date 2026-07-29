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
      <Stack alignItems="center" spacing={2.5}>
        <Box
          sx={{
            width: 52,
            height: 52,
            borderRadius: 2.5,
            display: "grid",
            placeItems: "center",
            background:
              "linear-gradient(135deg, #6C9BFF 0%, #3157C8 100%)",
            boxShadow: "0 10px 26px rgba(49,87,200,0.28)",
          }}
        >
          <CircularProgress size={24} sx={{ color: "#FFFFFF" }} />
        </Box>

        <Typography
          variant="body2"
          color="text.secondary"
          fontWeight={550}
        >
          Preparing your workspace...
        </Typography>
      </Stack>
    </Box>
  );
}

export default AppLoader;