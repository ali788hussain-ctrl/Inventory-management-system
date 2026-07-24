import {
  Box,
  Card,
  CardContent,
  Skeleton,
  Typography,
} from "@mui/material";

const StatCard = ({
  title,
  value,
  icon,
  description,
  loading = false,
  accentColor = "primary.main",
}) => {
  return (
    <Card
      sx={{
        height: "100%",
        border: "1px solid",
        borderColor: "divider",
        boxShadow: "0 4px 20px rgba(15, 23, 42, 0.05)",
        transition: "transform 0.2s ease, box-shadow 0.2s ease",
        "&:hover": {
          transform: "translateY(-3px)",
          boxShadow: "0 10px 30px rgba(15, 23, 42, 0.09)",
        },
      }}
    >
      <CardContent sx={{ p: 3, "&:last-child": { pb: 3 } }}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-start",
            justifyContent: "space-between",
            gap: 2,
          }}
        >
          <Box>
            <Typography
              variant="body2"
              color="text.secondary"
              sx={{ fontWeight: 600, mb: 1 }}
            >
              {title}
            </Typography>

            {loading ? (
              <Skeleton width={90} height={48} />
            ) : (
              <Typography
                variant="h4"
                sx={{
                  fontWeight: 750,
                  lineHeight: 1.2,
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
              width: 48,
              height: 48,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: accentColor,
              bgcolor: `${accentColor}12`,
              flexShrink: 0,
              fontSize: 24,
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