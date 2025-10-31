import os
from sqlalchemy import create_engine
from sqlalchemy.orm import sessionmaker, DeclarativeBase


DATABASE_URL = os.getenv("DATABASE_URL", "sqlite:///./local.db")

engine = create_engine(DATABASE_URL, future=True)
SessionLocal = sessionmaker(bind=engine, autoflush=False, autocommit=False, future=True)


class Base(DeclarativeBase):
    pass


def get_session():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()
