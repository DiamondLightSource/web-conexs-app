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


CREATE TYPE simulation_status_enum AS ENUM('requested', 'submitted', 'running', 'completed', 'failed', 'error');

CREATE TABLE simulation (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    simulation_type_id INTEGER NOT NULL,
    person_id INTEGER NOT NULL,
    working_directory TEXT,
    n_cores INTEGER NOT NULL DEFAULT 4,
    memory INTEGER NOT NULL DEFAULT 32,
    status simulation_status_enum DEFAULT 'requested',
    message TEXT,
    job_id INTEGER,
    request_date TIMESTAMP DEFAULT current_timestamp,
    submission_date TIMESTAMP,
    completion_date TIMESTAMP,
    FOREIGN KEY(simulation_type_id) REFERENCES simulation_type (id),
    FOREIGN KEY(person_id) REFERENCES person (id),
    constraint simulation_altpk unique(id,simulation_type_id)
);

COMMENT ON TABLE simulation IS 'Base table for simulations';

CREATE OR REPLACE FUNCTION notify_new_simulation() RETURNS trigger AS $$
BEGIN
  PERFORM pg_notify('simulation_notification', NEW.id::text);
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER simulation_notify_trigger
AFTER INSERT ON simulation
FOR EACH ROW EXECUTE PROCEDURE notify_new_simulation();


CREATE TABLE molecular_structure (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    label TEXT,
    structure TEXT
);

COMMENT ON TABLE molecular_structure IS 'Table to hold molecular structures';

CREATE TABLE crystal_structure (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    label TEXT,
    structure TEXT NOT NULL,
    a NUMERIC NOT NULL,
    b NUMERIC NOT NULL,
    c NUMERIC NOT NULL,
    alpha NUMERIC NOT NULL,
    beta NUMERIC NOT NULL,
    gamma NUMERIC NOT NULL

);

COMMENT ON TABLE molecular_structure IS 'Table to hold molecular structures';

CREATE TYPE orca_calculation_enum AS ENUM('xas', 'xes', 'opt');

CREATE TYPE orca_solvent_enum AS ENUM('Water','Acetone', 'Acetonitrile',  'Ammonia', 'Benzene', 'CCl4', 'CH2Cl2', 'Chloroform', 'Cyclohexane', 'DMF', 'DMSO', 'Ethanol', 'Hexane', 'Methanol', 'Octanol', 'Pyridine', 'THF','Toluene');

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
    solvent orca_solvent_enum,
    orb_win_0_start INTEGER DEFAULT 0,
    orb_win_0_stop INTEGER DEFAULT 0,
    orb_win_1_start INTEGER DEFAULT 0,
    orb_win_1_stop INTEGER DEFAULT 0,
    FOREIGN KEY(molecular_structure_id) REFERENCES molecular_structure (id),
    FOREIGN KEY(simulation_id, simulation_type_id) REFERENCES simulation (id,simulation_type_id)
);

COMMENT ON TABLE orca_simulation IS 'Specific information for an orca simulation';

CREATE TYPE orca_spectrum_enum AS ENUM('abs', 'absq', 'xes', 'xesq');

CREATE TABLE orca_simulation_spectrum(
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    simulation_id INTEGER NOT NULL,
    spectrum_type orca_spectrum_enum,
    start INTEGER NOT NULL,
    stop INTEGER NOT NULL,
    broadening NUMERIC NOT NULL,
    working_dir TEXT NOT NULL,

    FOREIGN KEY(simulation_id) REFERENCES orca_simulation (simulation_id)

);

CREATE TYPE edge_enum AS ENUM('k', 'l1', 'l2', 'l3', 'm1', 'm2', 'm3', 'm4', 'm5');

CREATE TYPE structure_enum AS ENUM('crystal', 'molecule');

CREATE TABLE fdmnes_simulation (
    simulation_id INTEGER PRIMARY KEY,
    simulation_type_id INTEGER GENERATED ALWAYS AS (2) STORED,
    crystal_structure_id INTEGER NOT NULL,
    element INTEGER NOT NULL,
    edge edge_enum NOT NULL,
    greens_approach BOOLEAN NOT NULL,
    structure_type structure_enum NOT NULL,

    FOREIGN KEY(crystal_structure_id) REFERENCES crystal_structure (id),
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

INSERT INTO molecular_structure(label, structure) VALUES('Water', 'H    0.7493682    0.0000000    0.4424329
O    0.0000000    0.0000000   -0.1653507
H   -0.7493682    0.0000000    0.4424329');

INSERT INTO orca_simulation(simulation_id, calcuation_type, molecular_structure_id, memory_per_core, functional,basis_set, charge, multiplicity) VALUES(1, 'xas', 1, 1024, 'BP86','6-31G',0,1);
