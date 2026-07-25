import { useEffect, useState } from "react";
import {
  Box,
  useMediaQuery,
  useTheme,
} from "@mui/material";
import { Outlet, useLocation } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";

const DRAWER_WIDTH = 248;
const COLLAPSED_DRAWER_WIDTH = 76;

function DashboardLayout() {
  const theme = useTheme();
  const location = useLocation();

  const isMobile = useMediaQuery(
    theme.breakpoints.down("md")
  );

  const [mobileOpen, setMobileOpen] = useState(false);

  const [collapsed, setCollapsed] = useState(() => {
    return localStorage.getItem("sidebar-collapsed") === "true";
  });

  const drawerWidth = collapsed
    ? COLLAPSED_DRAWER_WIDTH
    : DRAWER_WIDTH;

  useEffect(() => {
    setMobileOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    localStorage.setItem(
      "sidebar-collapsed",
      String(collapsed)
    );
  }, [collapsed]);

  const handleMobileToggle = () => {
    setMobileOpen((previous) => !previous);
  };

  const handleCollapseToggle = () => {
    setCollapsed((previous) => !previous);
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "background.default",
      }}
    >
      <Sidebar
        drawerWidth={drawerWidth}
        collapsed={collapsed}
        mobileOpen={mobileOpen}
        isMobile={isMobile}
        onMobileToggle={handleMobileToggle}
        onCollapseToggle={handleCollapseToggle}
      />

      <Box
        sx={{
          minHeight: "100vh",
          minWidth: 0,
          ml: {
            xs: 0,
            md: `${drawerWidth}px`,
          },
          transition: theme.transitions.create(
            "margin-left",
            {
              easing: theme.transitions.easing.sharp,
              duration: 220,
            }
          ),
        }}
      >
        <Topbar
          isMobile={isMobile}
          onMenuClick={handleMobileToggle}
        />

        <Box
          component="main"
          sx={{
            width: "100%",
            px: {
              xs: 1.5,
              sm: 2,
              md: 2.5,
              xl: 3,
            },
            py: {
              xs: 1.5,
              md: 2,
            },
          }}
        >
          <Box
            sx={{
              width: "100%",
              maxWidth: 1760,
              mx: "auto",
            }}
          >
            <Outlet />
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default DashboardLayout;