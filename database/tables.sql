\c webconexsdb

SET role webconexsadmin;

CREATE TABLE element (
	z INTEGER NOT NULL,
	name TEXT NOT NULL,
	symbol VARCHAR(2) NOT NULL,
	PRIMARY KEY (z),
	UNIQUE (name),
	UNIQUE (symbol)
);

COMMENT ON TABLE element IS 'Elements of the periodic table';

INSERT INTO "element" VALUES(1,'hydrogen','H');
INSERT INTO "element" VALUES(2,'helium','He');
INSERT INTO "element" VALUES(3,'lithium','Li');
INSERT INTO "element" VALUES(4,'beryllium','Be');
INSERT INTO "element" VALUES(5,'boron','B');
INSERT INTO "element" VALUES(6,'carbon','C');
INSERT INTO "element" VALUES(7,'nitrogen','N');
INSERT INTO "element" VALUES(8,'oxygen','O');
INSERT INTO "element" VALUES(9,'fluorine','F');
INSERT INTO "element" VALUES(10,'neon','Ne');
INSERT INTO "element" VALUES(11,'sodium','Na');
INSERT INTO "element" VALUES(12,'magnesium','Mg');
INSERT INTO "element" VALUES(13,'aluminum','Al');
INSERT INTO "element" VALUES(14,'silicon','Si');
INSERT INTO "element" VALUES(15,'phosphorus','P');
INSERT INTO "element" VALUES(16,'sulfur','S');
INSERT INTO "element" VALUES(17,'chlorine','Cl');
INSERT INTO "element" VALUES(18,'argon','Ar');
INSERT INTO "element" VALUES(19,'potassium','K');
INSERT INTO "element" VALUES(20,'calcium','Ca');
INSERT INTO "element" VALUES(21,'scandium','Sc');
INSERT INTO "element" VALUES(22,'titanium','Ti');
INSERT INTO "element" VALUES(23,'vanadium','V');
INSERT INTO "element" VALUES(24,'chromium','Cr');
INSERT INTO "element" VALUES(25,'manganese','Mn');
INSERT INTO "element" VALUES(26,'iron','Fe');
INSERT INTO "element" VALUES(27,'cobalt','Co');
INSERT INTO "element" VALUES(28,'nickel','Ni');
INSERT INTO "element" VALUES(29,'copper','Cu');
INSERT INTO "element" VALUES(30,'zinc','Zn');
INSERT INTO "element" VALUES(31,'gallium','Ga');
INSERT INTO "element" VALUES(32,'germanium','Ge');
INSERT INTO "element" VALUES(33,'arsenic','As');
INSERT INTO "element" VALUES(34,'selenium','Se');
INSERT INTO "element" VALUES(35,'bromine','Br');
INSERT INTO "element" VALUES(36,'krypton','Kr');
INSERT INTO "element" VALUES(37,'rubidium','Rb');
INSERT INTO "element" VALUES(38,'strontium','Sr');
INSERT INTO "element" VALUES(39,'yttrium','Y');
INSERT INTO "element" VALUES(40,'zirconium','Zr');
INSERT INTO "element" VALUES(41,'niobium','Nb');
INSERT INTO "element" VALUES(42,'molybdenum','Mo');
INSERT INTO "element" VALUES(43,'technetium','Tc');
INSERT INTO "element" VALUES(44,'ruthenium','Ru');
INSERT INTO "element" VALUES(45,'rhodium','Rh');
INSERT INTO "element" VALUES(46,'palladium','Pd');
INSERT INTO "element" VALUES(47,'silver','Ag');
INSERT INTO "element" VALUES(48,'cadmium','Cd');
INSERT INTO "element" VALUES(49,'indium','In');
INSERT INTO "element" VALUES(50,'tin','Sn');
INSERT INTO "element" VALUES(51,'antimony','Sb');
INSERT INTO "element" VALUES(52,'tellurium','Te');
INSERT INTO "element" VALUES(53,'iodine','I');
INSERT INTO "element" VALUES(54,'xenon','Xe');
INSERT INTO "element" VALUES(55,'cesium','Cs');
INSERT INTO "element" VALUES(56,'barium','Ba');
INSERT INTO "element" VALUES(57,'lanthanum','La');
INSERT INTO "element" VALUES(58,'cerium','Ce');
INSERT INTO "element" VALUES(59,'praseodymium','Pr');
INSERT INTO "element" VALUES(60,'neodymium','Nd');
INSERT INTO "element" VALUES(61,'promethium','Pm');
INSERT INTO "element" VALUES(62,'samarium','Sm');
INSERT INTO "element" VALUES(63,'europium','Eu');
INSERT INTO "element" VALUES(64,'gadolinium','Gd');
INSERT INTO "element" VALUES(65,'terbium','Tb');
INSERT INTO "element" VALUES(66,'dysprosium','Dy');
INSERT INTO "element" VALUES(67,'holmium','Ho');
INSERT INTO "element" VALUES(68,'erbium','Er');
INSERT INTO "element" VALUES(69,'thulium','Tm');
INSERT INTO "element" VALUES(70,'ytterbium','Yb');
INSERT INTO "element" VALUES(71,'lutetium','Lu');
INSERT INTO "element" VALUES(72,'hafnium','Hf');
INSERT INTO "element" VALUES(73,'tantalum','Ta');
INSERT INTO "element" VALUES(74,'tungsten','W');
INSERT INTO "element" VALUES(75,'rhenium','Re');
INSERT INTO "element" VALUES(76,'osmium','Os');
INSERT INTO "element" VALUES(77,'iridium','Ir');
INSERT INTO "element" VALUES(78,'platinum','Pt');
INSERT INTO "element" VALUES(79,'gold','Au');
INSERT INTO "element" VALUES(80,'mercury','Hg');
INSERT INTO "element" VALUES(81,'thallium','Tl');
INSERT INTO "element" VALUES(82,'lead','Pb');
INSERT INTO "element" VALUES(83,'bismuth','Bi');
INSERT INTO "element" VALUES(84,'polonium','Po');
INSERT INTO "element" VALUES(85,'astatine','At');
INSERT INTO "element" VALUES(86,'radon','Rn');
INSERT INTO "element" VALUES(87,'francium','Fr');
INSERT INTO "element" VALUES(88,'radium','Ra');
INSERT INTO "element" VALUES(89,'actinium','Ac');
INSERT INTO "element" VALUES(90,'thorium','Th');
INSERT INTO "element" VALUES(91,'protactinium','Pa');
INSERT INTO "element" VALUES(92,'uranium','U');
INSERT INTO "element" VALUES(93,'neptunium','Np');
INSERT INTO "element" VALUES(94,'plutonium','Pu');
INSERT INTO "element" VALUES(95,'americium','Am');
INSERT INTO "element" VALUES(96,'curium','Cm');
INSERT INTO "element" VALUES(97,'berkelium','Bk');
INSERT INTO "element" VALUES(98,'californium','Cf');
INSERT INTO "element" VALUES(99,'einsteinium','Es');
INSERT INTO "element" VALUES(100,'fermium','Fm');
INSERT INTO "element" VALUES(101,'mendelevium','Md');
INSERT INTO "element" VALUES(102,'nobelium','No');
INSERT INTO "element" VALUES(103,'lawerencium','Lw');
INSERT INTO "element" VALUES(104,'rutherfordium','Rf');
INSERT INTO "element" VALUES(105,'dubnium','Ha');
INSERT INTO "element" VALUES(106,'seaborgium','Sg');
INSERT INTO "element" VALUES(107,'bohrium','Bh');
INSERT INTO "element" VALUES(108,'hassium','Hs');
INSERT INTO "element" VALUES(109,'meitnerium','Mt');
INSERT INTO "element" VALUES(110,'darmstadtium','Ds');
INSERT INTO "element" VALUES(111,'roentgenium','Rg');
INSERT INTO "element" VALUES(112,'copernicium','Cn');


