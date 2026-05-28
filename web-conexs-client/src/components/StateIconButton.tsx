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
import { TIMEOUT_TIME } from "../utils";

export interface StateIconButtonProps extends ButtonProps {
  state: "ok" | "running" | "error" | "default";
  resetState: () => void;
}

export default function StateIconButton(props: StateIconButtonProps) {
  const { state, resetState, ...buttonProps } = props;
  const [snackOpen, setSnackOpen] = useState(false);

  const handleSnackClose = (
    _event?: React.SyntheticEvent | Event,
    reason?: SnackbarCloseReason,
  ) => {
  
    if (reason === "clickaway") {
      return;
    }

    setSnackOpen(false);
  };

  const errorMessage = "Error during submission!";
  const successMessage = "Submission Sucessful!";

  if (state == "running") {
    buttonProps.endIcon = <CircularProgress size="1em" />;
  } else if (props.state == "error") {
    if (!snackOpen) {
      setSnackOpen(true);
    }
    buttonProps.endIcon = <ErrorIcon />;
    setTimeout(() => {
      resetState();
    }, TIMEOUT_TIME);
  } else if (state == "ok") {
    if (!snackOpen) {
      setSnackOpen(true);
    }
    buttonProps.endIcon = <CheckCircleIcon />;
    setTimeout(() => {
      resetState();
      handleSnackClose();
    }, TIMEOUT_TIME);
  }

  return (
    <Box>
      <Snackbar open={snackOpen} onClose={handleSnackClose}>
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
