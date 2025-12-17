import { useEffect, useRef } from "react";
import { DefaultPluginSpec, PluginSpec } from "molstar/lib/mol-plugin/spec";
import { PluginContext } from "molstar/lib/mol-plugin/context";
import { PluginConfig } from "molstar/lib/mol-plugin/config";
import { StructureRepresentation3D } from "molstar/lib/mol-plugin-state/transforms/representation";
import { Box } from "@mui/material";

const Default3DSpec: PluginSpec = {
  ...DefaultPluginSpec(),
  config: [[PluginConfig.VolumeStreaming.Enabled, false]],
};

export function MolStarMoleculeWrapper(props: {
  xyz: string | null | undefined;
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

      const trajectory =
        await molstar.current.builders.structure.parseTrajectory(data, "xyz");

      const model = await molstar.current.builders.structure.createModel(
        trajectory
      );

      const s = await molstar.current.builders.structure.createStructure(model);

      molstar.current
        .build()
        .to(s)
        .apply(StructureRepresentation3D, {
          type: {
            name: "ball-and-stick",
            params: {
              size: "physical",
              celShaded: false,
              ignoreLight: false,
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

      await molstar.current.builders.structure.hierarchy.applyPreset(
        trajectory,
        "default"
      );
    };

    if (props.xyz) {
      init(props.xyz);
    }

    return () => {
      molstar.current?.dispose();
      molstar.current = null;
    };
  }, [viewerDiv, props.xyz]);

  return (
    <Box
      style={{
        height: "100%",
        width: "100%",
        position: "relative",
        minHeight: "250px",
        minWidth: "250px",
        flex: 1,
      }}
      ref={viewerDiv}
    ></Box>
  );
}
