"""Словари: ключи, значения и get."""


def make_profile(name: str, age: int) -> dict:
    return {"name": name, "age": age}


def get_age(profile: dict, default: int = 0) -> int:
    return profile.get("age", default)


def main() -> None:
    profile = make_profile("Анна", 27)
    print(profile)
    print(get_age(profile))
    print(get_age({}, 18))


if __name__ == "__main__":
    main()
