from dataclasses import dataclass

from pyroll.gui.text_processing import prettify

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
        InputProfile("square", ["side", "corner_radius", "temperature", "flow_stress", "strain"]),
        InputProfile("round", ["radius"]),
        InputProfile("box", ["diagonal", "radius"]),
    ]

    def get_input_profiles(self) -> list[InputProfile]:
        return self.DEFAULT_INPUT_PROFILE_DICT

    @staticmethod
    def get_input_profile( name: str) -> InputProfile:
        for option in DefaultInputProfiles.DEFAULT_INPUT_PROFILE_DICT:
            if option.name == name:
                return option
        raise ValueError("Invalid input profile name")

    def get_input_profile_names(self):
        return [option.name for option in self.DEFAULT_INPUT_PROFILE_DICT]
    def get_input_profile_names_pretty(self):
        return [prettify(option.name) for option in self.DEFAULT_INPUT_PROFILE_DICT]

DEFAULT_INPUT_PROFILES = DefaultInputProfiles()


#in_profile = Profile.square(
#    side=45e-3, corner_radius=3e-3,
#    temperature=1200 + 273.15, flow_stress=100e6, strain=0,
#)

def get_test_input_profile() -> SelectedInputProfile:
    return SelectedInputProfile(
        DEFAULT_INPUT_PROFILES.get_input_profile("square"),
        {"side": 45e-3, "corner_radius": 3e-3, "temperature": 1200 + 273.15, "flow_stress": 100e6, "strain": 0},
    )
