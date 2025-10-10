import json


def parse_block(fh, ncols):
    next(fh)
    next(fh)
    next(fh)
    labels = []

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

    return [labels[datasets[i].index(max(datasets[i]))] for i in range(ncols)]


def parse(fh):
    in_region = False

    all_indexs = []
    all_aos = []

    for line in fh:
        if "LOEWDIN REDUCED ORBITAL POPULATIONS PER MO" in line:
            in_region = True
            # skip 2
            next(fh)
            next(fh)

            continue

        if in_region:
            if line.strip() == "":
                break
            indices = [int(val) for val in line.strip().split()]
            result = parse_block(fh, len(indices))

            all_indexs.extend(indices)
            all_aos.extend(result)

    max_number = -1

    for i in range(len(all_aos)):
        n = int(all_aos[i][0])
        if n > max_number:
            max_number = n

    atom_info = [{} for x in range(max_number + 1)]

    for i in range(len(all_aos)):
        n = int(all_aos[i][0])
        v = atom_info[n]

        orb = all_aos[i][2]

        if "el" not in v:
            v["el"] = all_aos[i][1]

        if "idx" not in v:
            v["idx"] = n

        if orb == "s":
            if "orb_1s" not in v:
                v["orb_1s"] = all_indexs[i]
            elif "orb_2s" not in v:
                v["orb_2s"] = all_indexs[i]
        elif orb == "px":
            if "orb_2px" not in v:
                v["orb_2px"] = all_indexs[i]
        elif orb == "py":
            if "orb_2py" not in v:
                v["orb_2py"] = all_indexs[i]
        elif orb == "pz":
            if "orb_2pz" not in v:
                v["orb_2pz"] = all_indexs[i]

    with open("orbitals.json", "w") as jf:
        json.dump(atom_info, jf)


if __name__ == "__main__":
    try:
        with open("orca_result.full_log", "r") as fh:
            parse(fh)

    except Exception as e:
        print("Population file generation failed")
        print(e)
        exit(1)
