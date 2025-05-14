import { Tab, Tabs, Box } from "@mui/material";

import { useState } from "react";
import OrcaChart from "./OrcaChart";
import OrcaLogViewer from "./OrcaLogViewer";
import OrcaXYZViewer from "./OrcaXYZViewer";

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

function CustomTabPanel(props: TabPanelProps) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ p: 1 }}>{children}</Box>}
    </div>
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
    <Box sx={{ width: "100%" }}>
      <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
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
    </Box>
  );
}
