from fastapi import APIRouter


router = APIRouter(prefix="/api/v1/debug", tags=["debug"])


@router.get("/boom")
def boom():
    raise RuntimeError("Sentry test boom!")
