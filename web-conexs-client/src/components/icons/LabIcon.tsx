import { IconProps, SvgIcon } from "@mui/material";

export default function LabIcon({ sx = [] }: IconProps) {
  return (
    <SvgIcon sx={[...(Array.isArray(sx) ? sx : [sx])]}>
      <svg
        xmlns="http://www.w3.org/2000/svg"
        height="24px"
        viewBox="0 -960 960 960"
        width="24px"
      >
        <path d="M320-280v-80h87q-5 20-6.5 40t.5 40h-81Zm0 200q-83 0-141.5-58.5T120-280v-360q-33 0-56.5-23.5T40-720v-80q0-33 23.5-56.5T120-880h400q33 0 56.5 23.5T600-800v80q0 33-23.5 56.5T520-640v121q-24 15-44 35t-35 44H320v-80h120v-120H200v360q0 50 35 85t85 35q30 0 54.5-13t41.5-36q8 20 18 38t24 35q-27 26-62 41t-76 15ZM120-720h400v-80H120v80Zm540 520q42 0 71-29t29-71q0-42-29-71t-71-29q-42 0-71 29t-29 71q0 42 29 71t71 29ZM864-40 756-148q-22 14-46 21t-50 7q-75 0-127.5-52.5T480-300q0-75 52.5-127.5T660-480q75 0 127.5 52.5T840-300q0 26-7 50t-21 46L920-96l-56 56ZM120-720v-80 80Z" />
      </svg>
      ;
    </SvgIcon>
  );
}
