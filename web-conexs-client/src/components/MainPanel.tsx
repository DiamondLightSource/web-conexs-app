import {
  Box,
  Paper,
  Stack,
  Toolbar,
  Typography,
  useTheme,
} from "@mui/material";
import React from "react";

export default function MainPanel(props: {
  children: React.ReactNode;
  toolbarElements: React.ReactNode;
}) {
  const theme = useTheme();

  const sideGap = theme.spacing(10);

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
          margin: "10px 10px 10px 10px",
          ml: { sm: "10px", md: sideGap },
          flex: 1,
          minHeight: 0,
          alignItems: "stretch",
          display: "flex",
          flexDirection: "column",
        }}
        elevation={12}
      >
        <Stack flex={1} overflow="hidden">
          <Toolbar
            sx={{
              justifyContent: "space-between",
              alignItems: "center",
              backgroundColor: theme.palette.action.disabled,
              borderRadius: "4px 4px 0px 0px",
            }}
          >
            {props.toolbarElements}
          </Toolbar>
          {props.children}
        </Stack>
      </Paper>
    </Box>
  );
}
