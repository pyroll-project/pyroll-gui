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
)
from PySide6.QtCore import QFile, QSize, Slot
from ui_mainwindow import Ui_MainWindow

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

        # Add a row to self.ui.rollPassTable
        self.ui.rollPassTable.insertRow(0)
        self.createInputProfileGUI()
        self.createInputProfileOptions()

        # Connect the signal of self.ui.inputProfileBox to the slot createInputProfileOptions
        self.ui.inputProfileBox.currentIndexChanged.connect(self.createInputProfileOptions)

    @Slot()
    def createInputProfileGUI(self):
        self.ui.inputProfileGrid.setRowMinimumHeight(3, 100)
        # Add items to inputprofilegrid (Horizontally):
        #
        # Create inputProfileLable
        self.ui.inputProfileLabel = QLabel("Input profile")
        # Label "Input profile"
        self.ui.inputProfileGrid.addWidget(self.ui.inputProfileLabel, 0, 0)
        # Create inputProfileBox
        self.ui.inputProfileBox = QComboBox()
        # Combo box with items "Square", "Box", "Diamond", "Round"
        self.ui.inputProfileBox.addItems(["Square", "Box", "Diamond", "Round"])

        # Combo box "Input profile"
        self.ui.inputProfileGrid.addWidget(self.ui.inputProfileBox, 1, 0)
        # Create inputItemOptions label
        self.ui.inputItemOptionsLabel = QLabel("Input item options")
        # Label "Input profile options"
        self.ui.inputProfileGrid.addWidget(self.ui.inputItemOptionsLabel, 2, 0)
        # Create inputItemOptions form layout
        self.ui.inputItemOptions = QFormLayout()
        # Set minimum height for inputItemOptions form layout
        # Form layout "Input profile options"
        self.ui.inputProfileGrid.addLayout(self.ui.inputItemOptions, 3, 0)



    def createInputProfileOptions(self):
        """Depending on the selected combo box item, create different input profile options"""
        # get the selected item from self.ui.inputProfileBox
        selectedItem = self.ui.inputProfileBox.currentText()
        #TODO: Finish
            
        # Delete all rows from self.ui.inputItemOptions QFormLayout
        clearLayout(self.ui.inputItemOptions)

        # if the selected item is "Square", add to self.ui.inputItemOptions the labels "Diagonal" and "Corner radius" with corresponding line edits
        if selectedItem == "Square":
            self.ui.inputItemOptions.addRow(QLabel("Diagonal"), QLineEdit())
            self.ui.inputItemOptions.addRow(QLabel("Corner radius"), QLineEdit())


if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()

    sys.exit(app.exec())
