from fastapi import HTTPException


def require_feature(module_id: str):
    def guard():
        # MVP stub: allow all
        return True

    return guard
