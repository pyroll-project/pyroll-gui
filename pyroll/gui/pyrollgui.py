import sys
from typing import Optional, Union
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
)
from PySide6.QtCore import QFile, QSize, Slot
from pyroll.gui.groove_options import DEFAULT_GROOVE_OPTIONS, SelectedGrooveOption
from pyroll.gui.row_data import get_test_rowdata_list
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
)


# GROOVE_OPTIONS = ["Round", "Circular Oval", "Flat Oval"]

INPUT_PROFILES = ["Square", "Box", "Diamond", "Round"]

HORIZONTAL_HEADER_LABELS = [
    "gap",
    "roll_radius",
    "in_rotation",
    "velocity",
    "roll_temperature",
    "transport_duration",
    "atmosphere_temperature",
    "roll_rotation_frequency",
]


# class SelectedGrooveOption:
#    # Has 2 properties: the selected groove option and a list of property values
#    def __init__(self, groove_option: str, groove_option_values: list):
#        # Assert
#        assert groove_option in GROOVE_OPTIONS
#        self.groove_option = groove_option
#        self.groove_option_values = groove_option_values


# TODO: The dictionary might not be necessary here
# selected_groove_options: dict[int, SelectedGrooveOption] = {
#    0: SelectedGrooveOption(GROOVE_OPTIONS[0], ["10", "20", "14"]),
#    1: SelectedGrooveOption(GROOVE_OPTIONS[1], ["10", "44"]),
# }


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

        self.row_data = get_test_rowdata_list()

        # Set columns of self.ui.rollPassTable to "gap", "roll_radius", "in_rotation", "velocity", "roll_temperature", "transport_duration", "atmosphere_temperature", "roll_rotation_frequency"
        self.ui.rollPassTable.setColumnCount(8)
        self.ui.rollPassTable.setHorizontalHeaderLabels(HORIZONTAL_HEADER_LABELS)
        # Equally space the columns
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

        # Add a row to self.ui.rollPassTable
        self.ui.rollPassTable.insertRow(0)
        self.createInputProfileGUI()
        self.createGrooveOptionsGUI()

        self.createInputProfileOptions()
        self.createGrooveOptions()

        # Connect the signal of self.ui.inputProfileBox to the slot createInputProfileOptions
        self.ui.inputProfileBox.currentIndexChanged.connect(
            self.createInputProfileOptions
        )
        # Connect the signal of self.ui.grooveOptions to the slot createGrooveOptions
        self.ui.grooveOptionsBox.currentIndexChanged.connect(
            self.grooveOptionBoxChanged
        )
        self.ui.grooveOptionsBox.currentIndexChanged.connect(self.createGrooveOptions)

        # Connect the signal of the solve button to the slot solve
        self.ui.solveButton.clicked.connect(self.solve)
        self.addTestRow()

        # This represents the grooveOptionsGrids, one per row in the table
        self.ui.grooveOptionsGrid = QGridLayout()
        self.grooves = []

    def addTestRow(self):
        """<gap>1</gap>
        <roll_radius>180</roll_radius>
        <in_rotation>1</in_rotation>
        <velocity>1</velocity>
        <roll_temperature>20</roll_temperature>
        <transport_duration>1</transport_duration>
        <atmosphere_temperature>20</atmosphere_temperature>"""
        self.ui.rollPassTable.insertRow(0)
        self.ui.rollPassTable.setItem(0, 0, QTableWidgetItem("1"))
        self.ui.rollPassTable.setItem(0, 1, QTableWidgetItem("180"))
        self.ui.rollPassTable.setItem(0, 2, QTableWidgetItem("1"))
        self.ui.rollPassTable.setItem(0, 3, QTableWidgetItem("1"))
        self.ui.rollPassTable.setItem(0, 4, QTableWidgetItem("20"))
        self.ui.rollPassTable.setItem(0, 5, QTableWidgetItem("1"))
        self.ui.rollPassTable.setItem(0, 6, QTableWidgetItem("20"))
        self.ui.rollPassTable.setItem(0, 7, QTableWidgetItem("1"))

    @Slot()
    def grooveOptionBoxChanged(self) -> None:
        # Get the groove option selected
        groove_option = self.ui.grooveOptionsBox.currentText()

        print(groove_option)
        # Print current groove option
        current_gr_op = self.row_data[self.currentRow].selected_groove_option
        print(current_gr_op.selectedValues)
        if current_gr_op.grooveOption.name != groove_option:
            self.row_data[
                self.currentRow
            ].selected_groove_option = SelectedGrooveOption(DEFAULT_GROOVE_OPTIONS.get_groove_option(
                groove_option
            ), {})

        # selected_groove_options[self.currentRow].groove_option = groove_option

    @Slot()
    def selectedRowChanged(self) -> None:
        # Get selectionmodel from self.ui.rollPassTable
        selectionModel = self.ui.rollPassTable.selectionModel()
        # Get the current selected row
        self.currentRow = selectionModel.currentIndex().row()
        print("row changed to:", self.currentRow)

    @Slot()
    def createInputProfileGUI(self):
        self.ui.inputProfileGrid.setRowMinimumHeight(3, 100)

        self.ui.inputProfileLabel = QLabel("Input profile")

        self.ui.inputProfileGrid.addWidget(self.ui.inputProfileLabel, 0, 0)

        self.ui.inputProfileBox = QComboBox()
        # Combo box with items "Square", "Box", "Diamond", "Round"
        self.ui.inputProfileBox.addItems(["Square", "Box", "Diamond", "Round"])

        self.ui.inputProfileGrid.addWidget(self.ui.inputProfileBox, 1, 0)

        self.ui.inputItemOptionsLabel = QLabel("Input item options")

        self.ui.inputProfileGrid.addWidget(self.ui.inputItemOptionsLabel, 2, 0)

        self.ui.inputItemOptions: QFormLayout = QFormLayout()

        self.ui.inputProfileGrid.addLayout(self.ui.inputItemOptions, 3, 0)

    @Slot()
    def createGrooveOptionsGUI(self) -> None:

        comboBoxValue = self.row_data[
            self.currentRow
        ].selected_groove_option.grooveOption.name

        self.ui.grooveOptionsGrid.setRowMinimumHeight(3, 100)

        self.ui.grooveOptionsLabel = QLabel("Groove options")

        self.ui.grooveOptionsGrid.addWidget(self.ui.grooveOptionsLabel, 0, 0)

        self.ui.grooveOptionsBox = QComboBox()
        self.ui.grooveOptionsBox.addItems(
            DEFAULT_GROOVE_OPTIONS.get_groove_option_names()
        )

        # If a selectedGrooveOption is given, set the grooveOptionsBox to the selectedGrooveOption
        self.ui.grooveOptionsBox.setCurrentText(comboBoxValue)

        self.ui.grooveOptionsGrid.addWidget(self.ui.grooveOptionsBox, 1, 0)

        self.ui.grooveOptionsLabel = QLabel("Groove options")

        self.ui.grooveOptionsGrid.addWidget(self.ui.grooveOptionsLabel, 2, 0)

        self.ui.grooveOptions = QFormLayout()

        self.ui.grooveOptionsGrid.addLayout(self.ui.grooveOptions, 3, 0)

    @Slot()
    def createInputProfileOptions(self):
        """Depending on the selected combo box item, create different input profile options"""

        selectedItem = self.ui.inputProfileBox.currentText()

        clearLayout(self.ui.inputItemOptions)

        if selectedItem == "Square":
            self.ui.inputItemOptions.addRow(QLabel("Diagonal"), QLineEdit())
            self.ui.inputItemOptions.addRow(QLabel("Corner radius"), QLineEdit())

    @Slot()
    def createGrooveOptions(self):
        """Depending on the selected combo box item, create different groove options."""

        grooveOption = self.row_data[
            self.currentRow
        ].selected_groove_option.grooveOption

        comboBoxValue = grooveOption.name

        self.ui.grooveOptionsBox.setCurrentText(comboBoxValue)

        # grooveOptionValues = selected_groove_options[self.currentRow]
        #
        # optionValueList = grooveOptionValues.groove_option_values

        optionValueList = grooveOption.settingFields

        # get the selected item from self.ui.grooveBox
        # selectedItem = self.ui.grooveOptionsBox.currentText()

        # Delete all rows from self.ui.grooveOptions QFormLayout
        clearLayout(self.ui.grooveOptions)

        for i, grooveOptionValue in enumerate(optionValueList):
            # Create a new row in the grooveOptions QFormLayout
            itemAtIndex = (i + 1) * 2 - 1
            self.ui.grooveOptions.addRow(QLabel(grooveOptionValue), QLineEdit())
            if (
                grooveOptionValue
                in self.row_data[self.currentRow].selected_groove_option.selectedValues
            ):
                # self.ui.grooveOptions.itemAt(1).widget().setText(optionValueList[0])
                self.ui.grooveOptions.itemAt(itemAtIndex).widget().setText(
                    f"""{self.row_data[
                        self.currentRow
                    ].selected_groove_option.selectedValues[grooveOptionValue]}"""
                )

        # if the selected item is "Square", add to self.ui.grooveOptions the labels "Diagonal" and "Corner radius" with corresponding line edits
        # if selectedItem == "Round":
        #    self.ui.grooveOptions.addRow(QLabel("r1"), QLineEdit())
        #    # Set grooveoptions lineedit to the value of the selected grooveOptionValues
        #    if grooveOptionValues is not None:
        #        self.ui.grooveOptions.itemAt(1).widget().setText(optionValueList[0])
        #    self.ui.grooveOptions.addRow(QLabel("r2"), QLineEdit())
        #    if grooveOptionValues is not None:
        #        self.ui.grooveOptions.itemAt(3).widget().setText(optionValueList[1])
        #    self.ui.grooveOptions.addRow(QLabel("depth"), QLineEdit())
        #    if grooveOptionValues is not None:
        #        self.ui.grooveOptions.itemAt(5).widget().setText(optionValueList[2])

    def getTableData(self) -> list[dict[str, Union[str, list[str], None]]]:
        # Gets the data from the rollpasstable in the form of a list of dictionaries
        # The dictionary keys are the HORIZONTAL_HEADER_LABELS
        # The dictionary values are the values in the table
        tableData: list[dict[str, Optional[Union[str, list[str]]]]] = []
        for row in range(self.ui.rollPassTable.rowCount()):
            tableData.append({})
            for column in range(self.ui.rollPassTable.columnCount()):
                if self.ui.rollPassTable.item(row, column) is not None:
                    tableData[row][
                        HORIZONTAL_HEADER_LABELS[column]
                    ] = self.ui.rollPassTable.item(row, column).text()
                else:
                    tableData[row][HORIZONTAL_HEADER_LABELS[column]] = None

                # add data from selected_groove_options to tableData
                # tableData[row]["groove_option"] = selected_groove_options[
                #    row
                # ].groove_option
                # tableData[row]["groove_option_values"] = selected_groove_options[
                #    row
                # ].groove_option_values

        return tableData

    # Solve function
    @Slot()
    def solve(self):
        print("Solve button clicked")

        # Get the selected item from self.ui.inputProfileBox
        selectedInputProfile: str = self.ui.inputProfileBox.currentText()
        print(selectedInputProfile)
        inputItemOptionsDict: dict[str, str] = {}

        for i in range(0, self.ui.inputItemOptions.count(), 2):
            label: str = self.ui.inputItemOptions.itemAt(i).widget().text()
            # Convert label to lowercase and replace spaces with underscores
            label = label.lower().replace(" ", "_")
            lineEdit = self.ui.inputItemOptions.itemAt(i + 1).widget()
            inputItemOptionsDict[label] = float(lineEdit.text())

        print(inputItemOptionsDict)

        input_constr = getattr(Profile, selectedInputProfile.lower())
        input = input_constr(**inputItemOptionsDict)

        rollpass_dicts = self.getTableData()
        # Now get the info from the table

        sequence: list[Union[RollPass, Transport]] = []

        for i, rollpass_dict in enumerate(rollpass_dicts):
            # Construct a RollPass object from the data in the table

            rp = RollPass()


def main():
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()

    sys.exit(app.exec())
