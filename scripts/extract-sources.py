"""Извлекает структуру Python-файлов для сайта курса.

Запускается из scripts/sync-course-data.mjs. На вход получает корень
src/python, на выход печатает JSON: для каждого файла — код, количество
строк, функции, классы и методы классов.
"""

from __future__ import annotations

import ast
import json
import sys
from pathlib import Path


def span(node: ast.AST) -> tuple[int, int]:
    decorators = getattr(node, "decorator_list", [])
    start = min([node.lineno] + [item.lineno for item in decorators])
    return start, node.end_lineno or node.lineno


def signature(source_lines: list[str], node: ast.AST) -> str:
    line = source_lines[node.lineno - 1].strip()
    return line


def describe_function(source_lines: list[str], node, name: str, kind: str) -> dict:
    start, end = span(node)
    return {
        "name": name,
        "kind": kind,
        "start": start,
        "end": end,
        "signature": signature(source_lines, node),
    }


def parse_file(path: Path, root: Path) -> tuple[str, dict]:
    raw = path.read_text(encoding="utf-8").replace("\r\n", "\n")
    lines = raw.split("\n")
    tree = ast.parse(raw)

    methods: list[dict] = []
    classes: list[dict] = []

    for node in tree.body:
        if isinstance(node, (ast.FunctionDef, ast.AsyncFunctionDef)):
            methods.append(describe_function(lines, node, node.name, "function"))
        elif isinstance(node, ast.ClassDef):
            start, end = span(node)
            classes.append(
                {
                    "name": node.name,
                    "kind": "class",
                    "start": start,
                    "end": end,
                    "signature": signature(lines, node),
                }
            )
            methods.append(describe_function(lines, node, node.name, "class"))
            for child in node.body:
                if isinstance(child, (ast.FunctionDef, ast.AsyncFunctionDef)):
                    methods.append(
                        describe_function(lines, child, f"{node.name}.{child.name}", "method")
                    )

    rel = path.relative_to(root).as_posix()
    return rel, {
        "path": rel,
        "lines": len(lines),
        "code": raw.rstrip(),
        "methods": methods,
        "classes": classes,
        "functions": [item for item in methods if item["kind"] == "function"],
        "has_main": any(item["name"] == "main" for item in methods),
    }


def main() -> None:
    if len(sys.argv) != 2:
        raise SystemExit("usage: extract-sources.py <src/python>")

    root = Path(sys.argv[1]).resolve()
    files = {}
    for path in sorted(root.rglob("*.py")):
        if "__pycache__" in path.parts:
            continue
        rel, data = parse_file(path, root)
        files[rel] = data

    json.dump(files, sys.stdout, ensure_ascii=False)
    sys.stdout.write("\n")


if __name__ == "__main__":
    main()
