import sys
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
)
from PySide6.QtCore import QFile, QSize, Slot
from .ui_mainwindow import Ui_MainWindow


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

        # Set columns of self.ui.rollPassTable to "gap", "roll_radius", "in_rotation", "velocity", "roll_temperature", "transport_duration", "atmosphere_temperature", "roll_rotation_frequency"
        self.ui.rollPassTable.setColumnCount(8)
        self.ui.rollPassTable.setHorizontalHeaderLabels(
            [
                "gap",
                "roll_radius",
                "in_rotation",
                "velocity",
                "roll_temperature",
                "transport_duration",
                "atmosphere_temperature",
                "roll_rotation_frequency",
            ]
        )
        # Equally space the columns
        self.ui.rollPassTable.horizontalHeader().setSectionResizeMode(
            QHeaderView.Stretch
        )
        # Only let one row be selected at a time
        self.ui.rollPassTable.setSelectionMode(QTableWidget.SingleSelection)

        self.ui.rollPassTable.selectionModel().selectionChanged.connect(self.selectedRowChanged)

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
        self.ui.grooveOptionsBox.currentIndexChanged.connect(self.createGrooveOptions)

        # Connect the signal of the solve button to the slot solve
        self.ui.solveButton.clicked.connect(self.solve)
        self.addTestRow()

        self.currentRow = 0

        # This represents the grooveOptionsGrids, one per row in the table
        self.grooveOptionsGrids = []

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
    def selectedRowChanged(self):
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

        self.ui.inputItemOptions = QFormLayout()

        self.ui.inputProfileGrid.addLayout(self.ui.inputItemOptions, 3, 0)

    @Slot()
    def createGrooveOptionsGUI(self):

        self.ui.grooveOptionsGrid.setRowMinimumHeight(3, 100)

        self.ui.grooveOptionsLabel = QLabel("Groove options")

        self.ui.grooveOptionsGrid.addWidget(self.ui.grooveOptionsLabel, 0, 0)

        self.ui.grooveOptionsBox = QComboBox()
        self.ui.grooveOptionsBox.addItems(["Round", "Circular Oval", "Flat Oval"])

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
        """Depending on the selected combo box item, create different groove options"""
        # get the selected item from self.ui.grooveBox
        selectedItem = self.ui.grooveOptionsBox.currentText()

        # Delete all rows from self.ui.grooveOptions QFormLayout
        clearLayout(self.ui.grooveOptions)

        # if the selected item is "Square", add to self.ui.grooveOptions the labels "Diagonal" and "Corner radius" with corresponding line edits
        if selectedItem == "Round":
            self.ui.grooveOptions.addRow(QLabel("r1"), QLineEdit())
            self.ui.grooveOptions.addRow(QLabel("r2"), QLineEdit())
            self.ui.grooveOptions.addRow(QLabel("depth"), QLineEdit())

    # Solve function
    @Slot()
    def solve(self):
        print("Solve button clicked")
        pass


def main():
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()

    sys.exit(app.exec())
