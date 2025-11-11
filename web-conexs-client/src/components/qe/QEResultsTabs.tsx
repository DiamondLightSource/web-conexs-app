import { Tab, Tabs, Box } from "@mui/material";

import { useState } from "react";
import QEChart from "./QEChart";
import QELogViewer from "./QELogViewer";
import QEJobFileViewer from "./QEJobFileViewer";

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

export default function QEResultsTabs(props: { qeSimulationId: number }) {
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
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
          variant="fullWidth"
        >
          <Tab label="XAS Plot" {...a11yProps(0)} />
          <Tab label="Results Log" {...a11yProps(1)} />
          <Tab label="Input Job File" {...a11yProps(1)} />
        </Tabs>
      </Box>
      <CustomTabPanel value={value} index={0}>
        <QEChart id={props.qeSimulationId}></QEChart>
      </CustomTabPanel>
      <CustomTabPanel value={value} index={1}>
        <QELogViewer id={props.qeSimulationId} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <QEJobFileViewer id={props.qeSimulationId} />
      </CustomTabPanel>
    </Box>
  );
}
