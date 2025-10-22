import { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { DefaultPluginSpec, PluginSpec } from "molstar/lib/mol-plugin/spec";
import { PluginContext } from "molstar/lib/mol-plugin/context";
import { PluginConfig } from "molstar/lib/mol-plugin/config";
import { StructureRepresentation3D } from "molstar/lib/mol-plugin-state/transforms/representation";

const Default3DSpec: PluginSpec = {
  ...DefaultPluginSpec(),
  config: [[PluginConfig.VolumeStreaming.Enabled, false]],
};

let molstar: PluginContext | null = null;

export function MolStarMoleculeWrapper(props: { xyz: string | null }) {
  const viewerDiv = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const init = async (rawData: string) => {
      molstar = new PluginContext(Default3DSpec);

      await molstar.init();
      await molstar.mountAsync(viewerDiv.current!);

      if (rawData == null) {
        return;
      }

      const data = await molstar.builders.data.rawData(
        { data: rawData! },
        { state: { isGhost: true } }
      );

      const trajectory = await molstar.builders.structure.parseTrajectory(
        data,
        "xyz"
      );

      const model = await molstar.builders.structure.createModel(trajectory);

      const s = await molstar.builders.structure.createStructure(model);

      molstar
        .build()
        .to(s)
        .apply(StructureRepresentation3D, {
          type: {
            name: "ball-and-stick",
            params: {
              size: "physical",
            },
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

      await molstar.builders.structure.hierarchy.applyPreset(
        trajectory,
        "default"
      );
    };

    if (props.xyz) {
      init(props.xyz);
    }

    return () => {
      molstar?.dispose();
      molstar = null;
    };
  }, [viewerDiv, props.xyz]);

  return (
    <div
      ref={viewerDiv}
      style={{
        height: "100%",
        width: "100%",
        position: "relative",
        minHeight: "100px",
        minWidth: "100px",
      }}
    />
    // <Box position="relative" display="flex" flexGrow={5} h="100%" w="100%">
    //   <Box
    //     style={{
    //       width: "300px",
    //       height: "300px",
    //       position: "relative",
    //       minHeight: "100px",
    //       minWidth: "100px",
    //     }}
    //     ref={viewerDiv}
    //   ></Box>
    // </Box>
  );
}
