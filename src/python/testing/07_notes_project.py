"""Мини-проект: заметки в JSON."""

import json


def add_note(notes: list, title: str, text: str) -> list:
    if not title.strip():
        raise ValueError("заголовок не может быть пустым")
    notes.append({"title": title.strip(), "text": text.strip()})
    return notes


def find_notes(notes: list, query: str) -> list:
    query = query.lower()
    return [
        note
        for note in notes
        if query in note["title"].lower() or query in note["text"].lower()
    ]


def to_json(notes: list) -> str:
    return json.dumps(notes, ensure_ascii=False)


def from_json(text: str) -> list:
    return json.loads(text)


def main() -> None:
    notes = []
    add_note(notes, "Python", "Читать код каждый день")
    add_note(notes, "План", "Сделать мини-проект")
    print(find_notes(notes, "python"))
    print(to_json(notes))


if __name__ == "__main__":
    main()
