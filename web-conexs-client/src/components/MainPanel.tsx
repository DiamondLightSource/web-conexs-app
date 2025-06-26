import { Box, Paper, useTheme } from "@mui/material";

export default function MainPanel(props: { children: React.ReactNode }) {
  const theme = useTheme();

  const sideGap = theme.spacing(10);

  console.log(sideGap);
  return (
    <Box
      display="flex"
      justifyContent="center"
      alignItems="stretch"
      flex={1}
      minHeight={0}
    >
      <Paper
        flex={1}
        sx={{
          margin: "10px 10px 10px " + sideGap,
          flex: 1,
          minHeight: 0,
          alignItems: "stretch",
          display: "flex",
          flexDirection: "column",
        }}
        elevation={12}
      >
        {props.children}
      </Paper>
    </Box>
  );
}
