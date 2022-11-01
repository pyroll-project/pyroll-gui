from dataclasses import dataclass

from pyroll.gui.grooveOptions import SelectedGrooveOption

@dataclass
class RowData:
    """Dataclass for storing data connected to the row of the table"""
    rowId: int
    selected_groove_option: SelectedGrooveOption


#selected_groove_options: dict[int, SelectedGrooveOption] = {
#    0: SelectedGrooveOption(GROOVE_OPTIONS[0], ["10", "20", "14"]),
#    1: SelectedGrooveOption(GROOVE_OPTIONS[1], ["10", "44"]),
#}


def get_test_rowdata_list():
    list = [RowData(0, SelectedGrooveOption("Round", {"r1": 10, "r2": 20, "depth": 14})),
            RowData(1, SelectedGrooveOption("False Round", {"r1": 10, "r2": 44}))]

#class RowDataManager:
#    row_data_list: list[RowData]
#
#    def __init__(self):
#        self.row_data_list = []
#    
#    def add_row(self, row_data: RowData):
#        self.row_data_list.append(row_data)
#
#    def get_row_data(self, row_id: int) -> RowData:
