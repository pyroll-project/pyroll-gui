from datetime import datetime
import logging
from pprint import pformat
import webbrowser
from pyroll.gui.constants import (
    PARAMETERS_SAVED_IN_TABLE_ROW_THAT_SHOULD_BE_PASSED_TO_ROLL,
)
from pyroll.gui.in_profiles import SelectedInputProfile
from pyroll.gui.row_data import RowData
from pyroll.gui.table_data import TableRow
from pyroll.core import (
    BoxGroove,
    DiamondGroove,
    Profile,
    Roll,
    RollPass,
    RoundGroove,
    SquareGroove,
    Transport,
    PassSequence,
)
from pyroll.core.unit import Unit
from pyroll.report.report import report


from pyroll.gui.text_processing import prettify


def solve_process(
    table_data: list[TableRow],
    selected_input_profile: SelectedInputProfile,
    table_groove_data: list[RowData],
):

    input_constr = getattr(Profile, selected_input_profile.input_profile.name)
    # Convert the selected values dict to a dict with the correct types
    float_input_profile_dict = {}
    for key, value in selected_input_profile.selected_values.items():
        float_input_profile_dict[key] = float(value)
    # input_profile = input_constr(**self.input_profile.selected_values)
    input_profile = input_constr(**float_input_profile_dict)
    unit_sequence: list[Unit] = []
    # default_transport = Transport(duration=2)
    row_groove_data: RowData
    table_row: TableRow
    for i, (row_groove_data, table_row) in enumerate(
        zip(table_groove_data, table_data)
    ):
        if table_row.transport_duration is None or table_row.transport_duration == "":
            transport = None
        else:
            transport = Transport(duration=float(table_row.transport_duration), label=f"Transport {i + 1}")
        groove_name = row_groove_data.selected_groove_option.groove_option.name
        groove_name_final = prettify(groove_name).replace(" ", "") + "Groove"
        groove_class = globals()[groove_name_final]
        label = f"{prettify(groove_name)} {i + 1}"
        groove_selected_values_float = {}
        for (
            key,
            value,
        ) in row_groove_data.selected_groove_option.selected_values.items():
            groove_selected_values_float[key] = float(value)
        # groove = groove_class(
        #    **row_groove_data.selected_groove_option.selected_values
        # )
        groove = groove_class(**groove_selected_values_float)
        rollpass_parameters = table_row.__dict__
        rollpass_parameters_float = {}
        for key, value in rollpass_parameters.items():
            if value is not None and value.strip() != "":
                rollpass_parameters_float[key] = float(value)
            if value == "transport_duration":
                pass
        roll_parameters_from_table = {}
        for key in PARAMETERS_SAVED_IN_TABLE_ROW_THAT_SHOULD_BE_PASSED_TO_ROLL:
            if key in rollpass_parameters_float:
                roll_parameters_from_table[key] = rollpass_parameters_float[key]
                # Remove the key from the rollpass_parameters dict
                del rollpass_parameters_float[key]
        rp = RollPass(
            label=label,
            **rollpass_parameters_float,
            roll=Roll(groove=groove, **roll_parameters_from_table),
        )
        unit_sequence.append(rp)
        if transport is not None:
            unit_sequence.append(transport)
    logging.debug(f"Unit sequence: {pformat(unit_sequence)}")
    # Convert the unit sequence to a proper sequence
    pass_sequence = PassSequence(unit_sequence)
    pass_sequence.solve(input_profile)
    #reporter = Reporter()
    html = report(pass_sequence)
    # File name should be report.html + timestamp
    file_name = f"report_{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.html"
    # Print the html to disk
    with open(file_name, "w", encoding="utf-8") as f:
        f.write(html)
    # Open the report in the default browser
    webbrowser.open(file_name)
