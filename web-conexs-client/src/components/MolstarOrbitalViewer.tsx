import { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { DefaultPluginSpec, PluginSpec } from "molstar/lib/mol-plugin/spec";
import { PluginContext } from "molstar/lib/mol-plugin/context";
import { PluginConfig } from "molstar/lib/mol-plugin/config";
import { StateObjectSelector } from "molstar/lib/mol-state";
import { PluginStateObject } from "molstar/lib/mol-plugin-state/objects";
import { StateTransforms } from "molstar/lib/mol-plugin-state/transforms";
import { createVolumeRepresentationParams } from "molstar/lib/mol-plugin-state/helpers/volume-representation-params";

import { ColorNames } from "molstar/lib/mol-util/color/names";
import { StructureRepresentation3D } from "molstar/lib/mol-plugin-state/transforms/representation";

const Default3DSpec: PluginSpec = {
  ...DefaultPluginSpec(),
  config: [[PluginConfig.VolumeStreaming.Enabled, false]],
};

export function MolStarOrbitalWrapper(props: {
  cube: string | null | undefined;
  isoValue: number;
}) {
  const viewerDiv = useRef<HTMLDivElement>(null);
  const molstar = useRef<PluginContext | null>(null);

  useEffect(() => {
    const init = async (rawData: string) => {
      molstar.current = new PluginContext(Default3DSpec);

      await molstar.current.init();
      await molstar.current.mountAsync(viewerDiv.current!);

      if (rawData == null) {
        return;
      }

      const data = await molstar.current.builders.data.rawData(
        { data: rawData! },
        { state: { isGhost: true } }
      );

      const parsed = await molstar.current.dataFormats
        .get("cube")!
        .parse(molstar.current, data);

      const volume: StateObjectSelector<PluginStateObject.Volume.Data> =
        parsed.volumes?.[0] ?? parsed.volume;

      const positive = molstar.current
        .build()
        .to(volume)
        .apply(
          StateTransforms.Representation.VolumeRepresentation3D,
          createVolumeRepresentationParams(molstar.current, volume.data!, {
            type: "isosurface",
            color: "uniform",

            typeParams: {
              alpha: 0.85,
              isoValue: {
                kind: "relative",
                relativeValue: props.isoValue,
              },
              xrayShaded: true,
              tryUseGpu: false,
              sizeFactor: 1,
              visuals: ["solid"],
            },
            colorParams: { value: ColorNames.blue },
            size: "uniform",
          })
        );

      const negative = molstar.current
        .build()
        .to(volume)
        .apply(
          StateTransforms.Representation.VolumeRepresentation3D,
          createVolumeRepresentationParams(molstar.current, volume.data!, {
            type: "isosurface",
            color: "uniform",
            typeParams: {
              alpha: 0.85,
              isoValue: {
                kind: "relative",
                relativeValue: -1 * props.isoValue,
              },
              xrayShaded: true,
              tryUseGpu: false,
              sizeFactor: 0.1,
              visuals: ["solid"],
            },

            colorParams: { value: ColorNames.red },
          })
        );

      molstar.current
        .build()
        .to(parsed.structure)
        .apply(StructureRepresentation3D, {
          type: {
            name: "ball-and-stick",
            params: { size: "physical" },
          },
          colorTheme: {
            name: "element-symbol",
            params: {
              carbonColor: { name: "element-symbol", params: {} },
            },
          },
          sizeTheme: { name: "physical", params: {} },
        })
        .commit();

      await molstar.current.builders.structure.hierarchy.applyPreset(
        parsed.structure,
        "default"
      );

      await positive.commit();
      await negative.commit();
    };

    if (props.cube) {
      init(props.cube);
    }

    return () => {
      molstar.current?.dispose();
      molstar.current = null;
    };
  }, [viewerDiv, props.cube, props.isoValue]);

  return (
    <Box position="relative" display="flex" flexGrow={5} h="100%" w="100%">
      <Box
        style={{
          height: "100%",
          width: "100%",
          position: "relative",
          minHeight: "250px",
          minWidth: "250px",
        }}
        ref={viewerDiv}
      ></Box>
    </Box>
  );
}
