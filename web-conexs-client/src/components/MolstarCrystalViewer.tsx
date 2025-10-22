// import { useEffect, createRef, useState } from "react";
// import { createPluginUI } from "molstar/lib/mol-plugin-ui";
// import { renderReact18 } from "molstar/lib/mol-plugin-ui/react18";
// import { PluginUIContext } from "molstar/lib/mol-plugin-ui/context";
// /*  Might require extra configuration,
// see https://webpack.js.org/loaders/sass-loader/ for example.
// create-react-app should support this natively. */
// import "molstar/lib/mol-plugin-ui/skin/light.scss";
// import { CrystalInput, MoleculeInput } from "../models";

// declare global {
//   interface Window {
//     molstar?: PluginUIContext;
//   }
// }

// export function MolStarCrystalWrapper(props: { cif: string }) {
//   const parent = createRef<HTMLDivElement>();

//   // In debug mode of react's strict mode, this code will
//   // be called twice in a row, which might result in unexpected behavior.
//   useEffect(() => {
//     async function init() {
//       window.molstar = await createPluginUI({
//         target: parent.current as HTMLDivElement,
//         render: renderReact18,
//       });

//       const data = await window.molstar.builders.data.rawData({
//         data: props.cif /* string or number[] */,
//         label: void 0 /* optional label */,
//       });

//       const trajectory =
//         await window.molstar.builders.structure.parseTrajectory(
//           data,
//           "cifCore"
//         );

//       // // const trajectory =
//       // const test = await window.molstar.builders.structure.createModel(
//       //   trajectory
//       // );

//       // const test2 = await window.molstar.builders.structure.tryCreateUnitcell(
//       //   test
//       // );

//       // console.log(test2);
//       // console.log("HERE");

//       await window.molstar.builders.structure.hierarchy.applyPreset(
//         trajectory,
//         "default"
//       );

//       //   const data = await window.molstar.builders.data.download(
//       //     {
//       //       url: "https://files.rcsb.org/download/3PTB.pdb",
//       //     } /* replace with your URL */,
//       //     { state: { isGhost: true } }
//       //   );
//       //   const trajectory =
//       //     await window.molstar.builders.structure.parseTrajectory(data, "pdb");
//       //   await window.molstar.builders.structure.hierarchy.applyPreset(
//       //     trajectory,
//       //     "default"
//       //   );
//     }
//     init();
//     return () => {
//       window.molstar?.dispose();
//       window.molstar = undefined;
//     };
//   }, []);

//   return <div ref={parent} style={{ width: 320, height: 240 }} />;
// }

import { useEffect, useState, useRef } from "react";
import { Box } from "@mui/material";
import { DefaultPluginSpec, PluginSpec } from "molstar/lib/mol-plugin/spec";
import { PluginContext } from "molstar/lib/mol-plugin/context";
import { PluginConfig } from "molstar/lib/mol-plugin/config";
import { StructureRepresentation3D } from "molstar/lib/mol-plugin-state/transforms/representation";
import {
  StructureSelectionQueries,
  StructureSelectionQuery,
} from "molstar/lib/mol-plugin-state/helpers/structure-selection-query";
import {
  QueryContext,
  StructureSelection,
} from "molstar/lib/mol-model/structure";
import { Color } from "molstar/lib/mol-util/color";
import { setStructureOverpaint } from "molstar/lib/mol-plugin-state/helpers/structure-overpaint";
import { Script } from "molstar/lib/mol-script/script";
import { atoms } from "molstar/lib/mol-model/structure/query/queries/generators";
import {
  StructureFromModel,
  TrajectoryFromCifCore,
} from "molstar/lib/mol-plugin-state/transforms/model";
import {
  Download,
  RawData,
} from "molstar/lib/mol-plugin-state/transforms/data";
import { CifBlock } from "molstar/lib/mol-io/reader/cif";

const Default3DSpec: PluginSpec = {
  ...DefaultPluginSpec(),
  config: [[PluginConfig.VolumeStreaming.Enabled, false]],
};

let molstar: PluginContext | null = null;

export function MolStarCrystalWrapper(props: {
  cif: string | null;
  labelledAtomIndex: number | null;
}) {
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
        { data: props.cif! },
        { state: { isGhost: true } }
      );

      const trajectory = await molstar.builders.structure.parseTrajectory(
        data,
        "cifCore"
      );

      const model = await molstar.builders.structure.createModel(trajectory);

      const s = await molstar.builders.structure.createStructure(model);

      console.log(model);

      console.log(s);
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

      await molstar.builders.structure.tryCreateUnitcell(model);

      const hierarchy = await molstar.builders.structure.hierarchy.applyPreset(
        trajectory,
        "default"
      );

      const struct = hierarchy!.structure.data!;

      // console.log(hierarchy?.representation);

      if (props.labelledAtomIndex != null) {
        const query = atoms({
          atomTest: (ctx) => {
            console.log(ctx.element.element == 0);
            // ctx.
            // const seqId = StructureProperties.residue.label_seq_id(ctx.element);
            return ctx.element.element == props.labelledAtomIndex;
          },
        });
        const selection = query(new QueryContext(struct));
        const loci = StructureSelection.toLociWithCurrentUnits(selection);
        molstar.managers.interactivity.lociSelects.select({ loci });
      }
    };

    setIsRendered(undefined);

    if (props.cif) {
      init(props.cif);
    }

    return () => {
      molstar?.dispose();
      molstar = null;
    };
  }, [viewerDiv, props.cif, props.labelledAtomIndex]);

  return (
    <Box position="relative" display="flex" flexGrow={5} h="100%" w="100%">
      <Box
        style={{ width: 640, height: 300, position: "relative" }}
        ref={viewerDiv}
      ></Box>
    </Box>
  );
}
