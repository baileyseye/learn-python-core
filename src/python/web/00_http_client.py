"""HTTP-клиент: URL, статус и JSON."""

from urllib.parse import parse_qs, urlparse


def parse_url(url: str) -> dict:
    parsed = urlparse(url)
    return {
        "scheme": parsed.scheme,
        "host": parsed.hostname,
        "path": parsed.path or "/",
        "query": parse_qs(parsed.query),
    }


def is_success(status: int) -> bool:
    return 200 <= status < 300


def main() -> None:
    print(parse_url("https://example.com/api?page=2&limit=10"))
    print(is_success(200), is_success(404))


if __name__ == "__main__":
    main()
