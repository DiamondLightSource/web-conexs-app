import { Button, ButtonProps, CircularProgress } from "@mui/material";

import ErrorIcon from "@mui/icons-material/Error";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export interface StateIconButtonProps extends ButtonProps {
  state: "ok" | "running" | "error" | "default";
  resetState: () => void;
}

export default function StateIconButton(props: StateIconButtonProps) {
  const { state, resetState, ...buttonProps } = props;

  if (state == "running") {
    buttonProps.endIcon = <CircularProgress size="1em" />;
  } else if (props.state == "error") {
    buttonProps.endIcon = <ErrorIcon />;
    setTimeout(() => resetState(), 2000);
  } else if (state == "ok") {
    buttonProps.endIcon = <CheckCircleIcon />;
    setTimeout(() => props.resetState(), 2000);
  }
  return <Button {...buttonProps}></Button>;
}
