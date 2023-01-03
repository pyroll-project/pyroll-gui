from dataclasses import dataclass

from pyroll.gui.text_processing import prettify


@dataclass
class TableRow:
    """Dataclass that contains the data for a row in the table"""

    gap: float | None = None
    roll_radius: float | None = None
    in_rotation: float | None = None
    velocity: float | None = None
    roll_temperature: float | None = None
    transport_duration: float | None = None
    atmosphere_temperature: float | None = None
    roll_rotation_frequency: float | None = None
    nominal_radius: float | None = None

    @staticmethod
    def get_column_data_names():
        """Returns the names of the columns in the class"""
        return [name for name in TableRow.__dataclass_fields__]

    def set_column_by_index(self, index, value):
        """Sets the value of a column by index"""
        column_name = TableRow.get_column_data_names()[index]
        setattr(self, column_name, value)

    @staticmethod
    def get_column_data_names_pretty():
        """Returns the names of the columns (prettier version) in the class"""
        return [prettify(name) for name in TableRow.__dataclass_fields__]
