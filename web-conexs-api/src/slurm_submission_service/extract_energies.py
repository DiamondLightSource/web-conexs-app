if __name__ == "__main__":
    try:
        with open("orca_result.txt", "r") as fh:
            found = False
            xes = False
            energies = []

            for line in fh.readlines():
                if "COMBINED ELECTRIC DIPOLE" in line:
                    found = True
                if "EMISSION" in line:
                    xes = True

                if found:
                    test = line.strip()
                    if test == "":
                        delta = (energies[-1] - energies[0]) * 0.1
                        min_val = energies[0] - delta
                        max_val = energies[-1] + delta
                        print(f"Energy range {min_val} {max_val}")
                        with open("energy_range.out", "w") as ofh:
                            ofh.write(f"{min_val}\n{max_val}")

                        exit()

                    test = test.split()

                    if test[0].isdigit():
                        print(line)
                        index = 1 if not xes else 4
                        val = float(test[index])
                        if not xes:
                            val = val / 8065.544
                        energies.append(val)

    except Exception as e:
        print("Energy range file generation failed")
        print(e)
        exit(1)
