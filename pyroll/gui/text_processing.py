def prettify(text: str) -> str:
    """Sets _ to space and capitalizes first letter of each word"""
    return " ".join([word.title() for word in text.split(" ")]).replace("_", " ")


def unprettify(text: str):
    """Sets space to _ and lowercases first letter of each word"""
    return text.replace(" ", "_").lower()
