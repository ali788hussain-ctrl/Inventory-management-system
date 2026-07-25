import { alpha, createTheme } from "@mui/material/styles";

const PRIMARY = "#3157C8";
const PRIMARY_DARK = "#1E3A8A";
const BORDER = "#E2E8F0";
const BACKGROUND = "#F4F7FB";

const theme = createTheme({
  palette: {
    mode: "light",

    primary: {
      main: PRIMARY,
      light: "#5F7FE0",
      dark: PRIMARY_DARK,
      contrastText: "#FFFFFF",
    },

    secondary: {
      main: "#64748B",
      dark: "#334155",
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
      default: BACKGROUND,
      paper: "#FFFFFF",
    },

    text: {
      primary: "#0F172A",
      secondary: "#64748B",
      disabled: "#94A3B8",
    },

    divider: BORDER,

    action: {
      hover: alpha(PRIMARY, 0.055),
      selected: alpha(PRIMARY, 0.1),
      focus: alpha(PRIMARY, 0.12),
      disabledBackground: "#EEF2F6",
    },
  },

  typography: {
    fontFamily:
      '"Inter", "Segoe UI", "Roboto", "Helvetica Neue", Arial, sans-serif',

    h1: {
      fontSize: "2rem",
      fontWeight: 800,
      lineHeight: 1.2,
      letterSpacing: "-0.03em",
    },

    h2: {
      fontSize: "1.7rem",
      fontWeight: 800,
      lineHeight: 1.25,
      letterSpacing: "-0.025em",
    },

    h3: {
      fontSize: "1.4rem",
      fontWeight: 750,
      lineHeight: 1.3,
      letterSpacing: "-0.02em",
    },

    h4: {
      fontSize: "1.25rem",
      fontWeight: 750,
      lineHeight: 1.35,
      letterSpacing: "-0.015em",
    },

    h5: {
      fontSize: "1.08rem",
      fontWeight: 700,
    },

    h6: {
      fontSize: "0.98rem",
      fontWeight: 700,
    },

    subtitle1: {
      fontSize: "0.96rem",
      fontWeight: 650,
    },

    body1: {
      fontSize: "0.91rem",
      lineHeight: 1.55,
    },

    body2: {
      fontSize: "0.84rem",
      lineHeight: 1.5,
    },

    caption: {
      fontSize: "0.74rem",
      lineHeight: 1.4,
    },

    button: {
      fontSize: "0.83rem",
      fontWeight: 700,
      textTransform: "none",
    },
  },

  shape: {
    borderRadius: 10,
  },

  shadows: [
    "none",
    "0 1px 2px rgba(15,23,42,0.04)",
    "0 2px 5px rgba(15,23,42,0.05)",
    "0 4px 10px rgba(15,23,42,0.055)",
    "0 5px 14px rgba(15,23,42,0.06)",
    "0 7px 18px rgba(15,23,42,0.07)",
    "0 9px 22px rgba(15,23,42,0.08)",
    ...Array(18).fill("0 12px 30px rgba(15,23,42,0.1)"),
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
          overflowX: "hidden",
          backgroundColor: BACKGROUND,
          color: "#0F172A",
        },

        "#root": {
          minHeight: "100vh",
        },

        a: {
          color: "inherit",
          textDecoration: "none",
        },

        "::-webkit-scrollbar": {
          width: 8,
          height: 8,
        },

        "::-webkit-scrollbar-track": {
          background: "#F1F5F9",
        },

        "::-webkit-scrollbar-thumb": {
          background: "#CBD5E1",
          borderRadius: 8,
        },

        "::-webkit-scrollbar-thumb:hover": {
          background: "#94A3B8",
        },
      },
    },

    MuiButton: {
      defaultProps: {
        disableElevation: true,
        size: "small",
      },

      styleOverrides: {
        root: {
          minHeight: 36,
          padding: "7px 14px",
          borderRadius: 8,
          whiteSpace: "nowrap",
          transition:
            "transform 160ms ease, box-shadow 160ms ease, background-color 160ms ease",

          "&:hover": {
            transform: "translateY(-1px)",
          },
        },

        containedPrimary: {
          boxShadow: "0 4px 10px rgba(49,87,200,0.18)",

          "&:hover": {
            boxShadow: "0 6px 15px rgba(49,87,200,0.24)",
          },
        },

        outlined: {
          borderColor: BORDER,

          "&:hover": {
            borderColor: alpha(PRIMARY, 0.45),
            backgroundColor: alpha(PRIMARY, 0.035),
          },
        },
      },
    },

    MuiIconButton: {
      defaultProps: {
        size: "small",
      },

      styleOverrides: {
        root: {
          transition:
            "background-color 160ms ease, color 160ms ease, transform 160ms ease",

          "&:hover": {
            transform: "translateY(-1px)",
          },
        },
      },
    },

    MuiCard: {
      styleOverrides: {
        root: {
          border: `1px solid ${BORDER}`,
          borderRadius: 12,
          boxShadow: "0 3px 12px rgba(15,23,42,0.04)",
          backgroundImage: "none",
        },
      },
    },

    MuiCardContent: {
      styleOverrides: {
        root: {
          padding: 16,

          "&:last-child": {
            paddingBottom: 16,
          },
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

    MuiFormControl: {
      defaultProps: {
        size: "small",
      },
    },

    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          minHeight: 38,
          borderRadius: 8,
          backgroundColor: "#FFFFFF",

          "& .MuiOutlinedInput-notchedOutline": {
            borderColor: "#D8E0EA",
          },

          "&:hover .MuiOutlinedInput-notchedOutline": {
            borderColor: "#AEBBCB",
          },

          "&.Mui-focused": {
            boxShadow: `0 0 0 3px ${alpha(PRIMARY, 0.09)}`,
          },

          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderWidth: 1,
          },
        },
      },
    },

    MuiInputBase: {
      styleOverrides: {
        input: {
          paddingTop: 8.5,
          paddingBottom: 8.5,
        },
      },
    },

    MuiInputLabel: {
      styleOverrides: {
        root: {
          fontSize: "0.86rem",
          fontWeight: 500,
        },
      },
    },

    MuiTableContainer: {
      styleOverrides: {
        root: {
          overflowX: "auto",
        },
      },
    },

    MuiTableCell: {
      styleOverrides: {
        head: {
          padding: "11px 14px",
          fontSize: "0.79rem",
          fontWeight: 750,
          color: "#334155",
          backgroundColor: "#F8FAFC",
          whiteSpace: "nowrap",
        },

        body: {
          padding: "11px 14px",
          fontSize: "0.84rem",
        },

        root: {
          borderColor: BORDER,
        },
      },
    },

    MuiTableRow: {
      styleOverrides: {
        root: {
          "&.MuiTableRow-hover:hover": {
            backgroundColor: "#F8FAFD",
          },
        },
      },
    },

    MuiDialog: {
      styleOverrides: {
        paper: {
          borderRadius: 14,
          border: `1px solid ${BORDER}`,
          boxShadow: "0 22px 65px rgba(15,23,42,0.18)",
        },
      },
    },

    MuiDialogTitle: {
      styleOverrides: {
        root: {
          padding: "18px 20px 12px",
          fontSize: "1.05rem",
        },
      },
    },

    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: 20,
        },
      },
    },

    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: "12px 20px 18px",
        },
      },
    },

    MuiChip: {
      styleOverrides: {
        root: {
          height: 25,
          borderRadius: 7,
          fontSize: "0.73rem",
          fontWeight: 700,
        },

        sizeSmall: {
          height: 24,
        },
      },
    },

    MuiMenu: {
      styleOverrides: {
        paper: {
          marginTop: 5,
          border: `1px solid ${BORDER}`,
          borderRadius: 10,
          boxShadow: "0 14px 36px rgba(15,23,42,0.13)",
        },
      },
    },

    MuiMenuItem: {
      styleOverrides: {
        root: {
          minHeight: 38,
          margin: "2px 5px",
          padding: "7px 10px",
          borderRadius: 7,
          fontSize: "0.84rem",
        },
      },
    },

    MuiPaginationItem: {
      styleOverrides: {
        root: {
          minWidth: 30,
          height: 30,
          borderRadius: 7,
          fontSize: "0.8rem",
          fontWeight: 650,
        },
      },
    },

    MuiTooltip: {
      styleOverrides: {
        tooltip: {
          borderRadius: 7,
          fontSize: "0.72rem",
          fontWeight: 600,
        },
      },
    },
  },
});

export default theme;