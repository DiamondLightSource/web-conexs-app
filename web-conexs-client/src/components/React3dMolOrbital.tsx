import { useEffect, useRef } from "react";
import * as mol3d from "3dmol";

interface Orbital {
  cubeData: string | null;
  transferfn: TransferFunction;
}

export interface TransferFunction {
  positiveColor: string;
  negativeColor: string;
  positiveMin: number;
  positiveMax: number;
  negativeMin: number;
  negativeMax: number;
  isosurface: boolean;
}

export default function React3dMolOrbital(props: { orbital: Orbital }) {
  const moleculeViewer = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (moleculeViewer.current) {
      const existingViewers = moleculeViewer.current.children;
      if (existingViewers.length != 0) {
        for (let index = 0; index < existingViewers.length; index++) {
          existingViewers[index].remove();
        }
      }

      const viewer = mol3d.createViewer(moleculeViewer.current, {
        backgroundColor: "#3465A4",
        defaultcolors: mol3d.elementColors.Jmol,
      });

      if (props.orbital.cubeData != null) {
        viewer.addModel(props.orbital.cubeData, "cube");
        // viewer.setStyle({}, { stick: { color: "spectrum" } });
        const voldata = new mol3d.VolumeData(props.orbital.cubeData, "cube");

        const {
          positiveColor,
          negativeColor,
          positiveMin,
          positiveMax,
          negativeMin,
          negativeMax,
          isosurface,
        } = props.orbital.transferfn;

        if (isosurface) {
          viewer.addIsosurface(voldata, {
            isoval: positiveMin,
            color: positiveColor,
            alpha: 0.95,
            smoothness: 10,
          });
          viewer.addIsosurface(voldata, {
            isoval: -1 * negativeMin,
            color: negativeColor,
            alpha: 0.95,
            smoothness: 10,
          });
        } else {
          viewer.addVolumetricRender(voldata, {
            transferfn: [
              { color: positiveColor, opacity: 1, value: positiveMax },
              { color: positiveColor, opacity: 0.01, value: positiveMin },
              { color: "white", opacity: 0, value: 0 },
              { color: negativeColor, opacity: 0.01, value: negativeMin * -1 },
              { color: negativeColor, opacity: 1, value: negativeMax * -1 },
            ],
          });
        }
      }

      viewer.zoomTo();
      viewer.render();
    }

    return () => {
      console.log("No viewer");
    };
  });

  return (
    <div
      ref={moleculeViewer}
      style={{ height: "100%", width: "100%", position: "relative" }}
    />
  );
}
