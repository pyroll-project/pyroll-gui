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

    def show_menu(self, pos):
        menu = QMenu()  # create a menu object
        # copy_action = menu.addAction("Copy") # add an action to copy cell content
        # paste_action = menu.addAction("Paste") # add an action to paste cell content
        # action = menu.exec_(self.mapToGlobal(pos)) # show the menu at global position and get the selected action
        # if action == copy_action: # if copy action is selected
        #    item = self.itemAt(pos) # get the item at local position
        #    if item: # if there is an item
        #        QApplication.clipboard().setText(item.text()) # copy its text to clipboard
        #        print(f"Row number: {item.row()}") # print the row number of the item
        # elif action == paste_action: # if paste action is selected
        #    item = self.itemAt(pos) # get the item at local position
        #    if item: # if there is an item
        #        item.setText(QApplication.clipboard().text()) # set its text from clipboard
        #        print(f"Row number: {self.currentRow()}") # print the current row number of QTableWidget

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

        # Get the selected action
        action = menu.exec_(self.mapToGlobal(pos))
        # If the selected action is to add a new row
        if action == add_row_action:
            print(f"Parent widget: {self.parent()}")
            self.parent().addNewTableRow()
            # Print the name of the parent widget



if __name__ == "__main__":
    app = QApplication()
    table = RollPassTableWidget()
    table.show()
    app.exec_()
