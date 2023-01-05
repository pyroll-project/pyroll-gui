from copy import deepcopy
import dataclasses
from datetime import datetime
import sys
from typing import Optional, Union
import webbrowser
from PySide6.QtWidgets import (
    QApplication,
    QMainWindow,
    QHeaderView,
    QTableWidgetItem,
    QLabel,
    QComboBox,
    QFormLayout,
    QLineEdit,
    QTableWidget,
    QGridLayout,
    QFileDialog,
)
from PySide6 import QtGui
from PySide6.QtCore import QFile, QSize, Slot
from pyroll.gui.constants import (
    PARAMETERS_SAVED_IN_TABLE_ROW_THAT_SHOULD_BE_PASSED_TO_ROLL,
)
from pyroll.gui.groove_options import (
    DEFAULT_GROOVE_OPTIONS,
    DefaultGrooveOptions,
    SelectedGrooveOption,
)
from pyroll.gui.helpers import resource_path
from pyroll.gui.in_profiles import (
    DEFAULT_INPUT_PROFILES,
    DefaultInputProfiles,
    InputProfile,
    SelectedInputProfile,
    get_test_input_profile,
)
from pyroll.gui.row_data import RowData, get_test_rowdata_list
from pyroll.gui.table_data import TableRow
from pyroll.gui.text_processing import prettify, unprettify
from pyroll.gui.ui_mainwindow import Ui_MainWindow
from pyroll.core import (
    Profile,
    RollPass,
    Transport,
    Roll,
    DiamondGroove,
    SquareGroove,
    RoundGroove,
    BoxGroove,
    solve,
)
from pyroll.core.unit import Unit
from pyroll.ui.reporter import Reporter

import logging
from pprint import pformat


from pyroll.gui.xml_processing import XmlProcessing


def clearLayout(layout):
    if layout is not None:
        while layout.count():
            child = layout.takeAt(0)
            if child.widget() is not None:
                child.widget().deleteLater()
            elif child.layout() is not None:
                clearLayout(child.layout())


