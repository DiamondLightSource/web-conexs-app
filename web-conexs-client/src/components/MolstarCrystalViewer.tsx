import { useEffect, useRef } from "react";
import { Box } from "@mui/material";
import { DefaultPluginSpec, PluginSpec } from "molstar/lib/mol-plugin/spec";
import { PluginContext } from "molstar/lib/mol-plugin/context";
import { PluginConfig } from "molstar/lib/mol-plugin/config";
import { StructureRepresentation3D } from "molstar/lib/mol-plugin-state/transforms/representation";

import {
  QueryContext,
  StructureSelection,
} from "molstar/lib/mol-model/structure";
import { atoms } from "molstar/lib/mol-model/structure/query/queries/generators";

const Default3DSpec: PluginSpec = {
  ...DefaultPluginSpec(),
  config: [[PluginConfig.VolumeStreaming.Enabled, false]],
};

export function MolStarCrystalWrapper(props: {
  cif: string | null;
  labelledAtomIndex: number | undefined;
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
        { data: props.cif! },
        { state: { isGhost: true } }
      );

      const trajectory =
        await molstar.current.builders.structure.parseTrajectory(
          data,
          "cifCore"
        );

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

      await molstar.current.builders.structure.tryCreateUnitcell(model);

      const hierarchy =
        await molstar.current.builders.structure.hierarchy.applyPreset(
          trajectory,
          "default"
        );

      const struct = hierarchy!.structure.data!;

      if (props.labelledAtomIndex != null) {
        const query = atoms({
          atomTest: (ctx) => {
            return ctx.element.element == props.labelledAtomIndex;
          },
        });
        const selection = query(new QueryContext(struct));
        const loci = StructureSelection.toLociWithCurrentUnits(selection);
        molstar.current.managers.interactivity.lociSelects.select({ loci });
      }
    };

    if (props.cif) {
      init(props.cif);
    }

    return () => {
      molstar.current?.dispose();
      molstar.current = null;
    };
  }, [viewerDiv, props.cif, props.labelledAtomIndex]);

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
