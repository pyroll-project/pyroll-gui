from dataclasses import dataclass

from pyroll.gui.text_processing import prettify


@dataclass(frozen=True)
class GrooveOption:
    name: str
    setting_fields: list[str]


class DefaultGrooveOptions:

    DEFAULT_GROOVE_OPTION_DICT = [
        # TODO: Generate this through inflection?
        GrooveOption("round", ["r1", "r2", "depth"]),
        GrooveOption("circular_oval", ["r1", "r2", "depth"]),
        GrooveOption("false_round", ["r1", "r2", "depth", "flank_angle"]),
        GrooveOption("square", ["r1", "r2", "depth", "tip_depth"]),
    ]

    def get_groove_options(self) -> list[GrooveOption]:
        return self.DEFAULT_GROOVE_OPTION_DICT

    @staticmethod
    def get_groove_option(name: str):
        for option in DefaultGrooveOptions.DEFAULT_GROOVE_OPTION_DICT:
            if option.name == name:
                return option
        raise ValueError("Invalid groove option name")

    def get_groove_option_names(self):
        return [option.name for option in self.DEFAULT_GROOVE_OPTION_DICT]

    def get_groove_option_names_pretty(self):
        return [prettify(option.name) for option in self.DEFAULT_GROOVE_OPTION_DICT]


class SelectedGrooveOption:
    groove_option: GrooveOption
    selected_values: dict[str, float]
    """Represents the selected parameters for the groove option, saved as a dict"""

    def __init__(self, grooveOption: GrooveOption, selectedValues: dict[str, float]):
        self.groove_option = grooveOption
        # Assert that all the fields are present -> TODO: Is this necessary?
        # assert all([field in selectedValues for field in grooveOption.settingFields])
        # Assert that all the fields in the selectedValues are in the grooveOption
        if not all([field in grooveOption.setting_fields for field in selectedValues]):
            raise ValueError("Invalid fields in selectedValues")
        self.selected_values = selectedValues


DEFAULT_GROOVE_OPTIONS = DefaultGrooveOptions()
