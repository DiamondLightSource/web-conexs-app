import os

import requests
from fastapi import (
    Depends,
    HTTPException,
    status,
)
from fastapi.security.http import HTTPAuthorizationCredentials, HTTPBearer

get_bearer_token = HTTPBearer(auto_error=True)

oidc_user_info_endpoint = os.environ.get("OIDC_USER_INFO_ENDPOINT")
oidc_id_key = os.environ.get("OIDC_ID_KEY", "id")
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

    return response.json()[oidc_id_key]
