import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useLocation, useNavigate } from "react-router-dom";

import {
  ArrowForward,
  EmailOutlined,
  Inventory2Outlined,
  LockOutlined,
  Visibility,
  VisibilityOff,
} from "@mui/icons-material";

import {
  Alert,
  Box,
  Button,
  Checkbox,
  CircularProgress,
  FormControlLabel,
  IconButton,
  InputAdornment,
  Link,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";

import useAuth from "../../hooks/useAuth";

function LoginPage() {
  const navigate = useNavigate();
  const location = useLocation();

  const {
    login,
    isAuthenticated,
    isInitializing,
  } = useAuth();

  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState("");

  const {
    register,
    handleSubmit,
    formState: {
      errors,
      isSubmitting,
    },
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  useEffect(() => {
    if (isAuthenticated && !isInitializing) {
      navigate("/dashboard", { replace: true });
    }
  }, [isAuthenticated, isInitializing, navigate]);

  const onSubmit = async (formData) => {
    setServerError("");

    try {
      await login({
        email: formData.email.trim(),
        password: formData.password,
      });

      const destination =
        location.state?.from?.pathname || "/dashboard";

      navigate(destination, { replace: true });
    } catch (error) {
      const errorDetail = error.response?.data?.detail;

      if (typeof errorDetail === "string") {
        setServerError(errorDetail);
        return;
      }

      if (!error.response) {
        setServerError(
          "Unable to connect to the server. Make sure the backend is running.",
        );
        return;
      }

      setServerError(
        "Login failed. Please verify your email and password.",
      );
    }
  };

  return (
    <Box
      sx={{
        minHeight: "100vh",
        display: "grid",
        gridTemplateColumns: {
          xs: "1fr",
          lg: "minmax(420px, 0.95fr) minmax(520px, 1.05fr)",
        },
        bgcolor: "background.default",
      }}
    >
      {/* Branding section */}
      <Box
        sx={{
          display: {
            xs: "none",
            lg: "flex",
          },
          position: "relative",
          overflow: "hidden",
          flexDirection: "column",
          justifyContent: "space-between",
          p: 7,
          color: "#FFFFFF",
          background:
            "linear-gradient(145deg, #0B1120 0%, #172554 48%, #1E3A8A 100%)",
        }}
      >
        <Box
          sx={{
            position: "absolute",
            width: 420,
            height: 420,
            borderRadius: "50%",
            top: -170,
            right: -130,
            bgcolor: "rgba(96, 165, 250, 0.14)",
          }}
        />

        <Box
          sx={{
            position: "absolute",
            width: 300,
            height: 300,
            borderRadius: "50%",
            bottom: -120,
            left: -90,
            bgcolor: "rgba(255, 255, 255, 0.06)",
          }}
        />

        <Stack
          direction="row"
          alignItems="center"
          spacing={1.5}
          sx={{ position: "relative", zIndex: 1 }}
        >
          <Box
            sx={{
              width: 48,
              height: 48,
              display: "grid",
              placeItems: "center",
              borderRadius: 2.5,
              background:
                "linear-gradient(135deg, #6C9BFF 0%, #3157C8 100%)",
              boxShadow: "0 12px 32px rgba(59, 130, 246, 0.35)",
            }}
          >
            <Inventory2Outlined />
          </Box>

          <Box>
            <Typography variant="h5" fontWeight={800}>
              Inventory Pro
            </Typography>

            <Typography
              variant="body2"
              sx={{ color: "rgba(255,255,255,0.65)" }}
            >
              Advanced Management Platform
            </Typography>
          </Box>
        </Stack>

        <Box
          sx={{
            position: "relative",
            zIndex: 1,
            maxWidth: 560,
          }}
        >
          <Typography
            component="h1"
            sx={{
              fontSize: {
                lg: "2.8rem",
                xl: "3.4rem",
              },
              lineHeight: 1.12,
              fontWeight: 800,
              letterSpacing: "-0.035em",
            }}
          >
            Smarter inventory decisions begin here.
          </Typography>

          <Typography
            sx={{
              mt: 3,
              maxWidth: 500,
              fontSize: "1.05rem",
              lineHeight: 1.8,
              color: "rgba(255,255,255,0.7)",
            }}
          >
            Track products, suppliers, stock movement, and business
            performance through one secure and organized workspace.
          </Typography>

          <Stack
            direction="row"
            spacing={4}
            sx={{ mt: 5 }}
          >
            <Box>
              <Typography variant="h4" fontWeight={800}>
                Real-time
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: "rgba(255,255,255,0.6)" }}
              >
                Inventory insights
              </Typography>
            </Box>

            <Box>
              <Typography variant="h4" fontWeight={800}>
                Secure
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: "rgba(255,255,255,0.6)" }}
              >
                JWT authentication
              </Typography>
            </Box>

            <Box>
              <Typography variant="h4" fontWeight={800}>
                Scalable
              </Typography>

              <Typography
                variant="body2"
                sx={{ color: "rgba(255,255,255,0.6)" }}
              >
                Modern architecture
              </Typography>
            </Box>
          </Stack>
        </Box>

        <Typography
          variant="caption"
          sx={{
            position: "relative",
            zIndex: 1,
            color: "rgba(255,255,255,0.45)",
          }}
        >
          © 2026 Inventory Pro. Professional inventory management.
        </Typography>
      </Box>

      {/* Login form */}
      <Box
        sx={{
          display: "grid",
          placeItems: "center",
          px: {
            xs: 2,
            sm: 4,
            md: 8,
          },
          py: 5,
        }}
      >
        <Box sx={{ width: "100%", maxWidth: 470 }}>
          <Stack
            direction="row"
            alignItems="center"
            spacing={1.25}
            sx={{
              display: {
                xs: "flex",
                lg: "none",
              },
              mb: 5,
            }}
          >
            <Box
              sx={{
                width: 42,
                height: 42,
                display: "grid",
                placeItems: "center",
                borderRadius: 2.5,
                background:
                  "linear-gradient(135deg, #3157C8 0%, #1E3A8A 100%)",
                color: "#FFFFFF",
              }}
            >
              <Inventory2Outlined />
            </Box>

            <Typography variant="h5" fontWeight={800}>
              Inventory Pro
            </Typography>
          </Stack>

          <Paper
            elevation={0}
            sx={{
              p: {
                xs: 3,
                sm: 5,
              },
              border: "1px solid",
              borderColor: "divider",
              borderRadius: 3.5,
              boxShadow: "0 24px 60px rgba(15, 23, 42, 0.08)",
            }}
          >
            <Box sx={{ mb: 4 }}>
              <Typography
                variant="h3"
                component="h2"
                sx={{ letterSpacing: "-0.025em" }}
              >
                Welcome back
              </Typography>

              <Typography
                color="text.secondary"
                sx={{ mt: 1 }}
              >
                Sign in to access your inventory workspace.
              </Typography>
            </Box>

            {serverError && (
              <Alert
                severity="error"
                sx={{ mb: 3 }}
                onClose={() => setServerError("")}
              >
                {serverError}
              </Alert>
            )}

            <Box
              component="form"
              noValidate
              onSubmit={handleSubmit(onSubmit)}
            >
              <Stack spacing={2.5}>
                <TextField
                  fullWidth
                  label="Email address"
                  placeholder="you@example.com"
                  autoComplete="email"
                  autoFocus
                  error={Boolean(errors.email)}
                  helperText={errors.email?.message}
                  {...register("email", {
                    required: "Email address is required.",
                    pattern: {
                      value:
                        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message:
                        "Enter a valid email address.",
                    },
                  })}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <EmailOutlined
                            sx={{
                              color: "text.secondary",
                              fontSize: 21,
                            }}
                          />
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <TextField
                  fullWidth
                  label="Password"
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  autoComplete="current-password"
                  error={Boolean(errors.password)}
                  helperText={errors.password?.message}
                  {...register("password", {
                    required: "Password is required.",
                    minLength: {
                      value: 6,
                      message:
                        "Password must contain at least 6 characters.",
                    },
                  })}
                  slotProps={{
                    input: {
                      startAdornment: (
                        <InputAdornment position="start">
                          <LockOutlined
                            sx={{
                              color: "text.secondary",
                              fontSize: 21,
                            }}
                          />
                        </InputAdornment>
                      ),
                      endAdornment: (
                        <InputAdornment position="end">
                          <IconButton
                            edge="end"
                            type="button"
                            aria-label={
                              showPassword
                                ? "Hide password"
                                : "Show password"
                            }
                            onClick={() =>
                              setShowPassword(
                                (previous) => !previous,
                              )
                            }
                          >
                            {showPassword ? (
                              <VisibilityOff />
                            ) : (
                              <Visibility />
                            )}
                          </IconButton>
                        </InputAdornment>
                      ),
                    },
                  }}
                />

                <Stack
                  direction="row"
                  alignItems="center"
                  justifyContent="space-between"
                >
                  <FormControlLabel
                    control={
                      <Checkbox
                        size="small"
                        defaultChecked
                        {...register("rememberMe")}
                      />
                    }
                    label={
                      <Typography variant="body2">
                        Remember me
                      </Typography>
                    }
                  />

                  <Link
                    component="button"
                    type="button"
                    underline="hover"
                    variant="body2"
                    fontWeight={650}
                  >
                    Forgot password?
                  </Link>
                </Stack>

                <Button
                  fullWidth
                  type="submit"
                  variant="contained"
                  size="large"
                  disabled={isSubmitting}
                  endIcon={
                    isSubmitting ? null : <ArrowForward />
                  }
                  sx={{
                    minHeight: 50,
                    mt: 1,
                  }}
                >
                  {isSubmitting ? (
                    <Stack
                      direction="row"
                      alignItems="center"
                      spacing={1.25}
                    >
                      <CircularProgress
                        size={20}
                        color="inherit"
                      />

                      <span>Signing in...</span>
                    </Stack>
                  ) : (
                    "Sign in to dashboard"
                  )}
                </Button>
              </Stack>
            </Box>

            <Typography
              variant="caption"
              color="text.secondary"
              display="block"
              textAlign="center"
              sx={{ mt: 4 }}
            >
              Protected by secure token-based authentication.
            </Typography>
          </Paper>
        </Box>
      </Box>
    </Box>
  );
}

export default LoginPage;