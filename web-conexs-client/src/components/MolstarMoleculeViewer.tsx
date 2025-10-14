import { useEffect, useState, useRef } from "react";
import { Box } from "@mui/material";
import { DefaultPluginSpec, PluginSpec } from "molstar/lib/mol-plugin/spec";
import { PluginContext } from "molstar/lib/mol-plugin/context";
import { PluginConfig } from "molstar/lib/mol-plugin/config";

const Default3DSpec: PluginSpec = {
  ...DefaultPluginSpec(),
  config: [[PluginConfig.VolumeStreaming.Enabled, false]],
};

let molstar: PluginContext | null = null;

export function MolStarMoleculeWrapper(props: { xyz: string }) {
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

      const data = await molstar.builders.data.rawData(
        { data: rawData! },
        { state: { isGhost: true } }
      );

      const trajectory = await molstar.builders.structure.parseTrajectory(
        data,
        "xyz"
      );

      await molstar.builders.structure.hierarchy.applyPreset(
        trajectory,
        "default"
      );
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
