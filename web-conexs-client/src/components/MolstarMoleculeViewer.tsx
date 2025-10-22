import { useEffect, useState, useRef } from "react";
import { Box } from "@mui/material";
import { DefaultPluginSpec, PluginSpec } from "molstar/lib/mol-plugin/spec";
import { PluginContext } from "molstar/lib/mol-plugin/context";
import { PluginConfig } from "molstar/lib/mol-plugin/config";
import { Script } from "molstar/lib/mol-script/script";
import {
  QueryContext,
  Structure,
  StructureSelection,
} from "molstar/lib/mol-model/structure";
import { atoms } from "molstar/lib/mol-model/structure/query/queries/generators";
import { StructureRepresentation3D } from "molstar/lib/mol-plugin-state/transforms/representation";

const Default3DSpec: PluginSpec = {
  ...DefaultPluginSpec(),
  config: [[PluginConfig.VolumeStreaming.Enabled, false]],
};

let molstar: PluginContext | null = null;

export function MolStarMoleculeWrapper(props: { xyz: string | null }) {
  const [isRendered, setIsRendered] = useState<boolean | undefined>(false);
  const viewerDiv = useRef<HTMLDivElement>(null);
  console.log("Mount");
  useEffect(() => {
    console.log("GO");
    const init = async (rawData: string) => {
      setIsRendered(true);
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

      const hierarchy = await molstar.builders.structure.hierarchy.applyPreset(
        trajectory,
        "default"
      );

      // console.log(sel);
      // const loci = StructureSelection.toLociWithSourceUnits(sel);

      // const stu_ref = await molstar.managers.structure.hierarchy.findStructure(
      //   struct
      // );

      // const color = Color(0x0000ff); // 0xFF0000 is RGB for red
      // // The helper takes care of updating the plugin state by iterating through
      // // each representation for each component based on the loci
      // // setStructureOverpaint(molstar, [stu_ref], color, async () => loci);
    };

    setIsRendered(undefined);

    if (props.xyz) {
      init(props.xyz);
    }

    return () => {
      molstar?.dispose();
      molstar = null;
    };
  }, [viewerDiv, props.xyz]);

  return (
    <Box position="relative" display="flex" flexGrow={5} h="100%" w="100%">
      <Box
        style={{ width: 640, height: 300, position: "relative" }}
        ref={viewerDiv}
      ></Box>
    </Box>
  );
}
