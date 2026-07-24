import { useState } from "react";

import {
  KeyboardArrowDown,
  Menu,
  NotificationsNoneOutlined,
  Search,
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
  Typography,
} from "@mui/material";

function Topbar({ drawerWidth, isMobile, onMenuClick }) {
  const [anchorEl, setAnchorEl] = useState(null);

  const handleProfileOpen = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleProfileClose = () => {
    setAnchorEl(null);
  };

  return (
    <AppBar
      position="sticky"
      elevation={0}
      sx={{
        width: "100%",
        bgcolor: "rgba(255,255,255,0.92)",
        color: "text.primary",
        borderBottom: "1px solid",
        borderColor: "divider",
        backdropFilter: "blur(16px)",
      }}
    >
      <Toolbar
        sx={{
          minHeight: "76px !important",
          px: {
            xs: 2,
            sm: 3,
            lg: 4,
          },
        }}
      >
        {isMobile && (
          <IconButton
            edge="start"
            onClick={onMenuClick}
            sx={{ mr: 1 }}
          >
            <Menu />
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
              sm: 260,
              lg: 360,
            },
            px: 2,
            py: 1,
            border: "1px solid",
            borderColor: "divider",
            borderRadius: 2.5,
            bgcolor: "background.default",
          }}
        >
          <Search
            sx={{
              mr: 1,
              color: "text.secondary",
              fontSize: 21,
            }}
          />

          <InputBase
            fullWidth
            placeholder="Search products, suppliers..."
            inputProps={{
              "aria-label": "Search application",
            }}
          />
        </Box>

        <Box sx={{ flexGrow: 1 }} />

        <Stack
          direction="row"
          alignItems="center"
          spacing={1}
        >
          <IconButton>
            <Badge
              badgeContent={3}
              color="error"
            >
              <NotificationsNoneOutlined />
            </Badge>
          </IconButton>

          <Divider
            orientation="vertical"
            flexItem
            sx={{
              mx: 1,
              display: {
                xs: "none",
                sm: "block",
              },
            }}
          />

          <Stack
            direction="row"
            alignItems="center"
            spacing={1.25}
            onClick={handleProfileOpen}
            sx={{
              p: 0.75,
              pr: 1.25,
              cursor: "pointer",
              borderRadius: 2.5,

              "&:hover": {
                bgcolor: "action.hover",
              },
            }}
          >
            <Avatar
              sx={{
                width: 38,
                height: 38,
                bgcolor: "primary.main",
                fontSize: "0.9rem",
                fontWeight: 700,
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
              }}
            >
              <Typography
                variant="body2"
                fontWeight={700}
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
              }}
            />
          </Stack>
        </Stack>

        <MuiMenu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={handleProfileClose}
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
              mt: 1.5,
              minWidth: 190,
              border: "1px solid",
              borderColor: "divider",
              boxShadow: "0 14px 35px rgba(15,23,42,0.14)",
            },
          }}
        >
          <MenuItem onClick={handleProfileClose}>
            My Profile
          </MenuItem>

          <MenuItem onClick={handleProfileClose}>
            Account Settings
          </MenuItem>

          <Divider />

          <MenuItem
            onClick={handleProfileClose}
            sx={{ color: "error.main" }}
          >
            <ListItemIcon />
            Logout
          </MenuItem>
        </MuiMenu>
      </Toolbar>
    </AppBar>
  );
}

export default Topbar;