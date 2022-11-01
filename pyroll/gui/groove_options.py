

from dataclasses import dataclass


@dataclass(frozen=True)
class GrooveOption:
    name: str
    settingFields: list[str]


DEFAULT_GROOVE_OPTIONS = [
    # TODO: Generate this through inflection?
    GrooveOption("Round", ["r1", "r2", "depth"]),
    GrooveOption("Circular Oval", ["r1", "r2", "depth"]),
    GrooveOption("False Round", ["r1", "r2", "depth", "flank_angle"]),
    GrooveOption("Square", ["r1", "r2", "depth"]),
]

class SelectedGrooveOption:
    grooveOption: GrooveOption
    selectedValues: dict[str, float]

    def __init__(self, grooveOption: GrooveOption, selectedValues: dict[str, float]):
        self.grooveOption = grooveOption
        # Assert that all the fields are present -> TODO: Is this necessary?
        # assert all([field in selectedValues for field in grooveOption.settingFields])
        # Assert that all the fields in the selectedValues are in the grooveOption
        if not all([field in grooveOption.settingFields for field in selectedValues]):
            raise ValueError("Invalid fields in selectedValues")
        self.selectedValues = selectedValues