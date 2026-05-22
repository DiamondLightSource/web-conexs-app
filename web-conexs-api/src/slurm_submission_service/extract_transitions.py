import json
import os.path

if __name__ == "__main__":
    try:
        fname = "orca_result.txt.0.ABSQ.stk"

        if not os.path.isfile(fname):
            fname = "orca_result.txt.XES.stk"

            if not os.path.isfile(fname):
                print("Could not find results file!")
                exit(1)

        with open(fname, "r") as fh:
            intensities = []

            for line in fh.readlines():
                test = line.strip()

                test = test.split()

                intensities.append((float(test[0]), float(test[1])))

            output = (sorted(enumerate(intensities), key=lambda x: x[1][1]))[::-1]

            data = []
            indices = []
            for i in range(5):
                indices.append(str(output[i][0] + 1))
                data.append(
                    {
                        "index": output[i][0] + 1,
                        "energy": output[i][1][0],
                        "intensity": output[i][1][1],
                    }
                )

            with open("cube.json", "w") as jf:
                json.dump(data, jf)

            plot_file = f"4\n64\n5\n7\n6\ny\n{' '.join(indices)}\n12\n"

            with open("plot_file.input", "w") as ofh:
                ofh.write(plot_file)
    except Exception as e:
        print("Failed to create cube generation input file!")
        print(e)
        exit(1)
