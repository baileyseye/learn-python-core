"""Окружение Python: версия, интерпретатор и виртуальное окружение."""

import os
import sys
from pathlib import Path


def describe_interpreter() -> None:
    print("версия:", sys.version.split()[0])
    print("реализация:", sys.implementation.name)
    major, minor, micro = sys.version_info[:3]
    print("version_info:", major, minor, micro)


def describe_environment() -> None:
    in_venv = sys.prefix != getattr(sys, "base_prefix", sys.prefix)
    print("в виртуальном окружении:", in_venv)
    print("PYTHONPATH задан:", "PYTHONPATH" in os.environ)
    print("текущая папка:", Path.cwd().name)


def check_version(minimum: tuple[int, int] = (3, 11)) -> bool:
    """Курс рассчитан на Python 3.11+."""
    return sys.version_info[:2] >= minimum


def main() -> None:
    describe_interpreter()
    describe_environment()
    if not check_version():
        print("Обновите Python: нужен 3.11 или новее")
    else:
        print("версия подходит для курса")


if __name__ == "__main__":
    main()