class MainWindow(QMainWindow):
    def __init__(self):
        super(MainWindow, self).__init__()
        self.ui = Ui_MainWindow()
        self.ui.setupUi(self)
        self.setWindowIcon(QtGui.QIcon(resource_path("img/pyroll_icon.png")))
        self.setWindowTitle("PyRoll")

        self.setupRollpassTable()

        self.newProject()

        self.ui.grooveOptions: QFormLayout

        self.ui.inputProfileBox.currentIndexChanged.connect(
            self.selectedInputProfileBoxWasChanged
        )

        # Connect the signal of self.ui.grooveOptions to the slot createGrooveOptions
        self.ui.grooveOptionsBox.currentIndexChanged.connect(
            self.grooveOptionBoxChanged
        )
        self.ui.grooveOptionsBox.currentIndexChanged.connect(self.createGrooveOptions)

        # Connect the signal of the solve button to the slot solve
        self.ui.solveButton.clicked.connect(self.solveProcess)

        # This represents the grooveOptionsGrids, one per row in the table
        # TODO: What does this here?
        self.ui.grooveOptionsGrid = QGridLayout()

        self.createMenuBar()

        # Add keyboard shortcuts
        # Add shortcut to add a row
        self.addRowShortcut = QtGui.QShortcut(QtGui.QKeySequence("Ctrl+Shift+A"), self)
        self.addRowShortcut.activated.connect(self.addNewTableRow)

        # Duplicate row shortcut
        self.duplicateRowShortcut = QtGui.QShortcut(
            QtGui.QKeySequence("Ctrl+Shift+D"), self
        )
        self.duplicateRowShortcut.activated.connect(self.duplicateTableRow)

        self.deleteRowShortcut = QtGui.QShortcut(
            QtGui.QKeySequence("Ctrl+Shift+Delete"), self
        )
        self.deleteRowShortcut.activated.connect(self.deleteTableRow)

    def loadTestData(self):
        self.table_groove_data = get_test_rowdata_list()
        self.input_profile = get_test_input_profile()

    def setupRollpassTable(self):
        self.ui.rollPassTable.setColumnCount(
            TableRow().get_column_data_names().__len__()
        )

        self.ui.rollPassTable.setHorizontalHeaderLabels(
            TableRow().get_column_data_names_pretty()
        )

        self.ui.rollPassTable.horizontalHeader().setSectionResizeMode(
            QHeaderView.Stretch
        )
        # Only let one row be selected at a time
        self.ui.rollPassTable.setSelectionMode(QTableWidget.SingleSelection)

        self.ui.rollPassTable.selectionModel().selectionChanged.connect(
            self.selectedRowChanged
        )

        self.ui.rollPassTable.selectionModel().selectionChanged.connect(
            self.createGrooveOptions
        )

        self.currentRow = 0

    def createMenuBar(self):
        menuBar = self.menuBar()
        # File menu
        fileMenu = menuBar.addMenu("File")
        # File -> New Project
        newProjectAction = fileMenu.addAction("New Project")
        newProjectAction.triggered.connect(self.newProject)
        # Export to XML
        exportToXMLAction = fileMenu.addAction("Export to XML...")
        exportToXMLAction.triggered.connect(self.exportToXML)
        # Load from XML
        loadFromXMLAction = fileMenu.addAction("Load from XML...")
        loadFromXMLAction.triggered.connect(self.loadFromXML)

    def newProject(self):

        # Clear the table data
        self.table_data = []
        # Clear the groove data
        self.table_groove_data = []
        self.input_profile = SelectedInputProfile(
            DEFAULT_INPUT_PROFILES.DEFAULT_INPUT_PROFILE_DICT[0], {}
        )
        self.addNewTableRow()
        # Populate table
        self.fillTableFromTableData()

        # Check if the GUIs are already created. If not, create them.
        if not hasattr(self.ui, "inputProfileBox"):
            self.createInputProfileGUI()
        if not hasattr(self.ui, "grooveOptionsBox"):
            self.createGrooveOptionsGUI()

        # Populate groove and input profile options
        self.createGrooveOptions()
        self.createInputProfileOptions()

    def fillTableFromTableData(self):
        # Clear the table
        self.ui.rollPassTable.setRowCount(0)

        # For the list[TableRow] in self.table_data, fill the table with the data
        for i, table_row in enumerate(self.table_data):
            self.ui.rollPassTable.insertRow(i)
            for j, (param, value) in enumerate(table_row.__dict__.items()):
                self.ui.rollPassTable.setItem(i, j, QTableWidgetItem(value))

    def addNewTableRow(self):
        self.persistTableData()
        self.table_data.append(TableRow())
        self.table_groove_data.append(
            RowData(
                SelectedGrooveOption(
                    DEFAULT_GROOVE_OPTIONS.DEFAULT_GROOVE_OPTION_DICT[0], {}
                )
            )
        )
        self.fillTableFromTableData()

    def deleteTableRow(self):
        logging.info("Deleting row")
        selected_row = self.ui.rollPassTable.currentRow()
        logging.debug(f"Selected row: {selected_row}")
        self.table_data.pop(selected_row)
        self.table_groove_data.pop(selected_row)
        # This apparently causes an error:
        # self.selectedRowChanged()
        self.fillTableFromTableData()

    def duplicateTableRow(self):
        # Get the currently selected row
        selected_row = self.ui.rollPassTable.currentRow()
        # Get the data from the selected row
        selected_row_data = self.table_data[selected_row]
        # Create a new TableRow with the data from the selected row
        new_row = dataclasses.replace(selected_row_data)
        # Add the new row to the table
        self.table_data.append(new_row)

        new_groove_data = deepcopy(self.table_groove_data[selected_row])

        self.table_groove_data.append(new_groove_data)

        self.fillTableFromTableData()

    def exportToXML(self):
        logging.info("Export to XML clicked")
        # Create file selection dialog
        file_dialog = QFileDialog()
        # Select only XML files
        file_dialog.setNameFilter("XML files (*.xml)")

        file_dialog.setFileMode(QFileDialog.AnyFile)

        file_dialog.exec()
        file_name = file_dialog.selectedFiles()[0]
        # If file name does not end with .xml, add it
        if not file_name.lower().endswith(".xml"):
            file_name += ".xml"

        self.persistInputProfile()
        self.persistTableData()
        self.persistGrooveOptions()

        xml_processing = XmlProcessing()
        xml_processing.save_pyroll_xml(
            self.table_groove_data, self.table_data, self.input_profile, file_name
        )

    def loadFromXML(self):
        logging.info("Load from XML clicked")
        # Create file selection dialog
        file_dialog = QFileDialog()
        # Select only XML files
        file_dialog.setNameFilter("XML files (*.xml)")

        file_dialog.setFileMode(QFileDialog.AnyFile)

        file_dialog.exec()
        file_name = file_dialog.selectedFiles()[0]

        xml_processing = XmlProcessing()
        (
            self.table_groove_data,
            self.table_data,
            self.input_profile,
        ) = xml_processing.load_pyroll_xml(file_name)

        self.fillTableFromTableData()
        # self.createGrooveOptionsGUI()
        # I don't know why I added this, it might be needed/
        self.createGrooveOptions()
        self.createInputProfileOptions()

    def addTestRow(self):
        # Create a corresponding TableRow object
        table_row = TableRow()
        table_row.gap = "1"
        table_row.roll_radius = "180"
        table_row.in_rotation = "1"
        table_row.velocity = "1"
        table_row.roll_temperature = "20"
        table_row.transport_duration = "1"
        table_row.atmosphere_temperature = "20"
        # Add the TableRow object to the list
        self.table_data.append(table_row)
        table_row2 = TableRow()
        table_row2.gap = "2"
        table_row2.roll_radius = "180"
        table_row2.in_rotation = "1"
        table_row2.velocity = "1"
        table_row2.roll_temperature = "30"
        table_row2.transport_duration = "1"

        self.table_data.append(table_row2)

        self.fillTableFromTableData()

    def persistGrooveOptions(self) -> None:
        self.table_groove_data[
            self.currentRow
        ].selected_groove_option.groove_option = DefaultGrooveOptions.get_groove_option(
            unprettify(self.ui.grooveOptionsBox.currentText())
        )
        for i in range(0, self.ui.grooveOptions.count(), 2):
            parameter_name = self.ui.grooveOptions.itemAt(i)
            parameter_value = self.ui.grooveOptions.itemAt(i + 1)
            if parameter_name is not None and parameter_value is not None:
                self.table_groove_data[
                    self.currentRow
                ].selected_groove_option.selected_values[
                    unprettify(parameter_name.widget().text())
                ] = parameter_value.widget().text()

    def persistInputProfile(self) -> None:
        self.input_profile.input_profile = DefaultInputProfiles.get_input_profile(
            unprettify(self.ui.inputProfileBox.currentText())
        )
        for i in range(0, self.ui.inputItemOptions.count(), 2):
            parameter_name = self.ui.inputItemOptions.itemAt(i)
            parameter_value = self.ui.inputItemOptions.itemAt(i + 1)
            if parameter_name is not None and parameter_value is not None:
                self.input_profile.selected_values[
                    unprettify(parameter_name.widget().text())
                ] = parameter_value.widget().text()

    def persistTableData(self) -> None:
        """Get the data from the table and return it as a list of TableRow objects"""
        table_data: list[TableRow] = []
        for row in range(self.ui.rollPassTable.rowCount()):
            current_row = TableRow()
            for column in range(self.ui.rollPassTable.columnCount()):
                if self.ui.rollPassTable.item(row, column) is not None:
                    item_value = self.ui.rollPassTable.item(row, column).text()
                    current_row.set_column_by_index(column, item_value)

            table_data.append(current_row)
        self.table_data = table_data

    @Slot()
    def selectedRowChanged(self) -> None:
        """This function persists the groove options and sets the current index"""
        # Get selectionmodel from self.ui.rollPassTable
        self.persistGrooveOptions()
        selectionModel = self.ui.rollPassTable.selectionModel()
        # Get the current selected row

        currentRow = selectionModel.currentIndex().row()
        if currentRow != -1:
            self.currentRow = currentRow
        else:
            logging.warn("Row would have been -1")
            self.currentRow = 0
        print("row changed to:", self.currentRow)
        # self.createGrooveOptionsGUI()
        # self.createGrooveOptions()

    @Slot()
    def createInputProfileGUI(self):
        """This creates the general GUI, so the labels, the combobox, and the QFormLayout for the input item options"""
        self.ui.inputProfileGrid.setRowMinimumHeight(3, 100)

        self.ui.inputProfileLabel = QLabel("Input profile")

        self.ui.inputProfileGrid.addWidget(self.ui.inputProfileLabel, 0, 0)

        self.ui.inputProfileBox = QComboBox()

        self.ui.inputProfileBox.addItems(
            DEFAULT_INPUT_PROFILES.get_input_profile_names_pretty()
        )

        self.ui.inputProfileGrid.addWidget(self.ui.inputProfileBox, 1, 0)

        self.ui.inputItemOptionsLabel = QLabel("Input item options")

        self.ui.inputProfileGrid.addWidget(self.ui.inputItemOptionsLabel, 2, 0)

        self.ui.inputItemOptions: QFormLayout = QFormLayout()

        self.ui.inputProfileGrid.addLayout(self.ui.inputItemOptions, 3, 0)

    @Slot()
    def createInputProfileOptions(self):
        """Depending on the selected combo box item, create different input profile options"""
        if self.input_profile.input_profile.name != None:
            selected_input_profile = self.input_profile
            selectedItem = prettify(self.input_profile.input_profile.name)
            # Set the input profile box to the selected input profile
            # Block signals to prevent the inputProfileBox from triggering the slot
            # self.ui.inputProfileBox.blockSignals(True)
            self.ui.inputProfileBox.setCurrentText(selectedItem)
            # self.ui.inputProfileBox.blockSignals(False)
            self.input_profile = selected_input_profile
        else:
            selectedItem = self.ui.inputProfileBox.currentText()
            selected_input_profile = None

        clearLayout(self.ui.inputItemOptions)

        inputProfile = DEFAULT_INPUT_PROFILES.get_input_profile(
            unprettify(selectedItem)
        )
        logging.debug(
            f"Input profile: {inputProfile.name} selected, {inputProfile.setting_fields} options available"
        )

        # Use the current input profile (self.input_profile) to set the values of the input profile options
        for inputProfileSetting in inputProfile.setting_fields:
            logging.debug(f"Adding {inputProfileSetting} to input profile options")
            self.ui.inputItemOptions.addRow(
                QLabel(prettify(inputProfileSetting)), QLineEdit()
            )
            if selected_input_profile != None:
                self.ui.inputItemOptions.itemAt(
                    self.ui.inputItemOptions.count() - 1
                ).widget().setText(
                    f"{selected_input_profile.selected_values.get(inputProfileSetting, '')}"
                )

    @Slot()
    def selectedInputProfileBoxWasChanged(self) -> None:
        # Set the current input profile to an empty one of the correct type
        self.input_profile = SelectedInputProfile(
            DefaultInputProfiles.get_input_profile(
                unprettify(self.ui.inputProfileBox.currentText())
            ),
            {},
        )
        logging.info(
            f"The input profile in the persistent data was set to {self.input_profile.input_profile.name}"
        )
        # This possible fix I tested does not work
        # clearLayout(self.ui.inputProfileGrid)
        # self.createInputProfileGUI()
        self.createInputProfileOptions()

    @Slot()
    def createGrooveOptionsGUI(self) -> None:

        comboBoxValue = self.table_groove_data[
            self.currentRow
        ].selected_groove_option.groove_option.name

        self.ui.grooveOptionsGrid.setRowMinimumHeight(3, 100)

        self.ui.grooveOptionsLabel = QLabel("Groove options")

        self.ui.grooveOptionsGrid.addWidget(self.ui.grooveOptionsLabel, 0, 0)

        self.ui.grooveOptionsBox = QComboBox()
        self.ui.grooveOptionsBox.addItems(
            DEFAULT_GROOVE_OPTIONS.get_groove_option_names_pretty()
        )

        # If a selectedGrooveOption is given, set the grooveOptionsBox to the selectedGrooveOption
        # Block signals to prevent the grooveOptionsBox from triggering the slot
        # self.ui.grooveOptionsBox.blockSignals(True)
        logging.debug(f"Setting grooveOptionsBox to {comboBoxValue}")
        self.ui.grooveOptionsBox.setCurrentText(prettify(comboBoxValue))
        # self.ui.grooveOptionsBox.blockSignals(False)

        self.ui.grooveOptionsGrid.addWidget(self.ui.grooveOptionsBox, 1, 0)

        self.ui.grooveOptionsLabel = QLabel("Groove options")

        self.ui.grooveOptionsGrid.addWidget(self.ui.grooveOptionsLabel, 2, 0)

        self.ui.grooveOptions = QFormLayout()

        self.ui.grooveOptionsGrid.addLayout(self.ui.grooveOptions, 3, 0)

    @Slot()
    def createGrooveOptions(self):
        """Depending on the selected combo box item, create different groove options."""

        grooveOption = self.table_groove_data[
            self.currentRow
        ].selected_groove_option.groove_option

        logging.debug(
            f"Groove option: {grooveOption.name} selected, {grooveOption.setting_fields} options available"
        )

        comboBoxValue = grooveOption.name
        logging.debug(f"Setting grooveOptionsBox to {comboBoxValue}")
        self.ui.grooveOptionsBox.setCurrentText(prettify(comboBoxValue))

        optionValueList = grooveOption.setting_fields

        # Delete all rows from self.ui.grooveOptions QFormLayout
        clearLayout(self.ui.grooveOptions)

        for i, grooveOptionValue in enumerate(optionValueList):
            # Create a new row in the grooveOptions QFormLayout
            itemAtIndex = (i + 1) * 2 - 1
            self.ui.grooveOptions.addRow(QLabel(grooveOptionValue), QLineEdit())
            if (
                grooveOptionValue
                in self.table_groove_data[
                    self.currentRow
                ].selected_groove_option.selected_values
            ):
                self.ui.grooveOptions.itemAt(itemAtIndex).widget().setText(
                    f"""{self.table_groove_data[
                        self.currentRow
                    ].selected_groove_option.selected_values.get(grooveOptionValue, '')}"""
                )

    @Slot()
    def grooveOptionBoxChanged(self) -> None:
        groove_option = unprettify(self.ui.grooveOptionsBox.currentText())

        logging.info(
            f"Following groove option selected from the groove options box: {groove_option}"
        )
        # Print current groove option
        current_gr_op = self.table_groove_data[self.currentRow].selected_groove_option
        logging.info(
            f"Current groove option in persistent data: {current_gr_op.groove_option.name}"
        )

        # This deletes the currently entered values if the groove option combobox is changed
        if current_gr_op.groove_option.name != groove_option:
            self.table_groove_data[
                self.currentRow
            ].selected_groove_option = SelectedGrooveOption(
                DEFAULT_GROOVE_OPTIONS.get_groove_option(unprettify(groove_option)), {}
            )

    @Slot()
    def solveProcess(self) -> None:
        logging.info("Solve button clicked")

        self.persistInputProfile()
        self.persistGrooveOptions()
        self.persistTableData()
        logging.debug(f"Input profile: {self.input_profile.input_profile.name}")
        logging.debug(f"Input profile values: {self.input_profile.selected_values}")
        logging.debug("Proper table data")
        logging.debug(self.table_data)
        table_data: list[TableRow] = self.table_data

        input_constr = getattr(Profile, self.input_profile.input_profile.name)

        # Convert the selected values dict to a dict with the correct types
        float_input_profile_dict = {}
        for key, value in self.input_profile.selected_values.items():
            float_input_profile_dict[key] = float(value)

        # input_profile = input_constr(**self.input_profile.selected_values)
        input_profile = input_constr(**float_input_profile_dict)

        unit_sequence: list[Unit] = []
        # default_transport = Transport(duration=2)
        row_groove_data: RowData
        table_row: TableRow
        for i, (row_groove_data, table_row) in enumerate(
            zip(self.table_groove_data, table_data)
        ):
            if (
                table_row.transport_duration is None
                or table_row.transport_duration == ""
            ):
                transport = None
            else:
                transport = Transport(duration=float(table_row.transport_duration))

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
        solve(unit_sequence, input_profile)
        reporter = Reporter()
        html = reporter.render(unit_sequence)
        # File name should be report.html + timestamp
        file_name = f"report_{datetime.now().strftime('%Y-%m-%d_%H-%M-%S')}.html"

        # Print the html to disk
        with open(file_name, "w", encoding="utf-8") as f:
            f.write(html)

        # Open the report in the default browser
        webbrowser.open(file_name)


def main():
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()

    sys.exit(app.exec())
