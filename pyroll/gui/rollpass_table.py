import logging
from PySide6 import QtCore, QtGui, QtWidgets
from PySide6.QtCore import Qt
from PySide6.QtWidgets import QApplication, QMenu, QTableWidget, QTableWidgetItem


class RollPassTableWidget(QTableWidget):
    def __init__(self, parentLayout=None):
        if parentLayout is not None:
            super().__init__(parentLayout)  # create a 4x4 table
        else:
            super().__init__()
        self.setContextMenuPolicy(Qt.CustomContextMenu)  # enable custom context menu
        self.customContextMenuRequested.connect(
            self.show_menu
        )  # connect signal to slot
        print("Custom rollpasstablewidget created")
        logging.debug("Custom rollpasstablewidget created")
        self.mainWidget = None

    def show_menu(self, pos):
        menu = QMenu()  # create a menu object

        # Action to add a new row
        add_row_action = menu.addAction("Add Row")
        # Action to delete a row
        delete_row_action = menu.addAction("Delete Row")
        # Action to duplicate a row
        duplicate_row_action = menu.addAction("Duplicate Row")
        # Action to move a row up
        move_row_up_action = menu.addAction("Move Row Up")
        # Action to move a row down
        move_row_down_action = menu.addAction("Move Row Down")
        # Action to display contour lines
        display_contour_lines_action = menu.addAction("Display Contour Lines")

        # Get the selected action
        action = menu.exec_(self.mapToGlobal(pos))
        # If the selected action is to add a new row
        if action == add_row_action:
            self.mainWidget.addNewTableRow()
        elif action == delete_row_action:
            self.mainWidget.deleteTableRow()
        elif action == duplicate_row_action:
            self.mainWidget.duplicateTableRow()
        elif action == move_row_up_action:
            self.mainWidget.moveTableRowUp()
        elif action == move_row_down_action:
            self.mainWidget.moveTableRowDown()
        elif action == display_contour_lines_action:
            self.mainWidget.displayContourLines()


if __name__ == "__main__":
    app = QApplication()
    table = RollPassTableWidget()
    table.show()
    app.exec_()
