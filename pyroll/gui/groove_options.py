from dataclasses import dataclass


@dataclass(frozen=True)
class GrooveOption:
    name: str
    setting_fields: list[str]


class DefaultGrooveOptions:

    DEFAULT_GROOVE_OPTION_DICT = [
        # TODO: Generate this through inflection?
        GrooveOption("Round", ["r1", "r2", "depth"]),
        GrooveOption("Circular Oval", ["r1", "r2", "depth"]),
        GrooveOption("False Round", ["r1", "r2", "depth", "flank_angle"]),
        GrooveOption("Square", ["r1", "r2", "depth"]),
    ]

    #def __init__(self):
    #    self._groove_options = self.DEFAULT_GROOVE_OPTION_DICT

    def get_groove_options(self) -> list[GrooveOption]:
        return self.DEFAULT_GROOVE_OPTION_DICT

    def get_groove_option(self, name: str):
        for option in self.DEFAULT_GROOVE_OPTION_DICT:
            if option.name == name:
                return option

    def get_groove_option_names(self):
        return [option.name for option in self.DEFAULT_GROOVE_OPTION_DICT]


class SelectedGrooveOption:
    grooveOption: GrooveOption
    selectedValues: dict[str, float]

    def __init__(self, grooveOption: GrooveOption, selectedValues: dict[str, float]):
        self.grooveOption = grooveOption
        # Assert that all the fields are present -> TODO: Is this necessary?
        # assert all([field in selectedValues for field in grooveOption.settingFields])
        # Assert that all the fields in the selectedValues are in the grooveOption
        if not all([field in grooveOption.setting_fields for field in selectedValues]):
            raise ValueError("Invalid fields in selectedValues")
        self.selectedValues = selectedValues


DEFAULT_GROOVE_OPTIONS = DefaultGrooveOptions()
