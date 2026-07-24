import { useState } from "react";
import { Box, useMediaQuery, useTheme } from "@mui/material";
import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

const DRAWER_WIDTH = 270;
const COLLAPSED_DRAWER_WIDTH = 88;

function DashboardLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));

  const [mobileOpen, setMobileOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);

  const drawerWidth = collapsed
    ? COLLAPSED_DRAWER_WIDTH
    : DRAWER_WIDTH;

  const handleMobileToggle = () => {
    setMobileOpen((previous) => !previous);
  };

  const handleCollapseToggle = () => {
    setCollapsed((previous) => !previous);
  };

  return (
    <Box sx={{ display: "flex", minHeight: "100vh" }}>
      <Sidebar
        drawerWidth={drawerWidth}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        isMobile={isMobile}
        onMobileToggle={handleMobileToggle}
        onCollapseToggle={handleCollapseToggle}
      />

      <Box
        component="main"
        sx={{
          flexGrow: 1,
          minWidth: 0,
          ml: {
            xs: 0,
            md: `${drawerWidth}px`,
          },
          transition: theme.transitions.create("margin-left", {
            duration: theme.transitions.duration.standard,
          }),
        }}
      >
        <Topbar
          drawerWidth={drawerWidth}
          isMobile={isMobile}
          onMenuClick={handleMobileToggle}
        />

        <Box
          sx={{
            px: {
              xs: 2,
              sm: 3,
              lg: 4,
            },
            py: 3,
          }}
        >
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}

export default DashboardLayout;