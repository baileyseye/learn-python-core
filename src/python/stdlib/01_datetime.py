"""Дата и время: datetime, timedelta и часовые пояса."""

from datetime import date, datetime, timedelta, timezone


def demonstrate_dates() -> None:
    today = date(2026, 11, 25)
    new_year = date(2027, 1, 1)
    delta = new_year - today
    print("до Нового года:", delta.days, "дней")

    tomorrow = today + timedelta(days=1)
    print("завтра:", tomorrow)


def demonstrate_formatting() -> None:
    moment = datetime(2026, 11, 25, 14, 30, 5)
    print(moment.strftime("%d.%m.%Y %H:%M"))
    print(moment.isoformat())

    parsed = datetime.strptime("25.11.2026 14:30", "%d.%m.%Y %H:%M")
    print("разобрали:", parsed.year, parsed.month, parsed.day)


def demonstrate_timezones() -> None:
    utc = datetime(2026, 11, 25, 12, 0, tzinfo=timezone.utc)
    moscow = utc.astimezone(timezone(timedelta(hours=3)))
    print("UTC:", utc.isoformat())
    print("Москва:", moscow.isoformat())


def working_days(start: date, end: date) -> int:
    """Считает будние дни в диапазоне [start, end)."""
    days = 0
    current = start
    while current < end:
        if current.weekday() < 5:
            days += 1
        current += timedelta(days=1)
    return days


def main() -> None:
    demonstrate_dates()
    demonstrate_formatting()
    demonstrate_timezones()
    print("будних дней:", working_days(date(2026, 11, 23), date(2026, 11, 30)))


if __name__ == "__main__":
    main()
