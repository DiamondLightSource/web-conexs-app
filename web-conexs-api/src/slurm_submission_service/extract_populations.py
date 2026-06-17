import json


def parse_block(fh, indices):
    next(fh)
    next(fh)
    next(fh)
    labels = []
    ncols = len(indices)
    datasets = []

    for i in range(ncols):
        datasets.append([])

    for line in fh:
        if line.strip() == "":
            break

        vals = line.strip().split()
        labels.append(vals[:3])

        for i in range(ncols):
            datasets[i].append(float(vals[3 + i]))

    output = []

    for i in range(ncols):
        if max(datasets[i]) > 75:
            output.append(labels[datasets[i].index(max(datasets[i]))] + [indices[i]])

    return output


def parse(fh):
    in_region = False

    all_aos = []

    for line in fh:
        if "LOEWDIN REDUCED ORBITAL POPULATIONS PER MO" in line:
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
            result = parse_block(fh, indices)

            if len(result) != 0:
                all_aos.extend(result)

    atom_info_map = {}

    for i in range(len(all_aos)):
        n = int(all_aos[i][0])
        v = atom_info_map.get(n, {})

        orb = all_aos[i][2]

        if "el" not in v:
            v["el"] = all_aos[i][1]

        if "idx" not in v:
            v["idx"] = n

        if orb == "s":
            if "orb_1s" not in v:
                v["orb_1s"] = all_aos[i][3]
            elif "orb_2s" not in v:
                v["orb_2s"] = all_aos[i][3]
        elif orb == "px":
            if "orb_2px" not in v:
                v["orb_2px"] = all_aos[i][3]
        elif orb == "py":
            if "orb_2py" not in v:
                v["orb_2py"] = all_aos[i][3]
        elif orb == "pz":
            if "orb_2pz" not in v:
                v["orb_2pz"] = all_aos[i][3]
        atom_info_map[n] = v

    atom_info_out = list(atom_info_map.values())
    atom_info_out.sort(key=lambda v: v["idx"])
    with open("orbitals.json", "w") as jf:
        json.dump(atom_info_out, jf)


if __name__ == "__main__":
    try:
        with open("orca_result.full_log", "r") as fh:
            parse(fh)

    except Exception as e:
        print("Population file generation failed")
        print(e)
        exit(1)
