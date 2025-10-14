from pathlib import Path

from slurm_submission_service.filetransfer import (
    check_filesystem,
    clean_up,
    copy_directory,
    copy_multiple_files,
    make_directory,
    transfer_inputs,
    transfer_results,
)


def test_check_filesystem(tmp_path: Path):
    d = tmp_path / "test_dir"
    d.mkdir()
    check_filesystem(str(d))
    assert True


def test_make_directory(tmp_path: Path):
    d = tmp_path / "test_dir"
    assert not d.exists()
    make_directory(str(d))
    assert d.exists()


def test_copy_dir_file(tmp_path: Path):
    job_text = "job"
    filename = "job.inp"
    s = tmp_path / "source"
    s.mkdir()
    p = s / filename
    p.write_text("job")

    d = tmp_path / "destination"

    copy_directory(str(s), str(d))

    print([str(x) for x in s.iterdir()])
    print([str(x) for x in d.iterdir()])

    output = d / filename

    assert output.exists()

    assert output.read_text() == job_text


def test_transfer_inputs(tmp_path: Path):
    job_text = "job"
    filename = "job.inp"
    file_map = {}
    file_map[filename] = job_text
    d = tmp_path / "destination"

    transfer_inputs(file_map, d)

    output = d / filename

    assert output.exists()

    assert output.read_text() == job_text


def test_transfer_results(tmp_path: Path):
    job_text = "job"
    filename = "job.inp"
    bad_file = "test.gbw"
    s = tmp_path / "source"
    s.mkdir()
    p = s / filename
    p.write_text("job")

    b = s / bad_file
    b.touch()

    orca = tmp_path / "orca"
    orca.mkdir()

    transfer_results(1, str(s), str(orca))

    print([str(x) for x in s.iterdir()])
    print([str(x) for x in orca.iterdir()])

    output = orca / filename
    bad = orca / bad_file

    assert output.exists()
    assert not bad.exists()

    assert output.read_text() == job_text

    update_text = "jobagain"

    p.write_text(update_text)

    assert output.read_text() != update_text

    transfer_results(1, str(s), str(orca))

    assert output.read_text() == update_text


def test_multiple_files(tmp_path: Path):
    job_text = "job"
    filename = "job.inp"
    s = tmp_path / "source"
    s.mkdir()
    p = s / filename
    p.write_text("job")

    d = tmp_path / "destination"

    d.mkdir()

    copy_multiple_files([str(p)], str(d))

    print([str(x) for x in s.iterdir()])
    print([str(x) for x in d.iterdir()])

    output = d / filename

    assert output.exists()

    assert output.read_text() == job_text


def test_clean_dir(tmp_path: Path):
    filename = "job.inp"
    filename_tmp = "job.tmp"
    s = tmp_path / "source"
    filename_opt = "job.opt"
    s.mkdir()
    p = s / filename
    p.write_text("job")
    p_tmp = s / filename_tmp
    p_tmp.write_text("tmp")

    p_opt = s / filename_opt
    p_opt.write_text("tmp")

    clean_up(str(s))

    assert p.exists()
    assert not p_tmp.exists()
    assert not p_opt.exists()