CREATE TABLE person (
	id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
	identifier TEXT NOT NULL,
    accepted_orca_eula BOOLEAN NOT NULL DEFAULT FALSE,
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


CREATE TYPE simulation_status_enum AS ENUM('requested', 'submitted', 'running', 'completed', 'failed', 'error', 'request_cancel', 'cancelled');

CREATE TABLE lattice (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    a NUMERIC NOT NULL,
    b NUMERIC NOT NULL,
    c NUMERIC NOT NULL,
    alpha NUMERIC NOT NULL,
    beta NUMERIC NOT NULL,
    gamma NUMERIC NOT NULL
);

COMMENT ON TABLE lattice IS 'Table to describe a crystal lattice';

CREATE TABLE chemical_structure (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    label TEXT,
    person_id INTEGER NOT NULL,
    lattice_id INTEGER,
    FOREIGN KEY(person_id) REFERENCES person (id),
    FOREIGN KEY(lattice_id) REFERENCES lattice (id)
);

COMMENT ON TABLE chemical_structure IS 'Table describing a structure, linking  multiple chemical sites';


CREATE TABLE simulation (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    simulation_type_id INTEGER NOT NULL,
    person_id INTEGER NOT NULL,
    chemical_structure_id INTEGER NOT NULL,
    working_directory TEXT,
    n_cores INTEGER NOT NULL DEFAULT 4,
    memory INTEGER NOT NULL DEFAULT 32,
    status simulation_status_enum DEFAULT 'requested',
    message TEXT,
    job_id INTEGER,
    request_date TIMESTAMP DEFAULT current_timestamp,
    submission_date TIMESTAMP,
    completion_date TIMESTAMP,
    FOREIGN KEY(chemical_structure_id) REFERENCES chemical_structure (id),
    FOREIGN KEY(simulation_type_id) REFERENCES simulation_type (id),
    FOREIGN KEY(person_id) REFERENCES person (id),
    constraint simulation_altpk unique(id,simulation_type_id)
);

COMMENT ON TABLE simulation IS 'Base table for simulations';

--CREATE OR REPLACE FUNCTION notify_new_simulation() RETURNS trigger AS $$
--BEGIN
--  PERFORM pg_notify('simulation_notification', NEW.id::text);
--  RETURN NEW;
--END;
--$$ LANGUAGE plpgsql;

--CREATE TRIGGER simulation_notify_trigger
--AFTER INSERT ON simulation
--FOR EACH ROW EXECUTE PROCEDURE notify_new_simulation();



CREATE TABLE chemical_site (
    id INTEGER PRIMARY KEY GENERATED ALWAYS AS IDENTITY,
    chemical_structure_id INTEGER NOT NULL,
    element_z INTEGER NOT NULL,
    x NUMERIC NOT NULL,
    y NUMERIC NOT NULL,
    z NUMERIC NOT NULL,
    index INTEGER NOT NULL,
    FOREIGN KEY(element_z) REFERENCES element (z),
    FOREIGN KEY(chemical_structure_id) REFERENCES chemical_structure (id)

);

COMMENT ON TABLE chemical_site IS 'Table to hold location of an element';

CREATE TYPE orca_calculation_enum AS ENUM('xas', 'xes', 'opt');

CREATE TYPE orca_solvent_enum AS ENUM('Water','Acetone', 'Acetonitrile',  'Ammonia', 'Benzene', 'CCl4', 'CH2Cl2', 'Chloroform', 'Cyclohexane', 'DMF', 'DMSO', 'Ethanol', 'Hexane', 'Methanol', 'Octanol', 'Pyridine', 'THF','Toluene');

CREATE TABLE orca_simulation (
    simulation_id INTEGER PRIMARY KEY,
    simulation_type_id INTEGER GENERATED ALWAYS AS (1) STORED,
    calculation_type orca_calculation_enum,
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
    FOREIGN KEY(simulation_id, simulation_type_id) REFERENCES simulation (id,simulation_type_id)
);

COMMENT ON TABLE orca_simulation IS 'Specific information for an orca simulation';


CREATE TYPE edge_enum AS ENUM('k', 'l1', 'l2', 'l3', 'm1', 'm2', 'm3', 'm4', 'm5');

CREATE TABLE fdmnes_simulation (
    simulation_id INTEGER PRIMARY KEY,
    simulation_type_id INTEGER GENERATED ALWAYS AS (2) STORED,
    element INTEGER NOT NULL,
    edge edge_enum NOT NULL,
    greens_approach BOOLEAN NOT NULL,

    FOREIGN KEY(simulation_id, simulation_type_id) REFERENCES simulation (id,simulation_type_id)
);

COMMENT ON TABLE fdmnes_simulation IS 'Specific information for a FDMNES simulation';

CREATE TYPE qe_edge_enum AS ENUM('k', 'l1', 'l2', 'l23');

CREATE TYPE conductivity_enum AS ENUM('metallic', 'semiconductor', 'insulator');

CREATE TABLE qe_simulation (
    simulation_id INTEGER PRIMARY KEY,
    simulation_type_id INTEGER GENERATED ALWAYS AS (3) STORED,
    absorbing_atom INTEGER NOT NULL,
    edge qe_edge_enum NOT NULL,
    conductivity conductivity_enum NOT NULL,
    FOREIGN KEY(simulation_id, simulation_type_id) REFERENCES simulation (id,simulation_type_id)
);

COMMENT ON TABLE qe_simulation IS 'Specific information for a Quantum ESPRESSO simulation';

INSERT INTO person(identifier) VALUES('test_user');

INSERT INTO lattice(id, a, b, c, alpha, beta, gamma) VALUES(DEFAULT,4.44,4.44,4.44,60,60,60);

INSERT INTO chemical_structure(label, person_id, lattice_id) VALUES('Water', 1, NULL), ('KCl', 1, 1);;


-- INSERT INTO chemical_structure(id, label, person_id, lattice_id) VALUES(DEFAULT, 'KCl', 1, 1);

INSERT INTO chemical_site(chemical_structure_id, element_z, x, y, z, index) VALUES(1,1,0.7493682,0.0000000,0.4424329,1), (1,8,0.0000000,0.0000000,-0.1653507,2), (1,1,-0.7493682,0.0000000,0.4424329,3);
-- INSERT INTO chemical_site(chemical_structure_id, element_z, x, y, z, index) VALUES(1,8,0.0000000,0.0000000,-0.1653507,2);
-- INSERT INTO chemical_site(chemical_structure_id, element_z, x, y, z, index) VALUES(1,1,-0.7493682,0.0000000,0.4424329,3);


-- INSERT INTO crystal_structure(label, person_id,a,b,c,alpha,beta,gamma,structure) VALUES('Silver',1,4.1043564,4.1043564,4.1043564,90,90,90,'Ag 0.0 0.0 0.0
-- Ag 0.5 0.5 0.0
-- Ag 0.5 0.0 0.5
-- Ag 0.0 0.5 0.5');



INSERT INTO chemical_site (chemical_structure_id, element_z, x, y, z, index) VALUES(2, 19, 0.0, 0.0, 0.0, 1);
INSERT INTO chemical_site (chemical_structure_id, element_z, x, y, z, index) VALUES(2, 17, 0.5, 0.5, 0.5, 2);


-- INSERT INTO crystal_structure(label, person_id,a,b,c,alpha,beta,gamma,structure) VALUES('KCl',1,4.44,4.44,4.44,60,60,60,'K 0.0 0.0 0.0
-- Cl 0.5 0.5 0.5');
