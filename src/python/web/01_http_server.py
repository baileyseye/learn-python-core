"""HTTP без фреймворка: маршрутизация и устройство сервера.

Сервер здесь не запускается, чтобы пример завершался сам. Но функции
показывают, что внутри FastAPI и Flask происходит примерно то же самое:
приходит метод и путь, находится обработчик, возвращается ответ.
"""

from http.server import BaseHTTPRequestHandler

ROUTES = {
    ("GET", "/"): "главная страница",
    ("GET", "/health"): "ok",
    ("GET", "/users"): "список пользователей",
    ("POST", "/users"): "пользователь создан",
    ("GET", "/users/42"): "пользователь 42",
}


def match_route(method: str, path: str) -> str:
    """Точное совпадение, затем простой шаблон /users/{id}."""
    key = (method.upper(), path)
    if key in ROUTES:
        return ROUTES[key]

    parts = path.strip("/").split("/")
    if len(parts) == 2 and parts[0] == "users" and parts[1].isdigit():
        return f"пользователь {parts[1]}"

    return "404 Not Found"


def make_handler():
    """Фабрика обработчика для http.server."""

    class Handler(BaseHTTPRequestHandler):
        def do_GET(self):
            body = match_route("GET", self.path).encode("utf-8")
            self.send_response(200 if "404" not in body.decode() else 404)
            self.send_header("Content-Type", "text/plain; charset=utf-8")
            self.end_headers()
            self.wfile.write(body)

        def log_message(self, format, *args):
            return

    return Handler


def main() -> None:
    requests = [
        ("GET", "/"),
        ("GET", "/health"),
        ("POST", "/users"),
        ("GET", "/users/7"),
        ("GET", "/missing"),
    ]
    for method, path in requests:
        print(f"{method:5} {path:12} → {match_route(method, path)}")

    print("обработчик:", make_handler().__name__)
    print("базовый класс:", BaseHTTPRequestHandler.__name__)


if __name__ == "__main__":
    main()
