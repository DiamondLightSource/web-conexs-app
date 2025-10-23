import { Tab, Tabs, Box } from "@mui/material";

import { useState } from "react";
import OrcaChart from "./OrcaChart";
import OrcaLogViewer from "./OrcaLogViewer";
import OrcaXYZViewer from "./OrcaXYZViewer";
import OrcaJobFileViewer from "./OrcaJobFileViewer";
import OrcaOrbitalView from "./OrcaOrbitalView";
import OrcaCoreOrbitals from "./OrcaCoreOrbitals";

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

function getTabs(calcType: string, id: number, value: number) {
  const tabs = [];
  const panels = [];
  let index = 0;

  if (calcType == "opt") {
    tabs.push(<Tab key={index} label="Results XYZ" {...a11yProps(index)} />);
    panels.push(
      <CustomTabPanel key={index} value={value} index={index++}>
        <OrcaXYZViewer id={id} />
      </CustomTabPanel>
    );
  }

  if (calcType == "xas") {
    tabs.push(<Tab key={index} label="XAS Plot" {...a11yProps(index)} />);
    panels.push(
      <CustomTabPanel value={value} index={index++}>
        <OrcaChart id={id}></OrcaChart>
      </CustomTabPanel>
    );
    tabs.push(<Tab key={index} label="Orbital Viewer" {...a11yProps(index)} />);
    panels.push(
      <CustomTabPanel key={index} value={value} index={index++}>
        <OrcaOrbitalView id={id} />
      </CustomTabPanel>
    );
  }

  if (calcType == "xes") {
    tabs.push(<Tab key={index} label="XES Plot" {...a11yProps(index)} />);
    panels.push(
      <CustomTabPanel key={index} value={value} index={index++}>
        <OrcaChart id={id}></OrcaChart>
      </CustomTabPanel>
    );
  }

  if (calcType == "scf") {
    tabs.push(<Tab key={index} label="Core Orbitals" {...a11yProps(index)} />);
    panels.push(
      <CustomTabPanel key={index} value={value} index={index++}>
        <OrcaCoreOrbitals id={id} />
      </CustomTabPanel>
    );
  }

  tabs.push(<Tab key={index} label="Results Log" {...a11yProps(index)} />);
  panels.push(
    <CustomTabPanel key={index} value={value} index={index++}>
      <OrcaLogViewer id={id} />
    </CustomTabPanel>
  );

  tabs.push(<Tab key={index} label="Input Job File" {...a11yProps(index)} />);
  panels.push(
    <CustomTabPanel key={index} value={value} index={index++}>
      <OrcaJobFileViewer id={id} />
    </CustomTabPanel>
  );

  return [tabs, panels];
}

export default function OrcaResultsTabs(props: {
  orcaSimulationId: number;
  calcType: string;
}) {
  const [value, setValue] = useState(0);

  const handleChange = (_event: React.SyntheticEvent, newValue: number) => {
    setValue(newValue);
  };

  const [tabs, panels] = getTabs(props.calcType, props.orcaSimulationId, value);

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
          {tabs}
        </Tabs>
      </Box>
      {panels}
    </Box>
  );
}
