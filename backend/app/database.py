import libsql
import pathlib
from .config import settings

# Path to schema.sql relative to this file
SCHEMA_PATH = pathlib.Path(__file__).parent / "schema.sql"

def get_db():
    conn = libsql.connect(
        settings.TURSO_DATABASE_URL,
        auth_token=settings.TURSO_AUTH_TOKEN
    )
    try:
        yield conn
    finally:
        conn.close()

def init_db():
    conn = libsql.connect(
        settings.TURSO_DATABASE_URL,
        auth_token=settings.TURSO_AUTH_TOKEN
    )
    
    # Create tables
    with open(SCHEMA_PATH, "r", encoding="utf-8") as f:
        schema = f.read()
        # libsql's execute can run multiple statements if they are separated by ; 
        # but let's be safe and split like before
        for statement in schema.split(";"):
            if statement.strip():
                conn.execute(statement)
    
    conn.close()
