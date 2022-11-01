from dataclasses import dataclass


@dataclass
class InputProfile:
    name: str
    setting_fields: list[str]


class SelectedInputProfile:
    input_profile: InputProfile
    selected_values: dict[str, float]

    def __init__(self, input_profile: InputProfile, selected_values: dict[str, float]):
        self.input_profile = input_profile

        if not all(
            [field in input_profile.setting_fields for field in selected_values]
        ):
            raise ValueError("Invalid fields in selectedValues")
        self.selected_values = selected_values


class DefaultInputProfiles:
    DEFAULT_INPUT_PROFILE_DICT = [
        InputProfile("Square", ["Diagonal", "Corner Radius"]),
        InputProfile("Round", ["Radius"]),
        InputProfile("Box", ["Diagonal", "Radius"]),
    ]

    def get_input_profiles(self) -> list[InputProfile]:
        return self.DEFAULT_INPUT_PROFILE_DICT

    def get_input_profile(self, name: str) -> InputProfile:
        for option in self.DEFAULT_INPUT_PROFILE_DICT:
            if option.name == name:
                return option
        raise ValueError("Invalid input profile name")

    def get_input_profile_names(self):
        return [option.name for option in self.DEFAULT_INPUT_PROFILE_DICT]


DEFAULT_INPUT_PROFILES = DefaultInputProfiles()


def get_test_input_profile() -> SelectedInputProfile:
    return SelectedInputProfile(
        DEFAULT_INPUT_PROFILES.get_input_profile("Square"),
        {"Diagonal": 10, "Corner Radius": 1},
    )
