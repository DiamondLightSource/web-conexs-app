import {
  LineVis,
  getDomain,
  Separator,
  Selector,
  Toolbar,
  ScaleType,
  CurveType,
  ToggleBtn,
  VisCanvas,
  DefaultInteractions,
  TooltipMesh,
  ResetZoomButton,
  DataCurve,
  getVisDomain,
} from "@h5web/lib";
import "@h5web/lib/dist/styles.css";

import GridOnIcon from "@mui/icons-material/GridOn";

import Paper from "@mui/material/Paper";

import { Theme, useTheme } from "@mui/material";
import { ReactElement, useState } from "react";

import ndarray from "ndarray";
import { Box } from "@mui/material";
import { XASData } from "../models";
// import { XASData } from "../models";

function CurveOption(props: { option: CurveType }) {
  const { option } = props;

  return (
    <div>
      <span>{String(option)}</span>
    </div>
  );
}

function XASChart(props: { xas: XASData }) {
  // const curveOptions: CurveType[] = Object.values(
  //   CurveType
  // ) as Array<CurveType>;

  const [useGrid, setUseGrid] = useState(true);
  // const [curveOption, setCurveOption] = useState(curveOptions[0]);

  const theme: Theme = useTheme();

  const xdata: ndarray.NdArray<number[]> = ndarray(props.xas.energy, [
    props.xas.energy.length,
  ]);
  const ydata: ndarray.NdArray<number[]> = ndarray(props.xas.xas, [
    props.xas.energy.length,
  ]);

  let xdata2 = undefined;
  let ydata2 = undefined;
  if (props.xas.stk_energy && props.xas.stk_xas) {
    xdata2 = ndarray(props.xas.stk_energy, [props.xas.stk_energy.length]);
    ydata2 = ndarray(props.xas.stk_xas, [props.xas.stk_xas.length]);
  }

  const toolbarstyle = {
    "--h5w-toolbar--bgColor": theme.palette.action.hover,
    "--h5w-tickLabels--color": theme.palette.text.primary,
    "--h5w-ticks--color": theme.palette.text.primary,
    "--h5w-grid--color": "black",
    "--h5w-toolbar-label--color": theme.palette.primary.dark,
    "--h5w-btn-hover--bgColor": theme.palette.action.hover,
    "--h5w-btnPressed--bgColor": theme.palette.action.selected,
    "--h5w-selector-menu--bgColor": theme.palette.background.default,
    "--h5w-selector-option-selected--bgColor": theme.palette.action.selected,
  } as React.CSSProperties;

  const plotstyle = {
    "--h5w-tickLabels--color": theme.palette.text.primary,
    "--h5w-ticks--color": theme.palette.text.primary,
    "--h5w-grid--color": theme.palette.text.secondary,
    "--h5w-axisLabels--color": theme.palette.text.primary,
    "--h5w-line--color": theme.palette.primary.dark,
    "--h5w-line--colorAux": [
      theme.palette.success.light,
      theme.palette.secondary.dark,
    ],
  } as React.CSSProperties;

  const tooltipText = (x: number, y: number): ReactElement<string> => {
    return (
      <p>
        {x.toPrecision(8)}, {y.toPrecision(8)}
      </p>
    );
  };
  const domain = getDomain(ydata);
  const domainx = getDomain(xdata);

  return (
    <Paper
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: (theme: Theme) => theme.palette.background.default,
        fontFamily: (theme: Theme) => theme.typography.fontFamily,
      }}
    >
      <Box style={toolbarstyle}>
        <Toolbar>
          <ToggleBtn
            label="Grid"
            value={useGrid}
            icon={GridOnIcon}
            onToggle={() => setUseGrid(!useGrid)}
          ></ToggleBtn>
        </Toolbar>
      </Box>
      <Box style={plotstyle} flex={1} display="flex">
        <VisCanvas
          abscissaConfig={{
            showGrid: useGrid,
            visDomain: domainx,
            label: "Energy / eV",
          }}
          ordinateConfig={{
            showGrid: useGrid,
            visDomain: domain,
          }}
        >
          <DefaultInteractions />
          <TooltipMesh renderTooltip={tooltipText} />
          <ResetZoomButton />

          <DataCurve
            abscissas={xdata.data}
            color="green"
            ordinates={ydata.data}
            visible={true}
          />

          {xdata2 != undefined && ydata2 != undefined && (
            <DataCurve
              abscissas={xdata2.data}
              color="blue"
              ordinates={ydata2.data}
              visible={true}
            />
          )}
        </VisCanvas>
      </Box>
    </Paper>
  );
}

export default XASChart;
