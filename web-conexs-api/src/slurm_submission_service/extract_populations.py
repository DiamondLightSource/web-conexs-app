import json

EXCLUDED_ATOMS = {"H", "He", "Li", "Be", "B", "C", "N", "O", "F", "Ne"}


def parse_block(fh, indices, atoms_info_list):
    en_line = next(fh)
    enes = [float(val) for val in en_line.strip().split()]
    next(fh)
    next(fh)
    ncols = len(indices)

    for line in fh:
        if line.strip() == "":
            break

        vals = line.strip().split()

        if vals[1] in EXCLUDED_ATOMS:
            continue

        index = int(vals[0])

        if atoms_info_list[index] is None:
            atom = {"element": vals[1]}
            atom["index"] = index
            electron_info = {"index": [], "percent": [], "energy": [], "orbital": []}
            atom["electrons"] = electron_info
            atoms_info_list[index] = atom

        info = atoms_info_list[index]
        el = info["electrons"]

        if vals[2] in {"s", "px", "py", "pz"}:
            for i in range(ncols):
                fval = float((vals[3 + i]))
                if fval > 0.5 and sum(el["percent"]) < 500:
                    el["index"].append(indices[i])
                    el["percent"].append(fval)
                    el["orbital"].append(vals[2])
                    el["energy"].append(enes[i])


def parse(fh):
    in_region = False

    atoms_info_list = None

    n_atoms = None

    for line in fh:
        if n_atoms is None and line.startswith("Number of atoms"):
            n_atoms = int(line.strip().split()[-1])
            atoms_info_list = [None] * n_atoms

        if "LOEWDIN REDUCED ORBITAL POPULATIONS PER MO" in line:
            if n_atoms is None:
                print("Could not determine number of atoms!")
                exit(1)
            in_region = True
            # skip 2
            next(fh)
            next(fh)

            continue

        if in_region:
            if "SPIN" in line:
                continue

            if line.strip() == "":
                break
            indices = [int(val) for val in line.strip().split()]
            parse_block(fh, indices, atoms_info_list)

    atoms_info_list = list(filter(None, atoms_info_list))

    # Sort all lists by electron index
    for atom in atoms_info_list:
        el = atom["electrons"]
        if len(el["index"]) == 0:
            continue
        t = sorted(zip(el["index"], el["percent"], el["energy"], el["orbital"]))
        a, b, c, d = zip(*t)
        el["index"] = list(a)
        el["percent"] = list(b)
        el["energy"] = list(c)
        el["orbital"] = list(d)

    with open("orbitals.json", "w") as jf:
        json.dump(atoms_info_list, jf)


if __name__ == "__main__":
    try:
        with open("orca_result.full_log", "r") as fh:
            parse(fh)

    except Exception as e:
        print("Population file generation failed")
        print(e)
        exit(1)
