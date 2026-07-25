import { useState } from "react";

import {
  KeyboardArrowDown,
  LogoutOutlined,
  Menu,
  NotificationsNoneOutlined,
  PersonOutlineRounded,
  Search,
  SettingsOutlined,
} from "@mui/icons-material";

import {
  AppBar,
  Avatar,
  Badge,
  Box,
  Divider,
  IconButton,
  InputBase,
  ListItemIcon,
  Menu as MuiMenu,
  MenuItem,
  Stack,
  Toolbar,
  Tooltip,
  Typography,
} from "@mui/material";

import { alpha } from "@mui/material/styles";

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

function Topbar({ isMobile, onMenuClick }) {
  const [profileAnchor, setProfileAnchor] = useState(null);
  const [notificationAnchor, setNotificationAnchor] =
    useState(null);

  const closeProfileMenu = () => {
    setProfileAnchor(null);
  };

  const closeNotificationMenu = () => {
    setNotificationAnchor(null);
  };

  const handleLogout = () => {
    closeProfileMenu();
    clearAuthentication();
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        width: "100%",
        zIndex: 1100,
        color: "text.primary",
        bgcolor: alpha("#FFFFFF", 0.94),
        borderBottom: "1px solid",
        borderColor: "divider",
        backdropFilter: "blur(16px)",
        WebkitBackdropFilter: "blur(16px)",
      }}
    >
      <Toolbar
        sx={{
          minHeight: {
            xs: "56px !important",
            md: "62px !important",
          },
          px: {
            xs: 1.5,
            sm: 2,
            md: 2.5,
            xl: 3,
          },
        }}
      >
        {isMobile && (
          <IconButton
            edge="start"
            onClick={onMenuClick}
            aria-label="Open navigation menu"
            sx={{
              mr: 1,
              width: 36,
              height: 36,
              bgcolor: "background.default",
            }}
          >
            <Menu fontSize="small" />
          </IconButton>
        )}

        <Box
          sx={{
            display: {
              xs: "none",
              sm: "flex",
            },
            alignItems: "center",
            width: {
              sm: 270,
              lg: 360,
            },
            height: 38,
            px: 1.4,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2,
            bgcolor: "background.default",

            "&:focus-within": {
              bgcolor: "background.paper",
              borderColor: "primary.light",
              boxShadow: (theme) =>
                `0 0 0 3px ${alpha(
                  theme.palette.primary.main,
                  0.08
                )}`,
            },
          }}
        >
          <Search
            sx={{
              mr: 0.9,
              color: "text.secondary",
              fontSize: 19,
            }}
          />

          <InputBase
            fullWidth
            placeholder="Search products, suppliers..."
            inputProps={{
              "aria-label": "Search application",
            }}
            sx={{
              fontSize: "0.85rem",
            }}
          />
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Stack
          direction="row"
          alignItems="center"
          spacing={0.4}
        >
          <Tooltip title="Notifications">
            <IconButton
              onClick={(event) =>
                setNotificationAnchor(event.currentTarget)
              }
              aria-label="View notifications"
              sx={{
                width: 36,
                height: 36,
              }}
            >
              <Badge
                badgeContent={3}
                color="error"
                overlap="circular"
                sx={{
                  "& .MuiBadge-badge": {
                    minWidth: 17,
                    height: 17,
                    fontSize: "0.65rem",
                    fontWeight: 750,
                  },
                }}
              >
                <NotificationsNoneOutlined fontSize="small" />
              </Badge>
            </IconButton>
          </Tooltip>

          <Divider
            orientation="vertical"
            flexItem
            sx={{
              mx: 0.6,
              display: {
                xs: "none",
                sm: "block",
              },
            }}
          />

          <Stack
            direction="row"
            alignItems="center"
            spacing={0.9}
            onClick={(event) =>
              setProfileAnchor(event.currentTarget)
            }
            sx={{
              py: 0.4,
              px: 0.45,
              pr: {
                md: 0.8,
              },
              cursor: "pointer",
              borderRadius: 2,

              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            <Avatar
              sx={{
                width: 34,
                height: 34,
                background:
                  "linear-gradient(135deg, #3157C8 0%, #1E3A8A 100%)",
                fontSize: "0.77rem",
                fontWeight: 750,
              }}
            >
              AH
            </Avatar>

            <Box
              sx={{
                display: {
                  xs: "none",
                  md: "block",
                },
                minWidth: 105,
              }}
            >
              <Typography
                fontSize="0.82rem"
                fontWeight={750}
                lineHeight={1.25}
              >
                Ali Hussain
              </Typography>

              <Typography
                variant="caption"
                color="text.secondary"
              >
                Administrator
              </Typography>
            </Box>

            <KeyboardArrowDown
              sx={{
                display: {
                  xs: "none",
                  md: "block",
                },
                color: "text.secondary",
                fontSize: 18,
                transform: Boolean(profileAnchor)
                  ? "rotate(180deg)"
                  : "rotate(0deg)",
                transition: "transform 160ms ease",
              }}
            />
          </Stack>
        </Stack>

        <MuiMenu
          anchorEl={notificationAnchor}
          open={Boolean(notificationAnchor)}
          onClose={closeNotificationMenu}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          PaperProps={{
            sx: {
              mt: 0.8,
              width: {
                xs: 285,
                sm: 325,
              },
              maxWidth: "calc(100vw - 20px)",
            },
          }}
        >
          <Box sx={{ px: 1.5, py: 1 }}>
            <Typography fontSize="0.88rem" fontWeight={750}>
              Notifications
            </Typography>

            <Typography variant="caption" color="text.secondary">
              You have 3 unread notifications
            </Typography>
          </Box>

          <Divider />

          <MenuItem onClick={closeNotificationMenu}>
            <Box>
              <Typography variant="body2" fontWeight={650}>
                Low-stock alert
              </Typography>

              <Typography variant="caption" color="text.secondary">
                Review products approaching their reorder level.
              </Typography>
            </Box>
          </MenuItem>

          <MenuItem onClick={closeNotificationMenu}>
            <Box>
              <Typography variant="body2" fontWeight={650}>
                Inventory updated
              </Typography>

              <Typography variant="caption" color="text.secondary">
                A stock transaction was recently recorded.
              </Typography>
            </Box>
          </MenuItem>

          <MenuItem onClick={closeNotificationMenu}>
            <Box>
              <Typography variant="body2" fontWeight={650}>
                Reports ready
              </Typography>

              <Typography variant="caption" color="text.secondary">
                Inventory reports are available.
              </Typography>
            </Box>
          </MenuItem>
        </MuiMenu>

        <MuiMenu
          anchorEl={profileAnchor}
          open={Boolean(profileAnchor)}
          onClose={closeProfileMenu}
          anchorOrigin={{
            vertical: "bottom",
            horizontal: "right",
          }}
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          PaperProps={{
            sx: {
              mt: 0.8,
              minWidth: 205,
            },
          }}
        >
          <Box sx={{ px: 1.5, py: 1 }}>
            <Typography variant="body2" fontWeight={750}>
              Ali Hussain
            </Typography>

            <Typography variant="caption" color="text.secondary">
              Administrator
            </Typography>
          </Box>

          <Divider />

          <MenuItem onClick={closeProfileMenu}>
            <ListItemIcon>
              <PersonOutlineRounded fontSize="small" />
            </ListItemIcon>
            My Profile
          </MenuItem>

          <MenuItem onClick={closeProfileMenu}>
            <ListItemIcon>
              <SettingsOutlined fontSize="small" />
            </ListItemIcon>
            Account Settings
          </MenuItem>

          <Divider />

          <MenuItem
            onClick={handleLogout}
            sx={{
              color: "error.main",

              "& .MuiListItemIcon-root": {
                color: "error.main",
              },
            }}
          >
            <ListItemIcon>
              <LogoutOutlined fontSize="small" />
            </ListItemIcon>
            Logout
          </MenuItem>
        </MuiMenu>
      </Toolbar>
    </AppBar>
  );
}

export default Topbar;