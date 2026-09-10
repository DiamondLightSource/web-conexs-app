import logging
import os

import requests

opa_url = os.environ.get("OPA_URL")


logger = logging.getLogger(__name__)


def authz_check_opa(token: str) -> bool:
    try:
        r = requests.post(opa_url, json={"input": {"token": token}})
        r.raise_for_status()
        rjson = r.json()

        return rjson["result"]
    except Exception as e:
        logging.exception(e)
        return False
