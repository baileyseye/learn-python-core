"""JSON и CSV: обмен данными с другими программами."""

import csv
import io
import json


def demonstrate_json() -> None:
    user = {"name": "Анна", "roles": ["admin", "author"], "active": True}
    text = json.dumps(user, ensure_ascii=False, indent=2)
    print(text)
    restored = json.loads(text)
    print("roles:", restored["roles"])


def demonstrate_csv() -> None:
    rows = [
        {"name": "Анна", "score": "92"},
        {"name": "Борис", "score": "75"},
    ]
    buffer = io.StringIO()
    writer = csv.DictWriter(buffer, fieldnames=["name", "score"])
    writer.writeheader()
    writer.writerows(rows)
    print(buffer.getvalue().strip())

    reader = csv.DictReader(io.StringIO(buffer.getvalue()))
    total = sum(int(row["score"]) for row in reader)
    print("сумма баллов:", total)


def to_json_line(**fields: object) -> str:
    """JSON Lines: одна строка — один объект."""
    return json.dumps(fields, ensure_ascii=False)


def main() -> None:
    demonstrate_json()
    demonstrate_csv()
    print(to_json_line(event="login", user="anna", ok=True))


if __name__ == "__main__":
    main()
