"""collections: Counter, defaultdict и deque."""

from collections import Counter, defaultdict, deque


def demonstrate_counter() -> None:
    words = "кот пёс кот сова кот пёс".split()
    counter = Counter(words)
    print(counter)
    print("топ-2:", counter.most_common(2))
    print("кот:", counter["кот"], "зебра:", counter["зебра"])


def group_by_first_letter(words: list[str]) -> dict[str, list[str]]:
    groups: dict[str, list[str]] = defaultdict(list)
    for word in words:
        groups[word[0]].append(word)
    return dict(groups)


def demonstrate_deque() -> None:
    queue = deque(["Анна", "Борис"])
    queue.append("Вера")
    queue.appendleft("Глеб")
    print("очередь:", queue)
    print("слева:", queue.popleft(), "справа:", queue.pop())


def sliding_window(numbers: list[int], size: int) -> list[int]:
    """deque с maxlen — готовое скользящее окно."""
    window: deque[int] = deque(maxlen=size)
    sums: list[int] = []
    for number in numbers:
        window.append(number)
        if len(window) == size:
            sums.append(sum(window))
    return sums


def main() -> None:
    demonstrate_counter()
    print(group_by_first_letter(["анна", "борис", "алла", "вера"]))
    demonstrate_deque()
    print("окна:", sliding_window([1, 2, 3, 4, 5], 3))


if __name__ == "__main__":
    main()
