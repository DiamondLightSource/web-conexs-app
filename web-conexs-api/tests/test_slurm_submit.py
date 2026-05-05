import json
import os

from mock import Mock, patch

TEST_PARTITION = "TEST_PARTITION"
TEST_API = "/test_api"
TEST_USER = "test_user"


@patch.dict(os.environ, {"SLURM_PARTITION": TEST_PARTITION})
@patch.dict(os.environ, {"SLURM_API": TEST_API})
@patch.dict(os.environ, {"SLURM_USER": TEST_USER})
@patch("requests.post")
def test_build_job(mocked_post):
    # import here to get patched environ
    from slurm_submission_service.slurm_submit import build_job_and_run

    mocked_post.return_value = Mock(status_code=200, json=lambda: {"job_id": 1})

    build_job_and_run(
        "#!/bin/bash\necho hello", "test_job", 1, "test_memory", "/test", False
    )

    json_data = json.loads(mocked_post.call_args[1]["data"])

    assert mocked_post.called
    assert mocked_post.call_args[0][0].startswith(TEST_API)
    assert json_data["job"]["environment"]["USER"] == TEST_USER
    assert json_data["job"]["partition"] == TEST_PARTITION
