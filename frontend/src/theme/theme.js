import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: "#1E3A8A",
      light: "#3B82F6",
      dark: "#172554",
      contrastText: "#FFFFFF",
    },

    secondary: {
      main: "#475569",
      light: "#64748B",
      dark: "#1E293B",
      contrastText: "#FFFFFF",
    },

    success: {
      main: "#16A34A",
    },

    warning: {
      main: "#D97706",
    },

    error: {
      main: "#DC2626",
    },

    info: {
      main: "#0284C7",
    },

    background: {
      default: "#F5F7FB",
      paper: "#FFFFFF",
    },

    text: {
      primary: "#0F172A",
      secondary: "#64748B",
    },

    divider: "#E2E8F0",
  },

  typography: {
    fontFamily: '"Inter", "Roboto", "Arial", sans-serif',

    h1: {
      fontSize: "2.25rem",
      fontWeight: 700,
      lineHeight: 1.2,
    },

    h2: {
      fontSize: "1.875rem",
      fontWeight: 700,
      lineHeight: 1.25,
    },

    h3: {
      fontSize: "1.5rem",
      fontWeight: 700,
    },

    h4: {
      fontSize: "1.25rem",
      fontWeight: 600,
    },

    h5: {
      fontSize: "1.125rem",
      fontWeight: 600,
    },

    h6: {
      fontSize: "1rem",
      fontWeight: 600,
    },

    body1: {
      fontSize: "0.95rem",
      lineHeight: 1.6,
    },

    body2: {
      fontSize: "0.875rem",
      lineHeight: 1.5,
    },

    button: {
      textTransform: "none",
      fontWeight: 600,
    },
  },

  shape: {
    borderRadius: 12,
  },

  shadows: [
    "none",
    "0 1px 2px rgba(15, 23, 42, 0.04)",
    "0 2px 6px rgba(15, 23, 42, 0.06)",
    "0 4px 12px rgba(15, 23, 42, 0.08)",
    "0 6px 18px rgba(15, 23, 42, 0.10)",
    ...Array(20).fill("0 8px 24px rgba(15, 23, 42, 0.12)"),
  ],

  components: {
    MuiCssBaseline: {
      styleOverrides: {
        "*": {
          boxSizing: "border-box",
        },

        html: {
          scrollBehavior: "smooth",
        },

        body: {
          margin: 0,
          minWidth: "320px",
          backgroundColor: "#F5F7FB",
        },

        a: {
          color: "inherit",
          textDecoration: "none",
        },
      },
    },

    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },

      styleOverrides: {
        root: {
          minHeight: 42,
          padding: "10px 18px",
          borderRadius: 10,
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          border: "1px solid #E2E8F0",
          boxShadow: "0 4px 14px rgba(15, 23, 42, 0.05)",
          borderRadius: 14,
        },
      },
    },

    MuiPaper: {
      styleOverrides: {
        root: {
          backgroundImage: "none",
        },
      },
    },

    MuiTextField: {
      defaultProps: {
        size: "small",
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          borderRadius: 10,
          backgroundColor: "#FFFFFF",
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        head: {
          fontWeight: 700,
          color: "#334155",
          backgroundColor: "#F8FAFC",
        },

        root: {
          borderColor: "#E2E8F0",
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 16,
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          fontWeight: 600,
          borderRadius: 8,
        },
      },
    },
  },
});

export default theme;