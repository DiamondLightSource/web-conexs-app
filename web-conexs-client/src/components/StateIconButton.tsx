import {
  Alert,
  Box,
  Button,
  ButtonProps,
  CircularProgress,
  Snackbar,
} from "@mui/material";

import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { TIMEOUT_TIME } from "../utils";

export interface StateIconButtonProps extends ButtonProps {
  state: "ok" | "running" | "error" | "default";
  resetState: () => void;
  message: string | null;
}

export default function StateIconButton(props: StateIconButtonProps) {
  const { state, resetState, ...buttonProps } = props;

  const errorMessage = "Error During Submission!";
  const successMessage = "Submission Successful!";

  if (state == "running") {
    buttonProps.endIcon = <CircularProgress size="1em" />;
  } else if (props.state == "error") {
    buttonProps.endIcon = <ErrorIcon />;
    setTimeout(() => {
      resetState();
    }, TIMEOUT_TIME);
  } else if (state == "ok") {
    buttonProps.endIcon = <CheckCircleIcon />;
    setTimeout(() => {
      resetState();
    }, TIMEOUT_TIME);
  }

  return (
    <Box>
      <Snackbar
        open={state == "error" || state == "ok"}
        //use short exit duration to avoid changes in alert state
        transitionDuration={{ enter: 100, exit: 10 }}
      >
        <Alert
          severity={state == "error" ? "error" : "success"}
          variant="filled"
          sx={{ width: "100%" }}
        >
          {props.message != null
            ? props.message
            : state == "error"
              ? errorMessage
              : successMessage}
        </Alert>
      </Snackbar>
      <Button {...buttonProps}></Button>
    </Box>
  );
}
