"""SQLite: база данных в одном файле и обычный SQL."""

import sqlite3


def create_schema(connection: sqlite3.Connection) -> None:
    connection.execute(
        """
        CREATE TABLE users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL UNIQUE
        )
        """
    )
    connection.commit()


def add_user(connection: sqlite3.Connection, name: str, email: str) -> int:
    cursor = connection.execute(
        "INSERT INTO users (name, email) VALUES (?, ?)",
        (name, email),
    )
    connection.commit()
    return int(cursor.lastrowid)


def list_users(connection: sqlite3.Connection) -> list[tuple[int, str, str]]:
    cursor = connection.execute("SELECT id, name, email FROM users ORDER BY id")
    return cursor.fetchall()


def find_by_email(connection: sqlite3.Connection, email: str) -> tuple | None:
    cursor = connection.execute(
        "SELECT id, name, email FROM users WHERE email = ?",
        (email,),
    )
    return cursor.fetchone()


def main() -> None:
    connection = sqlite3.connect(":memory:")
    try:
        create_schema(connection)
        anna_id = add_user(connection, "Анна", "anna@example.com")
        add_user(connection, "Борис", "boris@example.com")
        print("id Анны:", anna_id)
        print("все пользователи:", list_users(connection))
        print("поиск:", find_by_email(connection, "boris@example.com"))

        try:
            add_user(connection, "Дубль", "anna@example.com")
        except sqlite3.IntegrityError as error:
            print("UNIQUE сработал:", error)
    finally:
        connection.close()


if __name__ == "__main__":
    main()
