from argparse import ArgumentParser

import uvicorn

# from . import __version__

__all__ = ["main"]


def main(args=None):
    parser = ArgumentParser()
    parser.add_argument("-v", "--version", action="version", version=0.1)
    args = parser.parse_args(args)

    uvicorn.run("web_conexs_api.app:app", port=5000, log_level="info", host="0.0.0.0")


# test with: python -m web_conexs_api
if __name__ == "__main__":
    main()
