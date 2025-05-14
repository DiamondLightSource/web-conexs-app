import re

from .models.models import (
    CrystalStructure,
    FdmnesSimulation,
    MolecularStructure,
    OrcaCalculation,
    OrcaSimulation,
    StructureType,
)
from .periodictable import periodic_table


def build_fdmnes_inputfile(
    fdmnes_simulation: FdmnesSimulation, structure: CrystalStructure
) -> str:
    jobfile = "Filout\nresult\n\nRange\n"
    jobfile += "-10. 0.25 50 !E_min, step, E_intermediate, step ...\n\n"

    jobfile += "Edge\n"
    jobfile += str(fdmnes_simulation.edge.value).capitalize() + "\n\n"

    jobfile += "Z_absorber\n"
    jobfile += str(fdmnes_simulation.element) + "\n\n"

    jobfile += "SCF         !Performs self-consistent calculation\n"
    jobfile += (
        "Energpho    !Output energy relative to the photon energy of absorbing atom\n\n"
    )

    if fdmnes_simulation.greens_approach:
        jobfile += "Green\n"

    jobfile += "Quadrupole\n"

    if fdmnes_simulation.edge.value.startswith("l"):
        jobfile += "Spinorbit\n"

    jobfile += "\n"
    jobfile += "Radius"
    jobfile += " ! Radius of the cluster where final state calculation is performed\n"
    jobfile += "6" + "\n\n"

    if fdmnes_simulation.structure_type == StructureType.crystal:
        jobfile += "Crystal        ! Periodic material description (unit cell)\n"
    else:
        jobfile += "Molecule       ! Periodic or cylindrical or spherical coordinates\n"

    jobfile += f"{structure.a} {structure.b} {structure.c}"
    jobfile += f"{structure.alpha} {structure.beta} {structure.gamma}\n"

    keys = (re.escape(k) for k in periodic_table.keys())
    pattern = re.compile(r"\b(" + "|".join(keys) + r")\b")

    result = pattern.sub(lambda x: str(periodic_table[x.group()]), structure.structure)
    jobfile += result

    jobfile += "\n\nConvolution\n\nEnd"

    return jobfile


def build_orca_input_file(
    orca_simulation: OrcaSimulation, structure: MolecularStructure
):
    calc_type = orca_simulation.calculation_type

    if calc_type == OrcaCalculation.xas.value:
        prefix = "! "
    else:
        prefix = "! UKS "

    jobfile = (
        prefix
        + orca_simulation.functional
        + " DKH2 "
        + orca_simulation.basis_set
        + " SARC/J"
    )

    if orca_simulation.solvent is not None:
        jobfile += "CPCM(" + orca_simulation.solvent + ") "

    jobfile += "\n"

    jobfile += "%maxcore " + str(orca_simulation.memory_per_core) + "\n\n"
    jobfile += "%pal nprocs " + str(orca_simulation.simulation.n_cores) + "\n"
    jobfile += "end" + "\n\n"

    if calc_type == OrcaCalculation.xas.value:
        jobfile += "%tddft" + "\n"

        jobfile += (
            "orbWin[0] = "
            + str(orca_simulation.orb_win_0_start)
            + ","
            + str(orca_simulation.orb_win_0_stop)
            + ",-1,-1\n"
        )
        jobfile += (
            "orbWin[1] = "
            + str(orca_simulation.orb_win_1_start)
            + ","
            + str(orca_simulation.orb_win_1_stop)
            + ",-1,-1\n"
        )

        jobfile += "doquad true" + "\n"
        jobfile += "nroots 20" + "\n"
        jobfile += "maxdim 10" + "\n"
        jobfile += "end" + "\n\n"
    else:
        jobfile += "%xes" + "\n"
        jobfile += "CoreOrb 0,1" + "\n"
        jobfile += "OrbOp 0,1" + "\n"
        jobfile += "DoSOC true" + "\n"
        jobfile += "Normalize true" + "\n"
        jobfile += "MDOriginAdjustMethod 1" + "\n"
        jobfile += "end" + "\n\n"

    jobfile += (
        "*xyz "
        + str(orca_simulation.charge)
        + " "
        + str(orca_simulation.multiplicity)
        + "\n"
    )

    jobfile += structure.structure
    jobfile += "\nend"

    return jobfile
