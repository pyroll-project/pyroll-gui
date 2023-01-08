from dataclasses import dataclass

from pyroll.gui.groove_options import DEFAULT_GROOVE_OPTIONS, SelectedGrooveOption


@dataclass
class RowData:
    """Dataclass for storing data associated with a row of the table (But not the table itself). Currently it stores the row id and the selected groove options"""

    #rowId: int
    selected_groove_option: SelectedGrooveOption


def get_test_rowdata_list() -> list[RowData]:
    list = [
        RowData(
            #0,
            SelectedGrooveOption(
                DEFAULT_GROOVE_OPTIONS.get_groove_options()[0],
                {"r1": 10, "r2": 20, "depth": 14},
            ),
        ),
        RowData(
            #1,
            SelectedGrooveOption(
                DEFAULT_GROOVE_OPTIONS.get_groove_options()[1],
                {"r1": 8, "r2": 44, "depth": 9},
            ),
        ),
    ]
    return list
