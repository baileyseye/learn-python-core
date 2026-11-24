"""Структура проекта: пакеты, модули и точка входа.

Ниже — схема, к которой стоит стремиться, когда скриптов становится больше
одного. Начинать можно с одного файла, но не стоит держать весь проект
в main.py на 800 строк.
"""

from pathlib import Path

LAYOUT = """project/
├── pyproject.toml
├── README.md
├── .env.example
├── src/
│   └── app/
│       ├── __init__.py
│       ├── main.py
│       ├── config.py
│       ├── models.py
│       └── services/
│           ├── __init__.py
│           └── users.py
└── tests/
    ├── conftest.py
    └── test_users.py"""


def describe_module(path: str) -> dict[str, str]:
    """Разбирает dotted path модуля."""
    parts = path.split(".")
    return {
        "package": ".".join(parts[:-1]),
        "module": parts[-1],
        "file": str(Path(*parts).with_suffix(".py")),
    }


def main() -> None:
    print(LAYOUT)
    print()
    print(describe_module("app.services.users"))
    print("package:", __package__ or "запущен как скрипт")
    print("file:", Path(__file__).name)
    print("родительская папка:", Path(__file__).parent.name)


if __name__ == "__main__":
    main()
