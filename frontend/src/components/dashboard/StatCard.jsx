import {
  Box,
  Card,
  CardContent,
  Skeleton,
  Typography,
} from "@mui/material";
import { alpha } from "@mui/material/styles";

const StatCard = ({
  title,
  value,
  icon,
  description,
  loading = false,
  accentColor = "#3157C8",
}) => {
  return (
    <Card
      sx={{
        height: "100%",
        position: "relative",
        overflow: "hidden",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",

        "&::before": {
          content: '""',
          position: "absolute",
          top: 0,
          left: 0,
          right: 0,
          height: 3,
          bgcolor: accentColor,
        },

        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow:
            "0 4px 10px rgba(15,23,42,0.06), 0 16px 34px rgba(15,23,42,0.09)",
        },
      }}
    >
      <CardContent sx={{ p: 2.75, "&:last-child": { pb: 2.75 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box sx={{ minWidth: 0 }}>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 650, mb: 1 }}
              noWrap
            >
              {title}
            </Typography>

            {loading ? (
              <Skeleton width={90} height={44} />
            ) : (
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 800,
                  lineHeight: 1.2,
                  letterSpacing: "-0.02em",
                  color: "text.primary",
                }}
              >
                {value}
              </Typography>
            )}

            {description && (
              <Typography
                variant="caption"
                color="text.secondary"
                sx={{ display: "block", mt: 1 }}
              >
                {description}
              </Typography>
            )}
          </Box>

          <Box
            sx={{
              width: 46,
              height: 46,
              borderRadius: 2.5,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: accentColor,
              bgcolor: alpha(accentColor, 0.12),
              flexShrink: 0,
              fontSize: 22,
            }}
          >
            {icon}
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default StatCard;