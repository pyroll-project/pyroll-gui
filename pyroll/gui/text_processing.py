def prettify(text: str):
    """Sets _ to space and capitalizes first letter of each word"""
    return text.replace("_", " ").title()

def unprettify(text: str):
    """Sets space to _ and lowercases first letter of each word"""
    return text.replace(" ", "_").lower()