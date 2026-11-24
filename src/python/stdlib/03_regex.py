"""Регулярные выражения: re.search, findall, sub и группы."""

import re


def demonstrate_search() -> None:
    text = "Пишите на support@example.com или sales@example.org"
    match = re.search(r"[\w.+-]+@[\w-]+\.[\w.]+", text)
    print("первый email:", match.group() if match else None)
    print("все email:", re.findall(r"[\w.+-]+@[\w-]+\.[\w.]+", text))


def demonstrate_groups() -> None:
    date = "2026-11-25"
    match = re.match(r"(\d{4})-(\d{2})-(\d{2})", date)
    if match:
        year, month, day = match.groups()
        print("год:", year, "месяц:", month, "день:", day)
        print("именованные:", re.match(r"(?P<y>\d{4})-(?P<m>\d{2})", date).groupdict())


def demonstrate_sub() -> None:
    text = "телефон: +7 (999) 123-45-67"
    digits = re.sub(r"\D", "", text)
    print("цифры:", digits)
    print("маска:", re.sub(r"(\d{1})(\d{3})(\d{3})(\d{2})(\d{2})", r"+\1 (\2) \3-\4-\5", digits))


def parse_log_line(line: str) -> dict[str, str] | None:
    pattern = re.compile(r"^(?P<level>[A-Z]+)\s+(?P<service>[\w-]+):\s+(?P<message>.+)$")
    match = pattern.match(line)
    return match.groupdict() if match else None


def main() -> None:
    demonstrate_search()
    demonstrate_groups()
    demonstrate_sub()
    print(parse_log_line("ERROR api: база недоступна"))
    print(parse_log_line("неверный формат"))


if __name__ == "__main__":
    main()
