import {
  AssessmentOutlined,
  CategoryOutlined,
  ChevronLeft,
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

function SidebarContent({
  collapsed,
  isMobile,
  onCollapseToggle,
  onMobileToggle,
}) {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        bgcolor: "#0F172A",
        color: "#FFFFFF",
      }}
    >
      <Stack
        direction="row"
        alignItems="center"
        justifyContent={collapsed ? "center" : "space-between"}
        sx={{
          minHeight: 76,
          px: collapsed ? 1.5 : 2.5,
        }}
      >
        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{ minWidth: 0 }}
        >
          <Avatar
            variant="rounded"
            sx={{
              width: 42,
              height: 42,
              bgcolor: "primary.light",
              fontWeight: 800,
            }}
          >
            IM
          </Avatar>

          {!collapsed && (
            <Box sx={{ minWidth: 0 }}>
              <Typography
                variant="subtitle1"
                fontWeight={800}
                noWrap
              >
                Inventory Pro
              </Typography>

              <Typography
                variant="caption"
                sx={{ color: "rgba(255,255,255,0.6)" }}
              >
                Management System
              </Typography>
            </Box>
          )}
        </Stack>

        {!isMobile && !collapsed && (
          <IconButton
            onClick={onCollapseToggle}
            sx={{ color: "rgba(255,255,255,0.7)" }}
          >
            <MenuOpenOutlined />
          </IconButton>
        )}
      </Stack>

      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

      <List sx={{ px: 1.5, py: 2 }}>
        {navigationItems.map((item) => (
          <Tooltip
            key={item.path}
            title={collapsed ? item.label : ""}
            placement="right"
          >
            <ListItemButton
              component={NavLink}
              to={item.path}
              onClick={isMobile ? onMobileToggle : undefined}
              sx={{
                minHeight: 48,
                mb: 0.75,
                px: collapsed ? 1.5 : 2,
                justifyContent: collapsed ? "center" : "flex-start",
                borderRadius: 2.5,
                color: "rgba(255,255,255,0.72)",

                "&.active": {
                  bgcolor: "rgba(59,130,246,0.18)",
                  color: "#FFFFFF",

                  "& .MuiListItemIcon-root": {
                    color: "#60A5FA",
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
                  minWidth: collapsed ? 0 : 42,
                  justifyContent: "center",
                  color: "inherit",
                }}
              >
                {item.icon}
              </ListItemIcon>

              {!collapsed && (
                <ListItemText
                  primary={item.label}
                  primaryTypographyProps={{
                    fontSize: "0.9rem",
                    fontWeight: 600,
                  }}
                />
              )}
            </ListItemButton>
          </Tooltip>
        ))}
      </List>

      <Box sx={{ flexGrow: 1 }} />

      <Divider sx={{ borderColor: "rgba(255,255,255,0.08)" }} />

      <Box sx={{ p: 1.5 }}>
        <Tooltip
          title={collapsed ? "Logout" : ""}
          placement="right"
        >
          <ListItemButton
            sx={{
              minHeight: 48,
              px: collapsed ? 1.5 : 2,
              justifyContent: collapsed ? "center" : "flex-start",
              borderRadius: 2.5,
              color: "rgba(255,255,255,0.72)",

              "&:hover": {
                bgcolor: "rgba(239,68,68,0.12)",
                color: "#FCA5A5",
              },
            }}
          >
            <ListItemIcon
              sx={{
                minWidth: collapsed ? 0 : 42,
                justifyContent: "center",
                color: "inherit",
              }}
            >
              <LogoutOutlined />
            </ListItemIcon>

            {!collapsed && (
              <ListItemText
                primary="Logout"
                primaryTypographyProps={{
                  fontSize: "0.9rem",
                  fontWeight: 600,
                }}
              />
            )}
          </ListItemButton>
        </Tooltip>

        {!isMobile && (
          <IconButton
            onClick={onCollapseToggle}
            sx={{
              display: collapsed ? "flex" : "none",
              mx: "auto",
              mt: 1,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            {collapsed ? <ChevronRight /> : <ChevronLeft />}
          </IconButton>
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
  const commonDrawerStyles = {
    "& .MuiDrawer-paper": {
      width: drawerWidth,
      boxSizing: "border-box",
      border: 0,
      overflowX: "hidden",
      transition: "width 250ms ease",
    },
  };

  if (isMobile) {
    return (
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onMobileToggle}
        ModalProps={{ keepMounted: true }}
        sx={commonDrawerStyles}
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
      sx={commonDrawerStyles}
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