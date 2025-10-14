import { useEffect, useState, useRef } from "react";
import { Box } from "@mui/material";
import { DefaultPluginSpec, PluginSpec } from "molstar/lib/mol-plugin/spec";
import { PluginContext } from "molstar/lib/mol-plugin/context";
import { PluginConfig } from "molstar/lib/mol-plugin/config";
import { StateObjectSelector, StateTransformer } from "molstar/lib/mol-state";
import { PluginStateObject } from "molstar/lib/mol-plugin-state/objects";
import { StateTransforms } from "molstar/lib/mol-plugin-state/transforms";
import { createVolumeRepresentationParams } from "molstar/lib/mol-plugin-state/helpers/volume-representation-params";
import {
  BasisAndOrbitals,
  CreateOrbitalDensityVolume,
  CreateOrbitalRepresentation3D,
  CreateOrbitalVolume,
  StaticBasisAndOrbitals,
} from "molstar/lib/extensions/alpha-orbitals/transforms";

import { ColorNames } from "molstar/lib/mol-util/color/names";
import { Color } from "molstar/lib/mol-util/color";

const Default3DSpec: PluginSpec = {
  ...DefaultPluginSpec(),
  config: [[PluginConfig.VolumeStreaming.Enabled, false]],
};

let molstar: PluginContext | null = null;

function volumeParams(
  kind: "positive" | "negative",
  color: Color,
  value: number
): StateTransformer.Params<typeof CreateOrbitalRepresentation3D> {
  return {
    alpha: 0.85,
    color,
    kind,
    relativeIsovalue: value,
    pickable: false,
    xrayShaded: true,
    tryUseGpu: true,
  };
}

export function MolStarOrbitalWrapper(props: { cube: string }) {
  const [isRendered, setIsRendered] = useState<boolean | undefined>(false);
  const [volumeData, setVolumeData] = useState<Volume>();
  const [repr, setRepr] = useState<StateObjectSelector>();
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

      const parsed = await molstar.dataFormats
        .get("cube")!
        .parse(molstar, data);

      const volume: StateObjectSelector<PluginStateObject.Volume.Data> =
        parsed.volumes?.[0] ?? parsed.volume;

      // const positive = parsed.volume.apply(
      //   CreateOrbitalRepresentation3D,
      //   volumeParams("positive", ColorNames.blue, 0.005)
      // ).selector;
      // const negative = parsed.volume.apply(
      //   CreateOrbitalRepresentation3D,
      //   volumeParams("negative", ColorNames.red, 0.005)
      // ).selector

      const newRepr = molstar
        .build()
        .to(volume)
        .apply(
          StateTransforms.Representation.VolumeRepresentation3D,
          createVolumeRepresentationParams(molstar, volume.data!, {
            type: "isosurface",
            color: "uniform",

            typeParams: {
              alpha: 0.85,
              isoValue: {
                kind: "absolute",
                absoluteValue: 0.05,
              },
              // xrayShaded: true,
              tryUseGpu: true,
              sizeFactor: 0.1,
              visuals: ["wireframe"],
            },
            colorParams: { value: ColorNames.blue },
            size: "uniform",
          })
        );

      const newRepr2 = molstar
        .build()
        .to(volume)
        .apply(
          StateTransforms.Representation.VolumeRepresentation3D,
          createVolumeRepresentationParams(molstar, volume.data!, {
            type: "isosurface",
            color: "uniform",
            typeParams: {
              alpha: 0.85,
              isoValue: {
                kind: "relative",
                relativeValue: -1,
              },
              // xrayShaded: true,
              tryUseGpu: true,
              sizeFactor: 0.1,
              visuals: ["wireframe"],
            },

            colorParams: { value: ColorNames.red },
          })
        );

      await molstar.builders.structure.hierarchy.applyPreset(
        parsed.structure,
        "default"
      );

      // const newRepr = molstar
      //   .build()
      //   .to(volume)
      //   .apply(
      //     CreateOrbitalRepresentation3D,
      //     volumeParams("positive", ColorNames.blue, 1)
      //   );

      await newRepr.commit();
      await newRepr2.commit();
      // await negative.commit();
      // await positive.commit();

      // await molstar.builders.structure.hierarchy.applyPreset(
      //   parsed.structure,
      //   "default"
      // );

      setRepr(newRepr.selector);
      setVolumeData(volume.data);
      // const trajectory = await molstar.builders.structure.parseTrajectory(
      //   data,
      //   "xyz"
      // );

      // await molstar.builders.structure.hierarchy.applyPreset(
      //   trajectory,
      //   "default"
      // );
    };

    setIsRendered(undefined);

    if (props.cube) {
      init(props.cube);
    }

    return () => {
      molstar?.dispose();
      molstar = null;
    };
  }, [viewerDiv, props.cube]);

  return (
    <Box position="relative" display="flex" flexGrow={5} h="100%" w="100%">
      <Box
        style={{ width: 500, height: 440, position: "relative" }}
        ref={viewerDiv}
      ></Box>
    </Box>
  );
}

// declare global {
//   interface Window {
//     molstar?: PluginUIContext;
//   }
// }

// export function MolStarMoleculeWrapper(props: { xyz: string }) {
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
//         data: props.xyz /* string or number[] */,
//         label: void 0 /* optional label */,
//       });

//       const trajectory =
//         await window.molstar.builders.structure.createModel()

//       await window.molstar.builders.structure.hierarchy.applyPreset(
//         trajectory,
//         "unitcell"
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

//   return (
//     <div
//       ref={parent}
//       style={{ width: 640, height: 480, position: "relative" }}
//     />
//   );
//   // return (
//   //   <Box position="relative" display="flex" flexGrow={5} h="100%">
//   //     <Box ref={parent}></Box>
//   //   </Box>
//   // );
// }
