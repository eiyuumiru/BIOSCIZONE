"""
Initialize local database: create tables + seed default admin from env.
Run from the backend/ directory:  python -m app.init_local

Uses a single connection for the whole run (avoids a libsql-rust quirk where
querying on a second connection after another was closed can panic).
"""
import pathlib
import uuid

from .config import settings

SCHEMA_PATH = pathlib.Path(__file__).parent / "schema.sql"


def main() -> None:
    import libsql

    conn = libsql.connect(settings.TURSO_DATABASE_URL, auth_token=settings.TURSO_AUTH_TOKEN)

    # 1. Create tables (idempotent)
    for statement in SCHEMA_PATH.read_text(encoding="utf-8").split(";"):
        if statement.strip():
            conn.execute(statement)
    print("Schema OK")

    # 2. Seed default admin from env if none exists yet
    count = conn.execute("SELECT COUNT(*) FROM admins").fetchone()[0]
    if count == 0 and settings.ADMIN_USERNAME and settings.ADMIN_PASSWORD:
        from .auth import get_password_hash
        conn.execute(
            "INSERT INTO admins (id, username, hashed_password, role, email) VALUES (?, ?, ?, ?, ?)",
            [str(uuid.uuid4()), settings.ADMIN_USERNAME,
             get_password_hash(settings.ADMIN_PASSWORD), "superadmin", None],
        )
        conn.commit()
        print(f"Seeded default superadmin: {settings.ADMIN_USERNAME}")
    elif count > 0:
        print(f"Admins already exist ({count}), skipping seed.")

    conn.close()
    print("Database initialized:", settings.TURSO_DATABASE_URL)


if __name__ == "__main__":
    main()
