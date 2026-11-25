"""SQL-практикум: запросы и параметры."""

import sqlite3


def setup() -> sqlite3.Connection:
    connection = sqlite3.connect(":memory:")
    connection.execute(
        "CREATE TABLE users (id INTEGER PRIMARY KEY, name TEXT NOT NULL)"
    )
    connection.executemany(
        "INSERT INTO users (name) VALUES (?)", [("Анна",), ("Борис",)]
    )
    return connection


def find_user(connection: sqlite3.Connection, name: str):
    row = connection.execute(
        "SELECT id, name FROM users WHERE name = ?", (name,)
    ).fetchone()
    return row


def count_users(connection: sqlite3.Connection) -> int:
    row = connection.execute("SELECT COUNT(*) FROM users").fetchone()
    return row[0]


def main() -> None:
    connection = setup()
    print(find_user(connection, "Анна"))
    print(count_users(connection))
    connection.close()


if __name__ == "__main__":
    main()
