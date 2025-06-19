import { expect, test } from "vitest";

import { CrystalInput } from "./models";
import { crystalInputToCIF, validateMoleculeData } from "./utils";
import { periodic_table } from "./periodictable";

test("adds 1 + 2 to equal 3", () => {
  const input: CrystalInput = {
    alpha: 90,
    beta: 90,
    gamma: 90,
    a: 1,
    b: 1,
    c: 1,
    label: "test",
    structure: "Zn 0.0 0.0 0.0",
  };

  expect(crystalInputToCIF(input)).toContain("loop_");
});

test("validate molecule", () => {
  const input = "C 0.0 0.0 0.0\nH 1.0 1.0 1.0";

  expect(validateMoleculeData(input)).toHaveLength(0);

  const input2 = "C 0.0 0.0 0.0\nH 1.0 1.0 1.0 1.0";

  expect(validateMoleculeData(input2)).toBe(
    "Wrong number of items on line 2\n"
  );

  const input3 = "C 0.0 0.0 0.0\nXZ 1.0 1.0 1.0";

  expect(validateMoleculeData(input3)).toBe("Invalid chemical on line 2\n");
});
