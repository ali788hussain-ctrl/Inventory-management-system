import {
  AssessmentOutlined,
  CategoryOutlined,
  ChevronRight,
  DashboardOutlined,
  Inventory2Outlined,
  LocalShippingOutlined,
  LogoutOutlined,
  MenuOpenOutlined,
  ReceiptLongOutlined,
} from "@mui/icons-material";

import {
  Avatar,
  Box,
  Divider,
  Drawer,
  IconButton,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Stack,
  Tooltip,
  Typography,
} from "@mui/material";

import { NavLink } from "react-router-dom";

const navigationItems = [
  {
    label: "Dashboard",
    icon: <DashboardOutlined />,
    path: "/dashboard",
  },
  {
    label: "Products",
    icon: <Inventory2Outlined />,
    path: "/products",
  },
  {
    label: "Categories",
    icon: <CategoryOutlined />,
    path: "/categories",
  },
  {
    label: "Suppliers",
    icon: <LocalShippingOutlined />,
    path: "/suppliers",
  },
  {
    label: "Inventory",
    icon: <ReceiptLongOutlined />,
    path: "/inventory",
  },
  {
    label: "Reports",
    icon: <AssessmentOutlined />,
    path: "/reports",
  },
];

function clearAuthentication() {
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("token");
  localStorage.removeItem("user");
  localStorage.removeItem("auth");

  sessionStorage.removeItem("access_token");
  sessionStorage.removeItem("refresh_token");
  sessionStorage.removeItem("token");
  sessionStorage.removeItem("user");
  sessionStorage.removeItem("auth");

  window.location.replace("/login");
}

