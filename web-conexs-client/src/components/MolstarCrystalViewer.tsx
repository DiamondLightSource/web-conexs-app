import { useEffect, createRef, useState } from "react";
import { createPluginUI } from "molstar/lib/mol-plugin-ui";
import { renderReact18 } from "molstar/lib/mol-plugin-ui/react18";
import { PluginUIContext } from "molstar/lib/mol-plugin-ui/context";
/*  Might require extra configuration,
see https://webpack.js.org/loaders/sass-loader/ for example.
create-react-app should support this natively. */
import "molstar/lib/mol-plugin-ui/skin/light.scss";
import { CrystalInput, MoleculeInput } from "../models";

declare global {
  interface Window {
    molstar?: PluginUIContext;
  }
}

export function MolStarCrystalWrapper(props: { cif: string }) {
  const parent = createRef<HTMLDivElement>();

  // In debug mode of react's strict mode, this code will
  // be called twice in a row, which might result in unexpected behavior.
  useEffect(() => {
    async function init() {
      window.molstar = await createPluginUI({
        target: parent.current as HTMLDivElement,
        render: renderReact18,
      });

      const data = await window.molstar.builders.data.rawData({
        data: props.cif /* string or number[] */,
        label: void 0 /* optional label */,
      });

      const trajectory =
        await window.molstar.builders.structure.parseTrajectory(
          data,
          "cifCore"
        );

      await window.molstar.builders.structure.hierarchy.applyPreset(
        trajectory,
        "default"
      );

      //   const data = await window.molstar.builders.data.download(
      //     {
      //       url: "https://files.rcsb.org/download/3PTB.pdb",
      //     } /* replace with your URL */,
      //     { state: { isGhost: true } }
      //   );
      //   const trajectory =
      //     await window.molstar.builders.structure.parseTrajectory(data, "pdb");
      //   await window.molstar.builders.structure.hierarchy.applyPreset(
      //     trajectory,
      //     "default"
      //   );
    }
    init();
    return () => {
      window.molstar?.dispose();
      window.molstar = undefined;
    };
  }, []);

  return <div ref={parent} style={{ width: 320, height: 240 }} />;
}
