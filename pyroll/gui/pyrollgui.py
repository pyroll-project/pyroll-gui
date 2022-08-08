import sys
from PySide6.QtWidgets import QApplication, QMainWindow, QHeaderView, QTableWidgetItem
from PySide6.QtCore import QFile
from ui_mainwindow import Ui_MainWindow

class MainWindow(QMainWindow):
    def __init__(self):
        super(MainWindow, self).__init__()
        self.ui = Ui_MainWindow()
        self.ui.setupUi(self)

        # Set columns of self.ui.rollPassTable to "groove", "gap", "roll_radius", "in_rotation", "velocity", "roll_temperature", "transport_duration", "atmosphere_temperature", "roll_rotation_frequency"
        self.ui.rollPassTable.setColumnCount(9)
        self.ui.rollPassTable.setHorizontalHeaderLabels(["groove", "gap", "roll_radius", "in_rotation", "velocity", "roll_temperature", "transport_duration", "atmosphere_temperature", "roll_rotation_frequency"])
        # Equally space the columns
        self.ui.rollPassTable.horizontalHeader().setSectionResizeMode(QHeaderView.Stretch)

        # Add a row to self.ui.rollPassTable
        self.ui.rollPassTable.insertRow(0)
        


if __name__ == "__main__":
    app = QApplication(sys.argv)
    window = MainWindow()
    window.show()

    sys.exit(app.exec())