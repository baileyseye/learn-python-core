"""Алгоритмы на пальцах: сложность, поиск и обход графа.

Запомнить главное:
- O(1) — не зависит от размера данных;
- O(n) — смотрим каждый элемент;
- O(log n) — каждый шаг отбрасывает половину вариантов.
"""

from collections import deque


def linear_search(items: list[int], target: int) -> int:
    """O(n): в худшем случае проверяем все элементы."""
    for index, item in enumerate(items):
        if item == target:
            return index
    return -1


def binary_search(items: list[int], target: int) -> int:
    """O(log n), но список должен быть отсортирован."""
    left, right = 0, len(items) - 1
    while left <= right:
        middle = (left + right) // 2
        if items[middle] == target:
            return middle
        if items[middle] < target:
            left = middle + 1
        else:
            right = middle - 1
    return -1


def bfs_order(graph: dict[str, list[str]], start: str) -> list[str]:
    """Обход в ширину: сначала соседи, потом соседи соседей."""
    queue = deque([start])
    seen = {start}
    order: list[str] = []

    while queue:
        node = queue.popleft()
        order.append(node)
        for neighbor in graph.get(node, []):
            if neighbor not in seen:
                seen.add(neighbor)
                queue.append(neighbor)
    return order


def main() -> None:
    numbers = [1, 3, 5, 8, 13, 21]
    print("линейный поиск 13:", linear_search(numbers, 13))
    print("бинарный поиск 13:", binary_search(numbers, 13))
    graph = {"A": ["B", "C"], "B": ["D"], "C": ["D"], "D": []}
    print("BFS от A:", bfs_order(graph, "A"))
    print("список: поиск O(n), словарь: доступ по ключу в среднем O(1).")
    print("для очереди берут deque: popleft выполняется быстро.")


if __name__ == "__main__":
    main()
