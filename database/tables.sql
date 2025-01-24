\c webconexsdb

SET role webconexsadmin;

CREATE TABLE person (
	id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	identifier TEXT NOT NULL,
    admin BOOLEAN NOT NULL DEFAULT FALSE,
	UNIQUE (identifier)
);

COMMENT ON TABLE person IS 'Table to store unique identifier of user';

CREATE TABLE simulation_type (
    id INTEGER PRIMARY KEY,
    type TEXT NOT NULL
);

COMMENT ON TABLE simulation_type IS 'Table to store type of simulation job';

INSERT INTO "simulation_type" VALUES(1,'ORCA');
INSERT INTO "simulation_type" VALUES(2,'FDMNES');
INSERT INTO "simulation_type" VALUES(3,'Quantum ESPRESSO');


CREATE TYPE simulation_status_enum AS ENUM('requested', 'submitted', 'running', 'completed', 'failed');

CREATE TABLE simulation (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    simulation_type_id INTEGER NOT NULL,
    person_id INTEGER NOT NULL,
    working_directory TEXT NOT NULL,
    n_cores INTEGER NOT NULL DEFAULT 4,
    memory INTEGER NOT NULL DEFAULT 32,
    status simulation_status_enum DEFAULT 'requested',
    message TEXT,
    job_id INTEGER,
    FOREIGN KEY(simulation_type_id) REFERENCES simulation_type (id),
    FOREIGN KEY(person_id) REFERENCES person (id),
    constraint simulation_altpk unique(id,simulation_type_id)
);

COMMENT ON TABLE simulation IS 'Base table for simulations';

CREATE TABLE molecular_structure (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    label TEXT,
    structure TEXT
);

COMMENT ON TABLE molecular_structure IS 'Table to hold molecular structures';

CREATE TABLE crystal_structure (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    label TEXT,
    structure TEXT
);

COMMENT ON TABLE molecular_structure IS 'Table to hold molecular structures';

CREATE TYPE orca_calculation_enum AS ENUM('xas', 'xes', 'opt');

CREATE TABLE orca_simulation (
    simulation_id INTEGER PRIMARY KEY,
    simulation_type_id INTEGER GENERATED ALWAYS AS (1) STORED,
    calcuation_type orca_calculation_enum,
    molecular_structure_id INTEGER NOT NULL,
    memory_per_core INTEGER NOT NULL,
    functional TEXT NOT NULL,
    basis_set TEXT NOT NULL,
    charge INTEGER NOT NULL,
    multiplicity INTEGER NOT NULL,
    solvent TEXT,
    orb_win_0_start INTEGER,
    orb_win_0_stop INTEGER,
    orb_win_1_start INTEGER,
    orb_win_1_stop INTEGER,
    FOREIGN KEY(molecular_structure_id) REFERENCES molecular_structure (id),
    FOREIGN KEY(simulation_id, simulation_type_id) REFERENCES simulation (id,simulation_type_id)
);

COMMENT ON TABLE orca_simulation IS 'Specific information for an orca simulation';

CREATE TABLE fdmnes_simulation (
    simulation_id INTEGER PRIMARY KEY,
    simulation_type_id INTEGER GENERATED ALWAYS AS (2) STORED,
    FOREIGN KEY(simulation_id, simulation_type_id) REFERENCES simulation (id,simulation_type_id)
);

COMMENT ON TABLE fdmnes_simulation IS 'Specific information for a FDMNES simulation';

CREATE TABLE qe_simulation (
    simulation_id INTEGER PRIMARY KEY,
    simulation_type_id INTEGER GENERATED ALWAYS AS (3) STORED,
    FOREIGN KEY(simulation_id, simulation_type_id) REFERENCES simulation (id,simulation_type_id)
);

COMMENT ON TABLE qe_simulation IS 'Specific information for a Quantum ESPRESSO simulation';

INSERT INTO person(identifier) VALUES('test_user');

INSERT INTO simulation(simulation_type_id, person_id, working_directory) VALUES(1,1,'/working_dir');

INSERT INTO molecular_structure(label, structure) VALUES('Helium', 'He 0 0 0');

INSERT INTO orca_simulation(simulation_id, calcuation_type, molecular_structure_id, memory_per_core, functional,basis_set, charge, multiplicity) VALUES(1, 'xas', 1, 1024, 'BP86','6-31G',0,1);
