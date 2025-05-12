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

import Paper from "@mui/material/Paper";

import { useTheme } from "@mui/material";
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
  const curveOptions: CurveType[] = Object.values(
    CurveType
  ) as Array<CurveType>;

  const [useGrid, setUseGrid] = useState(true);
  const [curveOption, setCurveOption] = useState(curveOptions[0]);

  const theme = useTheme();

  console.log(props);

  let xdata: ndarray.NdArray<number[]> = ndarray(props.xas.energy, [
    props.xas.energy.length,
  ]);
  let ydata: ndarray.NdArray<number[]> = ndarray(props.xas.xas, [
    props.xas.energy.length,
  ]);

  let xdata2 = undefined;
  let ydata2 = undefined;
  if (props.xas.stk_energy && props.xas.stk_xas) {
    xdata2 = ndarray(props.xas.stk_energy, [props.xas.stk_energy.length]);
    ydata2 = ndarray(props.xas.stk_xas, [props.xas.stk_xas.length]);
  }

  //   let xdata = [0];
  //   let ydata = [0];

  //   const aux = [];

  let ydataLabel = "";

  //   const hideAll = !props.showTrans && !props.showFluor && !props.showRef;

  //   if (props.xasdata != null && !hideAll) {
  //     xdata = ndarray(props.xasdata.energy, [props.xasdata.energy.length]);

  //     let primaryFound = false;

  //     if (props.showTrans) {
  //       primaryFound = true;
  //       ydata = ndarray(props.xasdata.mutrans, [props.xasdata.mutrans.length]);
  //       ydataLabel = "Transmission";
  //     }

  //     if (props.showFluor) {
  //       const fdata = ndarray(props.xasdata.mufluor, [
  //         props.xasdata.mutrans.length,
  //       ]);
  //       if (!primaryFound) {
  //         primaryFound = true;
  //         ydata = fdata;
  //         ydataLabel = "Fluorescence";
  //       } else {
  //         aux.push({ label: "Fluorescence", array: fdata });
  //       }
  //     }

  //     if (props.showRef) {
  //       const rdata = ndarray(props.xasdata.murefer, [
  //         props.xasdata.murefer.length,
  //       ]);
  //       if (!primaryFound) {
  //         primaryFound = true;
  //         ydata = rdata;
  //         ydataLabel = "Reference";
  //       } else {
  //         aux.push({ label: "Reference", array: rdata });
  //       }
  //     }
  //   }

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
      // flexdirection="column"
      sx={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        backgroundColor: (theme) => theme.palette.background.default,
        fontFamily: (theme) => theme.typography.fontFamily,
      }}
    >
      <Box style={toolbarstyle}>
        <Toolbar>
          {/* <Separator /> */}
          {/* <ToggleBtn
            label="Transmission"
            value={props.showTrans}
            onToggle={() => {
              props.setShowTrans(!props.showTrans);
            }}
            disabled={!props.contains[0]}
          />
          <ToggleBtn
            label="Fluorescence"
            value={props.showFluor}
            onToggle={() => props.setShowFluor(!props.showFluor)}
            disabled={!props.contains[1]}
          />
          <ToggleBtn
            label="Reference"
            value={props.showRef}
            onToggle={() => props.setShowRef(!props.showRef)}
            disabled={!props.contains[2]}
          />
          <Separator />
          <Selector<CurveType>
            label="Line Style"
            onChange={(o) => {
              setCurveOption(o);
            }}
            options={curveOptions}
            value={curveOption}
            optionComponent={CurveOption}
          />
          <Separator />
          <GridToggler onToggle={() => setUseGrid(!useGrid)} value={useGrid} /> */}
        </Toolbar>
      </Box>
      <Box style={plotstyle} flex={1} display="flex">
        <VisCanvas
          abscissaConfig={{
            showGrid: true,
            visDomain: domainx,
          }}
          ordinateConfig={{
            showGrid: true,
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
        {/* <LineVis
          abscissaParams={{
            value: xdata.data,
            scaleType: ScaleType.Linear,
            label: "Energy",
          }}
          dataArray={ydata}
          ordinateLabel={ydataLabel}
          domain={domain}
          showGrid={useGrid}
          curveType={curveOption}
          scaleType={ScaleType.Linear}
        /> */}
      </Box>
    </Paper>
  );
}

export default XASChart;
