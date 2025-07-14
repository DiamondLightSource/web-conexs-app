import io
from typing import List

import numpy as np
from pymatgen.core import Lattice, Structure

from .models.models import (
    ChemicalSite,
    ChemicalStructure,
    ConductivityType,
    CrystalStructure,
    FdmnesSimulation,
    MolecularStructure,
    OrcaCalculation,
    OrcaSimulation,
    QESimulation,
)
from .models.models import Lattice as CrystalLattice
from .periodictable import elements, periodic_table_by_z


def sites_to_string(sites: List[ChemicalSite], use_symbol=True, absorbing_index=None):
    structure_string = ""
    sorted_sites = sorted(sites, key=lambda site: site.index)

    for idx, s in enumerate(sorted_sites, start=1):
        site_string = (
            periodic_table_by_z[s.element_z] if use_symbol else str(s.element_z)
        )
        if absorbing_index is not None and absorbing_index == idx:
            site_string += "*"
        structure_string += f"{site_string} {s.x} {s.y} {s.z}\n"

    return structure_string


def build_fdmnes_inputfile(
    fdmnes_simulation: FdmnesSimulation,
    structure: CrystalStructure,
    crystalIsMolecule: bool,
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

    jobfile += "Crystal\n" if not crystalIsMolecule else "Molecule\n"

    jobfile += f"{structure.lattice.a} {structure.lattice.b} {structure.lattice.c}"
    jobfile += (
        f" {structure.lattice.alpha}"
        + f" {structure.lattice.beta}"
        + f" {structure.lattice.gamma}\n"
    )

    jobfile += sites_to_string(structure.sites, use_symbol=False)

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
        jobfile += " CPCM(" + orca_simulation.solvent.value + ") "

    jobfile += "\n"

    memory_per_core = int(
        (orca_simulation.simulation.memory * 0.7) / orca_simulation.simulation.n_cores
    )

    jobfile += "%maxcore " + str(memory_per_core) + "\n\n"
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

    jobfile += sites_to_string(structure.sites)
    jobfile += "\nend"

    return jobfile


def build_qe_inputfile(
    qe_simulation: QESimulation, structure: ChemicalStructure
) -> str:
    abs_atom = structure.sites[qe_simulation.absorbing_atom - 1]
    abs_el = periodic_table_by_z[abs_atom.element_z]

    element_set = set()
    number_of_atoms = 0
    number_of_electrons = 0

    abs_el_count = 0

    for atom in structure.sites:
        number_of_atoms += 1
        element_set.add(periodic_table_by_z[atom.element_z])
        atomic_number = atom.element_z

        if atomic_number == abs_atom.element_z:
            abs_el_count += 1

        number_of_electrons += atomic_number

    n_type = len(element_set)

    if abs_el_count > 1:
        n_type += 1

    lattice = Lattice.from_parameters(
        a=structure.lattice.a,
        b=structure.lattice.b,
        c=structure.lattice.c,
        alpha=structure.lattice.alpha,
        beta=structure.lattice.beta,
        gamma=structure.lattice.gamma,
    )

    matrix = lattice.matrix

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
    jobfile += " ibrav = 0\n"

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
        if el == abs_el and abs_el_count == 1:
            continue

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

    jobfile += sites_to_string(
        structure.sites, absorbing_index=qe_simulation.absorbing_atom
    )

    jobfile += "\n\n"
    jobfile += "K_POINTS automatic\n"
    jobfile += "1 1 1 0 0 0\n"
    jobfile += "\n\n"

    jobfile += "CELL_PARAMETERS {angstrom}\n"

    s = io.BytesIO()

    np.savetxt(s, matrix)

    jobfile += s.getvalue().decode()

    jobfile += "\n"

    return (
        jobfile,
        qe_simulation.absorbing_atom,
        qe_simulation.edge.value.capitalize(),
        pp,
        pp_abs,
    )


def build_qe_xspectra_inputs(edge, filecore):
    files = []
    for i in range(3):
        files.append(build_qe_xspectra_input(edge, filecore, i))

    return files


def build_qe_xspectra_input(edge, filecore, dir):
    one = "1.0"
    zero = "0.0"

    name = ["0", "0", "0"]
    name[dir] = "1"

    str_name = "".join(name)

    jobfile = (
        "&input_xspectra\n"
        + "calculation='xanes_dipole',\n"
        + "prefix='',\n"
        + f"edge='{edge}',\n"
        + "xiabs=1,\n"
        + f"xepsilon(1)={one if dir == 0 else zero},\n"
        + f"xepsilon(2)={one if dir == 1 else zero},\n"
        + f"xepsilon(3)={one if dir == 2 else zero},\n"
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
        + f"xanes_file={str_name}xanes.dat,"
        + "/\n"
    )
    jobfile += "&pseudos\n" + f"filecore='{filecore}',\n" + "r_paw(1)=3.2,\n" + "/\n"
    jobfile += "&cut_occ\n" + "cut_desmooth=0.1,\n" + "cut_stepl=0.01,\n" + "/\n"
    jobfile += "4 4 4 1 1 1"  # need to ask what it means - probably k-points mesh?
    return jobfile


def fdmnes_molecule_to_crystal(
    moleculeStructure: MolecularStructure,
) -> ChemicalStructure:
    coords = [[s.x, s.y, s.z] for s in moleculeStructure.sites]
    coords = np.asarray(coords)

    abs_max = np.abs(coords).max(axis=0)
    # if only zero coord set cell dim to 1
    abs_max[abs_max == 0] = 1

    norm_coords = coords / abs_max

    new_sites: List[ChemicalSite] = []

    for i in range(norm_coords.shape[0]):
        new_sites.append(
            ChemicalSite(
                element_z=moleculeStructure.sites[i].element_z,
                x=norm_coords[i, 0],
                y=norm_coords[i, 1],
                z=norm_coords[i, 2],
                index=i,
            )
        )

    crystal: ChemicalStructure = ChemicalStructure(
        label=moleculeStructure.label,
        lattice=CrystalLattice(
            a=abs_max[0],
            b=abs_max[1],
            c=abs_max[2],
            alpha=90,
            beta=90,
            gamma=90,
        ),
        sites=new_sites,
    )

    return crystal


def pymatstruct_to_crystal(structure: Structure, label="materials project structure"):
    structure_string = ""

    for site in structure.sites:
        structure_string += f"{site.species_string} {site.a} {site.b} {site.c}\n"

        crystal: CrystalStructure = CrystalStructure(
            label=label,
            a=structure.lattice.a,
            b=structure.lattice.b,
            c=structure.lattice.c,
            alpha=structure.lattice.alpha,
            beta=structure.lattice.beta,
            gamma=structure.lattice.gamma,
            structure=structure_string,
        )

    return crystal
