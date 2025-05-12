import { expect, test } from "vitest";

import { CrystalInput } from "./models";
import { crystalInputToCIF } from "./utils";

test("adds 1 + 2 to equal 3", () => {
  const input: CrystalInput = {
    alpha: 90,
    beta: 90,
    gamma: 90,
    a: 1,
    b: 1,
    c: 1,
    ibrav: "0",
    label: "test",
    structure: "Zn 0.0 0.0 0.0",
  };

  expect(crystalInputToCIF(input)).toContain("loop_");
});
