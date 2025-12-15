import {
  Alert,
  Box,
  Button,
  ButtonProps,
  CircularProgress,
  Snackbar,
  SnackbarCloseReason,
} from "@mui/material";

import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useState } from "react";

export interface StateIconButtonProps extends ButtonProps {
  state: "ok" | "running" | "error" | "default";
  resetState: () => void;
}

export default function StateIconButton(props: StateIconButtonProps) {
  const { state, resetState, ...buttonProps } = props;
  const [snackOpen, setSnackOpen] = useState(false);

  const handleSnackClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason
  ) => {
    if (reason === "clickaway") {
      return;
    }

    setSnackOpen(false);
  };

  if ((props.state == "ok" || props.state == "error") && snackOpen == false) {
    setSnackOpen(true);
  }

  const errorMessage = "Error during submission!";
  const successMessage = "Submission Sucessful!";

  if (state == "running") {
    buttonProps.endIcon = <CircularProgress size="1em" />;
  } else if (props.state == "error") {
    buttonProps.endIcon = <ErrorIcon />;
    setTimeout(() => resetState(), 2000);
  } else if (state == "ok") {
    buttonProps.endIcon = <CheckCircleIcon />;
    setTimeout(() => props.resetState(), 2000);
  }
  return (
    <Box>
      <Snackbar
        open={snackOpen}
        autoHideDuration={4000}
        onClose={handleSnackClose}
      >
        <Alert
          onClose={handleSnackClose}
          severity={state == "error" ? "error" : "success"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {state == "error" ? errorMessage : successMessage}
        </Alert>
      </Snackbar>
      <Button {...buttonProps}></Button>
    </Box>
  );
}
