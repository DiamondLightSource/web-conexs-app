import math
import re

from .models.models import (
    ConductivityType,
    CrystalStructure,
    FdmnesSimulation,
    MolecularStructure,
    OrcaCalculation,
    OrcaSimulation,
    QESimulation,
    StructureType,
)
from .periodictable import elements, periodic_table


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

    if calc_type == OrcaCalculation.xes:
        prefix = "! UKS "
    else:
        prefix = "! "

    jobfile = (
        prefix
        + orca_simulation.functional
        + " DKH2 "
        + orca_simulation.basis_set
        + " SARC/J"
    )

    if calc_type == OrcaCalculation.opt:
        jobfile += " OPT "

    if orca_simulation.solvent is not None:
        jobfile += "CPCM(" + orca_simulation.solvent + ") "

    jobfile += "\n"

    jobfile += "%maxcore " + str(orca_simulation.memory_per_core) + "\n\n"
    jobfile += "%pal nprocs " + str(orca_simulation.simulation.n_cores) + "\n"
    jobfile += "end" + "\n\n"

    if calc_type == OrcaCalculation.xas:
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
    elif calc_type == OrcaCalculation.xes:
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


def build_qe_inputfile(qe_simulation: QESimulation, structure: CrystalStructure) -> str:
    atoms = structure.structure.splitlines()

    abs_atom = atoms[qe_simulation.absorbing_atom - 1]
    abs_el = abs_atom.split()[0]

    element_set = set()
    number_of_atoms = 0
    number_of_electrons = 0

    for atom in atoms:
        number_of_atoms += 1
        el = atom.split()[0]
        element_set.add(el)
        atomic_number = periodic_table[el]
        number_of_electrons += atomic_number

    n_type = len(element_set) + 1

    jobfile = "&CONTROL \n"
    jobfile += " calculation = 'scf'\n"
    jobfile += " etot_conv_thr = 1.0000000000d-05\n"
    jobfile += " outdir = './' \n"
    jobfile += " prefix = '' \n"
    jobfile += " pseudo_dir = './' \n"
    jobfile += " restart_mode = 'from_scratch' \n"
    jobfile += " title = '' \n"
    jobfile += " tprnfor = .FALSE.\n"
    jobfile += " verbosity = 'low'\n"
    jobfile += " forc_conv_thr = 1.0000000000d-04\n"
    jobfile += "/ \n\n"

    jobfile += "&SYSTEM \n"
    jobfile += " ibrav = " + structure.ibrav + "\n"
    jobfile += " A = " + str(structure.a) + "\n"
    jobfile += " B = " + str(structure.b) + "\n"
    jobfile += " C = " + str(structure.c) + "\n"
    jobfile += " cosBC = " + str(math.cos(math.radians(structure.alpha))) + "\n"
    jobfile += " cosAC = " + str(math.cos(math.radians(structure.beta))) + "\n"
    jobfile += " cosAB = " + str(math.cos(math.radians(structure.gamma))) + "\n"

    if qe_simulation.conductivity == ConductivityType.metallic:
        occupations = "smearing"
        smearing = "fermi-dirac"
        degauss = "5.0000000000d-03"
        jobfile += " occupations = '" + occupations + "'\n"
        jobfile += " smearing = '" + smearing + "'\n"
        jobfile += " degauss = " + degauss + "\n"

    if number_of_electrons % 2 == 1:
        jobfile += " nspin = 2 \n"
        jobfile += " tot_magnetization = 1.0000000000d+00 \n"

    ecutwfc = 50

    jobfile += " nat = " + str(number_of_atoms) + "\n"
    jobfile += " ntyp = " + str(n_type) + "\n"
    jobfile += " ecutwfc = " + str(ecutwfc) + "\n"
    jobfile += "/ \n\n"

    diagonalization = "david"
    electron_maxstep = 50
    mixing_beta = 0.2

    jobfile += "&ELECTRONS \n"
    jobfile += " diagonalization = '" + diagonalization + "'\n"
    jobfile += " electron_maxstep = " + str(electron_maxstep) + "\n"
    jobfile += " mixing_beta = " + str(mixing_beta) + "\n"
    jobfile += "/ \n\n"

    jobfile += "ATOMIC_SPECIES \n"
    jobfile += (
        abs_el
        + "* "
        + str(elements[abs_el]["mass"])
        + " "
        + elements[abs_el]["pseudopotential"]
        + "\n"
    )

    pp_abs = elements[abs_el]["pseudopotential"]

    pp = []
    for el in element_set:
        jobfile += (
            el
            + " "
            + str(elements[el]["mass"])
            + " "
            + elements[el]["pseudopotential"]
            + "\n"
        )
        pp.append(elements[el]["pseudopotential"])

    jobfile += "\n\n"

    jobfile += "ATOMIC_POSITIONS {crystal} \n"

    count = 0
    for atom in atoms:
        if count + 1 == qe_simulation.absorbing_atom:
            segments = atom.split(None, 1)
            jobfile += segments[0] + "* " + segments[1] + "\n"
        else:
            jobfile += atom + "\n"

        count += 1

    jobfile += "\n\n"
    jobfile += "K_POINTS automatic\n"
    jobfile += "1 1 1 0 0 0\n"
    jobfile += "\n\n"

    return (
        jobfile,
        qe_simulation.absorbing_atom,
        qe_simulation.edge.value.capitalize(),
        pp,
        pp_abs,
    )


def build_qe_xspectra_input(atom_number, edge, filecore):
    jobfile = (
        "&input_xspectra\n"
        + "calculation='xanes_dipole',\n"
        + "prefix='',\n"
        + f"edge='{edge}',\n"
        + f"xiabs={atom_number},\n"
        + "xepsilon(1)=1.0,\n"
        + "xepsilon(2)=0.0,\n"
        + "xepsilon(3)=0.0,\n"
        + "xniter=1000,\n"
        + "xcheck_conv=50,\n"
        + "xerror=0.001,\n"
        + "/\n"
    )
    jobfile += (
        "&plot\n"
        + "xnepoint=1000,\n"
        + "xgamma=0.8,\n"
        + "xemin=-10.0,\n"
        + "xemax=30.0,\n"
        + "terminator=.true.,\n"
        + "cut_occ_states=.true.,\n"
        + "/\n"
    )
    jobfile += "&pseudos\n" + f"filecore='{filecore}',\n" + "r_paw(1)=3.2,\n" + "/\n"
    jobfile += "&cut_occ\n" + "cut_desmooth=0.1,\n" + "cut_stepl=0.01,\n" + "/\n"
    jobfile += "4 4 4 1 1 1"  # need to ask what it means - probably k-points mesh?
    return jobfile
