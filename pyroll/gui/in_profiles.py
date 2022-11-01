from dataclasses import dataclass


@dataclass
class InputProfile:
    name: str
    settings_fields: list[str]


class SelectedInputProfile:
    input_profile: InputProfile
    selected_values: dict[str, float]

    def __init__(self, input_profile: InputProfile, selected_values: dict[str, float]):
        self.input_profile = input_profile

        if not all(
            [field in input_profile.settings_fields for field in selected_values]
        ):
            raise ValueError("Invalid fields in selectedValues")
        self.selected_values = selected_values


class DefaultInputProfiles:
    DEFAULT_INPUT_PROFILE_DICT = [
        InputProfile("Square", ["Diagonal", "Corner Radius"]),
        InputProfile("Round", ["Radius"]),
    ]

    def get_input_profiles(self) -> list[InputProfile]:
        return self.DEFAULT_INPUT_PROFILE_DICT

    def get_input_profile(self, name: str):
        for option in self.DEFAULT_INPUT_PROFILE_DICT:
            if option.name == name:
                return option

    def get_input_profile_names(self):
        return [option.name for option in self.DEFAULT_INPUT_PROFILE_DICT]
