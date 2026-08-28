import logging
import os

import ldap
import requests

server_url = os.environ.get("LDAP_URL")
search_base = os.environ.get("LDAP_BASE")
attribute = os.environ.get("LDAP_ATTR_KEY")
attribute_value = os.environ.get("LDAP_ATTR_VALUE")

opa_url = os.environ.get("OPA_URL")


logger = logging.getLogger(__name__)


def authz_check_ldap(id: str) -> bool:
    try:
        search_filter = f"(cn={id})"
        con = ldap.initialize(server_url)
        rid = con.search_s(search_base, ldap.SCOPE_SUBTREE, search_filter, [attribute])

        for dn, entry in rid:
            if attribute in entry:
                for result in entry[attribute]:
                    if hasattr(result, "decode"):
                        r = result.decode()
                    else:
                        r = result

                    if r == attribute_value:
                        return True

        return False
    except Exception as e:
        logging.exception(e)
        return False


def authz_check_opa(token: str) -> bool:
    try:
        r = requests.post(opa_url, json={"input": {"token": token}})
        r.raise_for_status()
        rjson = r.json()

        return rjson["result"]
    except Exception as e:
        logging.exception(e)
        return False