function SidebarContent({
  collapsed,
  isMobile,
  onCollapseToggle,
  onMobileToggle,
}) {
  const handleLogout = () => {
    if (isMobile) {
      onMobileToggle();
    }

    clearAuthentication();
  };

  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        overflow: "hidden",
        bgcolor: "#0D172B",
        color: "#FFFFFF",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent={
          collapsed ? "center" : "space-between"
        }
        sx={{
          minHeight: 64,
          px: collapsed ? 1 : 1.75,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.15}
          sx={{ minWidth: 0 }}
        >
          <Avatar
            variant="rounded"
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2,
              background:
                "linear-gradient(135deg, #5B8CFF 0%, #3157C8 100%)",
              fontWeight: 800,
              fontSize: "0.9rem",
              boxShadow: "0 5px 14px rgba(49,87,200,0.28)",
            }}
          >
            IM
          </Avatar>

          {!collapsed && (
            <Box sx={{ minWidth: 0 }}>
              <Typography
                fontSize="0.95rem"
                fontWeight={800}
                lineHeight={1.25}
                noWrap
              >
                Inventory Pro
              </Typography>

              <Typography
                variant="caption"
                noWrap
                sx={{
                  color: "rgba(255,255,255,0.53)",
                }}
              >
                Management System
              </Typography>
            </Box>
          )}
        </Stack>

        {!isMobile && !collapsed && (
          <Tooltip title="Collapse sidebar">
            <IconButton
              onClick={onCollapseToggle}
              sx={{
                color: "rgba(255,255,255,0.65)",

                "&:hover": {
                  color: "#FFFFFF",
                  bgcolor: "rgba(255,255,255,0.08)",
                },
              }}
            >
              <MenuOpenOutlined fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Stack>

      <Divider
        sx={{
          borderColor: "rgba(255,255,255,0.07)",
        }}
      />

      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          overflowX: "hidden",
          py: 1.1,
        }}
      >
        {!collapsed && (
          <Typography
            variant="caption"
            sx={{
              display: "block",
              px: 2.25,
              pt: 0.75,
              pb: 0.85,
              color: "rgba(255,255,255,0.37)",
              fontWeight: 750,
              letterSpacing: "0.08em",
              textTransform: "uppercase",
            }}
          >
            Workspace
          </Typography>
        )}

        <List sx={{ px: 1, py: 0 }}>
          {navigationItems.map((item) => (
            <Tooltip
              key={item.path}
              title={collapsed ? item.label : ""}
              placement="right"
              arrow
            >
              <ListItemButton
                component={NavLink}
                to={item.path}
                onClick={
                  isMobile ? onMobileToggle : undefined
                }
                sx={{
                  position: "relative",
                  minHeight: 44,
                  mb: 0.4,
                  px: collapsed ? 1 : 1.45,
                  justifyContent: collapsed
                    ? "center"
                    : "flex-start",
                  borderRadius: 2,
                  color: "rgba(255,255,255,0.68)",
                  overflow: "hidden",

                  "&::before": {
                    content: '""',
                    position: "absolute",
                    left: 0,
                    top: "21%",
                    width: 3,
                    height: "58%",
                    borderRadius: "0 4px 4px 0",
                    bgcolor: "transparent",
                  },

                  "&.active": {
                    bgcolor: "rgba(74,118,223,0.22)",
                    color: "#FFFFFF",

                    "&::before": {
                      bgcolor: "#67A0FF",
                    },

                    "& .MuiListItemIcon-root": {
                      color: "#74A8FF",
                    },
                  },

                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.07)",
                    color: "#FFFFFF",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: collapsed ? 0 : 38,
                    justifyContent: "center",
                    color: "inherit",

                    "& svg": {
                      fontSize: 20,
                    },
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                {!collapsed && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: "0.86rem",
                      fontWeight: 650,
                    }}
                  />
                )}
              </ListItemButton>
            </Tooltip>
          ))}
        </List>
      </Box>

      <Divider
        sx={{
          borderColor: "rgba(255,255,255,0.07)",
        }}
      />

      <Box sx={{ p: 1 }}>
        <Tooltip
          title={collapsed ? "Logout" : ""}
          placement="right"
          arrow
        >
          <ListItemButton
            onClick={handleLogout}
            sx={{
              minHeight: 44,
              px: collapsed ? 1 : 1.45,
              justifyContent: collapsed
                ? "center"
                : "flex-start",
              borderRadius: 2,
              color: "rgba(255,255,255,0.68)",

              "&:hover": {
                bgcolor: "rgba(239,68,68,0.13)",
                color: "#FCA5A5",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: collapsed ? 0 : 38,
                justifyContent: "center",
                color: "inherit",
              }}
            >
              <LogoutOutlined fontSize="small" />
            </ListItemIcon>

            {!collapsed && (
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{
                  fontSize: "0.86rem",
                  fontWeight: 650,
                }}
              />
            )}
          </ListItemButton>
        </Tooltip>

        {!isMobile && collapsed && (
          <Tooltip title="Expand sidebar" placement="right">
            <IconButton
              onClick={onCollapseToggle}
              sx={{
                display: "flex",
                mx: "auto",
                mt: 0.5,
                color: "rgba(255,255,255,0.65)",

                "&:hover": {
                  bgcolor: "rgba(255,255,255,0.08)",
                  color: "#FFFFFF",
                },
              }}
            >
              <ChevronRight fontSize="small" />
            </IconButton>
          </Tooltip>
        )}
      </Box>
    </Box>
  );
}

function Sidebar({
  drawerWidth,
  collapsed,
  mobileOpen,
  isMobile,
  onMobileToggle,
  onCollapseToggle,
}) {
  const commonPaperStyles = {
    width: drawerWidth,
    boxSizing: "border-box",
    border: 0,
    overflowX: "hidden",
    transition: "width 220ms ease",
  };

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          "& .MuiDrawer-paper": {
            ...commonPaperStyles,
            width: 248,
          },
        }}
      >
        <SidebarContent
          collapsed={false}
          isMobile
          onCollapseToggle={onCollapseToggle}
          onMobileToggle={onMobileToggle}
        />
      </Drawer>
    );
  }

  return (
    <Drawer
      variant="permanent"
      open
      sx={{
        width: drawerWidth,
        flexShrink: 0,

        "& .MuiDrawer-paper": commonPaperStyles,
      }}
    >
      <SidebarContent
        collapsed={collapsed}
        isMobile={false}
        onCollapseToggle={onCollapseToggle}
        onMobileToggle={onMobileToggle}
      />
    </Drawer>
  );
}

export default Sidebar;