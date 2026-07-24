import { Box, Typography } from "@mui/material";
import useAuth from "../../hooks/useAuth";

const getGreeting = () => {
  const currentHour = new Date().getHours();

  if (currentHour < 12) {
    return "Good morning";
  }

  if (currentHour < 18) {
    return "Good afternoon";
  }

  return "Good evening";
};

const DashboardHeader = () => {
  const { user } = useAuth();

  const displayName =
    user?.full_name?.split(" ")[0] ||
    user?.name?.split(" ")[0] ||
    "there";

  return (
    <Box>
      <Typography
        variant="h4"
        component="h1"
        sx={{
          fontWeight: 700,
          color: "text.primary",
          mb: 0.5,
        }}
      >
        {getGreeting()}, {displayName}
      </Typography>

      <Typography variant="body1" color="text.secondary">
        Here is an overview of your inventory performance and activity.
      </Typography>
    </Box>
  );
};

export default DashboardHeader;