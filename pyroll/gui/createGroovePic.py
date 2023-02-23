import logging
from typing import Optional, Union

import matplotlib.pyplot as plt
from pyroll.core import BoxGroove, DiamondGroove, RoundGroove, SquareGroove
from pyroll.core.profile import Profile
from shapely.geometry import LineString, Polygon

from pyroll.gui.groove_options import SelectedGrooveOption
from pyroll.gui.in_profiles import SelectedInputProfile
from pyroll.gui.text_processing import prettify


def createGroovePic(
    groove_option: SelectedGrooveOption, filename: str
) -> Optional[Union[str, None]]:
    """Tries to construct the groove from the given groove option. Returns the path to the created picture."""
    groove_name = groove_option.groove_option.name
    groove_name_final = prettify(groove_name).replace(" ", "") + "Groove"
    groove_class = globals()[groove_name_final]
    # try:
    fixed_dict = {k: float(v) for k, v in groove_option.selected_values.items()}
    groove = groove_class(**fixed_dict)
    print(groove)
    countour_line: LineString = groove.contour_line
    fig, ax = plt.subplots()
    ax.set_aspect("equal")
    ax.plot(countour_line.xy[0], countour_line.xy[1])
    x, y = countour_line.xy
    # Plot the countour line with matplotlib
    plt.plot(x, y)
    # Save the figure
    plt.savefig(filename)
    return filename
    # except Exception as e:
    #    logging.warn(e)
    #    return None


def createInputProfilePic(
    input_profile: SelectedInputProfile, filename: str
) -> Optional[Union[str, None]]:
    """Tries to construct the groove from the given groove option. Returns the path to the created picture."""

    # Convert the selected values dict to a dict with the correct types
    # float_input_profile_dict = {}
    # for key, value in input_profile.selected_values.items():
    #    float_input_profile_dict[key] = float(value)
    # try:
    input_constr = getattr(Profile, input_profile.input_profile.name)
    profile = input_constr(
        **{k: float(v) for k, v in input_profile.selected_values.items()}
    )
    print(profile)
    boundary: Polygon = profile.cross_section.boundary
    fig, ax = plt.subplots()
    ax.set_aspect("equal")
    ax.plot(boundary.xy[0], boundary.xy[1])
    x, y = boundary.xy
    # Plot the countour line with matplotlib
    plt.plot(x, y)
    # Save the figure
    plt.savefig(filename)
    return filename

    # except Exception as e:
    #    logging.warning(e)
    #    return None


if __name__ == "__main__":
    from pyroll.gui.groove_options import DEFAULT_GROOVE_OPTIONS

    groove_option = DEFAULT_GROOVE_OPTIONS.get_groove_option("round")
    go = SelectedGrooveOption(groove_option, {"r1": 1, "r2": 2, "depth": 3})

    createGroovePic(go, "testgroove.svg")

    from pyroll.gui.in_profiles import DEFAULT_INPUT_PROFILES

    input_profile = DEFAULT_INPUT_PROFILES.get_input_profile("square")

    ip = SelectedInputProfile(
        input_profile,
        {
            "side": 45e-3,
            "corner_radius": 3e-3,
            "temperature": 1473.15,
            "flow_stress": 100e6,
            "strain": 0,
        },
    )

    createInputProfilePic(ip, "testinputprofile.svg")
