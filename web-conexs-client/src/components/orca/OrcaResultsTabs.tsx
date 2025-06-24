import { Tab, Tabs, Box } from "@mui/material";

import { useState } from "react";
import OrcaChart from "./OrcaChart";
import OrcaLogViewer from "./OrcaLogViewer";
import OrcaXYZViewer from "./OrcaXYZViewer";
import OrcaJobFileViewer from "./OrcaJobFileViewer";

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

export default function OrcaResultsTabs(props: {
  orcaSimulationId: number;
  isOpt: boolean;
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
          {props.isOpt ? (
            <Tab label="Results XYZ" {...a11yProps(0)} />
          ) : (
            <Tab label="XAS Plot" {...a11yProps(0)} />
          )}
          <Tab label="Results Log" {...a11yProps(1)} />
          <Tab label="Input Job File" {...a11yProps(2)} />
        </Tabs>
      </Box>

      {props.isOpt ? (
        <CustomTabPanel value={value} index={0}>
          <OrcaXYZViewer id={props.orcaSimulationId} />
        </CustomTabPanel>
      ) : (
        <CustomTabPanel value={value} index={0}>
          <OrcaChart id={props.orcaSimulationId}></OrcaChart>
        </CustomTabPanel>
      )}

      <CustomTabPanel value={value} index={1}>
        <OrcaLogViewer id={props.orcaSimulationId} />
      </CustomTabPanel>
      <CustomTabPanel value={value} index={2}>
        <OrcaJobFileViewer id={props.orcaSimulationId} />
      </CustomTabPanel>
    </Box>
  );
}
