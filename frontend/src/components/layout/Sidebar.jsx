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
        bgcolor: "#0B1120",
        backgroundImage:
          "radial-gradient(circle at 0% 0%, rgba(91,140,255,0.12), transparent 45%)",
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
          minHeight: 66,
          px: collapsed ? 1 : 2,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.25}
          sx={{ minWidth: 0 }}
        >
          <Avatar
            variant="rounded"
            sx={{
              width: 38,
              height: 38,
              borderRadius: 2.25,
              background:
                "linear-gradient(135deg, #6C9BFF 0%, #3157C8 60%, #1E3A8A 100%)",
              fontWeight: 800,
              fontSize: "0.9rem",
              letterSpacing: "-0.02em",
              boxShadow: "0 6px 16px rgba(49,87,200,0.35)",
            }}
          >
            IM
          </Avatar>

          {!collapsed && (
            <Box sx={{ minWidth: 0 }}>
              <Typography
                fontSize="0.96rem"
                fontWeight={800}
                lineHeight={1.25}
                letterSpacing="-0.01em"
                noWrap
              >
                Inventory Pro
              </Typography>

              <Typography
                variant="caption"
                noWrap
                sx={{
                  color: "rgba(255,255,255,0.48)",
                  fontWeight: 500,
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
                color: "rgba(255,255,255,0.55)",

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
          borderColor: "rgba(255,255,255,0.06)",
        }}
      />

      <Box
        sx={{
          flexGrow: 1,
          overflowY: "auto",
          overflowX: "hidden",
          py: 1.25,
        }}
      >
        {!collapsed && (
          <Typography
            variant="caption"
            sx={{
              display: "block",
              px: 2.5,
              pt: 0.75,
              pb: 1,
              color: "rgba(255,255,255,0.32)",
              fontWeight: 750,
              letterSpacing: "0.1em",
              textTransform: "uppercase",
            }}
          >
            Workspace
          </Typography>
        )}

        <List sx={{ px: 1.25, py: 0 }}>
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
                  minHeight: 42,
                  mb: 0.35,
                  px: collapsed ? 1 : 1.5,
                  justifyContent: collapsed
                    ? "center"
                    : "flex-start",
                  borderRadius: 2.5,
                  color: "rgba(255,255,255,0.6)",
                  transition:
                    "background-color 160ms ease, color 160ms ease",

                  "&.active": {
                    bgcolor: "#3157C8",
                    color: "#FFFFFF",
                    boxShadow: "0 6px 16px rgba(49,87,200,0.35)",

                    "& .MuiListItemIcon-root": {
                      color: "#FFFFFF",
                    },

                    "&:hover": {
                      bgcolor: "#3157C8",
                    },
                  },

                  "&:hover": {
                    bgcolor: "rgba(255,255,255,0.06)",
                    color: "#FFFFFF",
                  },
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: collapsed ? 0 : 36,
                    justifyContent: "center",
                    color: "inherit",

                    "& svg": {
                      fontSize: 19,
                    },
                  }}
                >
                  {item.icon}
                </ListItemIcon>

                {!collapsed && (
                  <ListItemText
                    primary={item.label}
                    primaryTypographyProps={{
                      fontSize: "0.85rem",
                      fontWeight: 600,
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
          borderColor: "rgba(255,255,255,0.06)",
        }}
      />

      <Box sx={{ p: 1.25 }}>
        <Tooltip
          title={collapsed ? "Logout" : ""}
          placement="right"
          arrow
        >
          <ListItemButton
            onClick={handleLogout}
            sx={{
              minHeight: 42,
              px: collapsed ? 1 : 1.5,
              justifyContent: collapsed
                ? "center"
                : "flex-start",
              borderRadius: 2.5,
              color: "rgba(255,255,255,0.6)",

              "&:hover": {
                bgcolor: "rgba(239,68,68,0.14)",
                color: "#FCA5A5",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: collapsed ? 0 : 36,
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
                  fontSize: "0.85rem",
                  fontWeight: 600,
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
                color: "rgba(255,255,255,0.55)",

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