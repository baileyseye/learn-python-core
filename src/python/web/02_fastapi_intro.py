"""FastAPI: первый взгляд.

Если fastapi и uvicorn установлены, функция create_app собирает настоящее
приложение. Если нет — пример всё равно запускается и показывает, как
выглядит код. Установка:

    pip install fastapi uvicorn
    uvicorn src.python.web.02_fastapi_intro:create_app --factory --reload
"""


def create_app():
    from fastapi import FastAPI, HTTPException
    from pydantic import BaseModel

    class Item(BaseModel):
        title: str
        price: int

    app = FastAPI(title="Learn Python API")
    items: dict[int, Item] = {}

    @app.get("/health")
    def health() -> dict[str, str]:
        return {"status": "ok"}

    @app.get("/items")
    def list_items() -> list[Item]:
        return list(items.values())

    @app.post("/items", status_code=201)
    def create_item(item: Item) -> Item:
        item_id = len(items) + 1
        items[item_id] = item
        return item

    @app.get("/items/{item_id}")
    def get_item(item_id: int) -> Item:
        if item_id not in items:
            raise HTTPException(status_code=404, detail="item not found")
        return items[item_id]

    return app


def dependency_status() -> tuple[bool, bool]:
    try:
        import fastapi  # noqa: F401
    except ImportError:
        fastapi_installed = False
    else:
        fastapi_installed = True

    try:
        import pydantic  # noqa: F401
    except ImportError:
        pydantic_installed = False
    else:
        pydantic_installed = True

    return fastapi_installed, pydantic_installed


def main() -> None:
    fastapi_installed, pydantic_installed = dependency_status()
    print("FastAPI установлен:", fastapi_installed)
    print("Pydantic установлен:", pydantic_installed)

    if fastapi_installed and pydantic_installed:
        app = create_app()
        print("маршруты:", [route.path for route in app.routes if hasattr(route, "path")])
    else:
        print("Код приложения готов, но зависимости не установлены.")
        print("Выполните: pip install fastapi uvicorn")
        print("Маршруты: GET /health, GET /items, POST /items, GET /items/{id}")


if __name__ == "__main__":
    main()
