from typing import Optional, Union
from pyroll.gui.groove_options import SelectedGrooveOption
from pyroll.gui.text_processing import prettify
from pyroll.core import (
    DiamondGroove,
    SquareGroove,
    RoundGroove,
    BoxGroove,
)



def createGroovePic(groove_option: SelectedGrooveOption) -> Optional[Union[str, None]]:
    """Tries to construct the groove from the given groove option. Returns the path to the created picture."""

    groove_name = groove_option.groove_option.name
    groove_name_final = prettify(groove_name).replace(" ", "") + "Groove"
    groove_class = globals()[groove_name_final]
    try:
        groove = groove_class(**groove_option.selected_values)
    except Exception as e:
        print(e)
        return None
    
    raise NotImplementedError("TODO: Create groove picture")
    