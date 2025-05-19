import { Tab, Tabs, Box } from "@mui/material";

import { useState } from "react";
import FdmnesChart from "./FdmnesChart";
import FdmnesLogViewer from "./FdmnesLogViewer";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index } = props;

  if (value != index) {
    return null;
  }

  return (
    <Box
      sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}
    >
      {value == index && children}
    </Box>
  );
}

function a11yProps(index: number) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}

export default function FdmnesResultsTabs(props: {
  fdmnesSimulationId: number;
}) {
  const [value, setValue] = useState(0);

  const handleChange = (event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  return (
    <Box
      sx={{ flex: 1, display: "flex", flexDirection: "column", minHeight: 0 }}
    >
      <Box sx={{ borderBottom: 1, borderColor: "divider", display: "flex" }}>
        <Tabs
          value={value}
          onChange={handleChange}
          aria-label="basic tabs example"
        >
          <Tab label="XAS Plot" {...a11yProps(0)} />
          <Tab label="Results Log" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <FdmnesChart id={props.fdmnesSimulationId}></FdmnesChart>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <FdmnesLogViewer id={props.fdmnesSimulationId} />
      </CustomTabPanel>
    </Box>
  );
}
