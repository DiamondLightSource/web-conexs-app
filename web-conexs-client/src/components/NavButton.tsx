import { Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

interface NavButtonProps {
  label: string;
  path: string;
  icon: JSX.Element;
  reload: boolean;
}

export default function NavButton(props: NavButtonProps) {
  const navigate = useNavigate();
  return (
    <Button
      sx={{
        height: { xs: "100px", sm: "120px", md: "150px", lg: "175px" },
        width: { xs: "100px", sm: "120px", md: "150px", lg: "175px" },
      }}
      component="label"
      role={undefined}
      variant="contained"
      tabIndex={-1}
      startIcon={props.icon}
      onClick={() => {
        if (props.reload) {
          window.location.href = props.path;
        } else {
          navigate(props.path);
        }
      }}
    >
      {props.label}
    </Button>
  );
}
