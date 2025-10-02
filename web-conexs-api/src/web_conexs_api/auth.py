import os

import requests
from fastapi import (
    Depends,
    HTTPException,
    status,
)
from fastapi.security.http import HTTPAuthorizationCredentials, HTTPBearer

from .authz import authz_check

# False so we dont get a 403 when it should be a 401
get_bearer_token = HTTPBearer(auto_error=False)

oidc_user_info_endpoint = os.environ.get("OIDC_USER_INFO_ENDPOINT")
oidc_id_key = os.environ.get("OIDC_ID_KEY", "id")
authz_key = os.environ.get("AUTHZ_CHECK")

AUTH_LDAP = "LDAP"
AUTH_NONE = "NONE"

dev = False
env_value = os.environ.get("FASTAPI_APP_ENV")


if env_value and env_value == "development":
    print("RUNNING IN DEV MODE")
    dev = True


async def get_current_user(
    auth: HTTPAuthorizationCredentials = Depends(get_bearer_token),
):
    if auth is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user token",
        )

    if dev:
        return auth.credentials

    if oidc_user_info_endpoint is None:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="User info endpoint error",
        )

    response = requests.get(
        url=oidc_user_info_endpoint,
        headers={"Authorization": f"Bearer {auth.credentials}"},
    )

    if response.status_code == 401:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid user token",
        )

    id = response.json()[oidc_id_key]

    if authz_key == AUTH_LDAP:
        if authz_check(id):
            return id
        else:
            raise HTTPException(
                status_code=status.HTTP_403_FORBIDDEN,
                detail="Access Forbidden",
            )
    elif authz_key == AUTH_LDAP:
        return id
    else:
        raise HTTPException(
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
            detail="Authz not configured",
        )
