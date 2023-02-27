# -*- coding: utf-8 -*-

################################################################################
## Form generated from reading UI file 'mainwindow.ui'
##
## Created by: Qt User Interface Compiler version 6.3.2
##
## WARNING! All changes made in this file will be lost when recompiling UI file!
################################################################################

from PySide6.QtCore import (QCoreApplication, QDate, QDateTime, QLocale,
    QMetaObject, QObject, QPoint, QRect,
    QSize, QTime, QUrl, Qt)
from PySide6.QtGui import (QBrush, QColor, QConicalGradient, QCursor,
    QFont, QFontDatabase, QGradient, QIcon,
    QImage, QKeySequence, QLinearGradient, QPainter,
    QPalette, QPixmap, QRadialGradient, QTransform)
from PySide6.QtWidgets import (QApplication, QGridLayout, QHBoxLayout, QHeaderView,
    QMainWindow, QMenuBar, QPlainTextEdit, QPushButton,
    QSizePolicy, QStatusBar, QTableWidgetItem, QVBoxLayout,
    QWidget)

from pyroll.gui.rollpass_table import RollPassTableWidget

class Ui_MainWindow(object):
    def setupUi(self, MainWindow):
        if not MainWindow.objectName():
            MainWindow.setObjectName(u"MainWindow")
        MainWindow.resize(1384, 660)
        sizePolicy = QSizePolicy(QSizePolicy.Expanding, QSizePolicy.Expanding)
        sizePolicy.setHorizontalStretch(0)
        sizePolicy.setVerticalStretch(0)
        sizePolicy.setHeightForWidth(MainWindow.sizePolicy().hasHeightForWidth())
        MainWindow.setSizePolicy(sizePolicy)
        self.centralwidget = QWidget(MainWindow)
        self.centralwidget.setObjectName(u"centralwidget")
        sizePolicy.setHeightForWidth(self.centralwidget.sizePolicy().hasHeightForWidth())
        self.centralwidget.setSizePolicy(sizePolicy)
        self.verticalLayoutWidget = QWidget(self.centralwidget)
        self.verticalLayoutWidget.setObjectName(u"verticalLayoutWidget")
        self.verticalLayoutWidget.setGeometry(QRect(30, 20, 1331, 581))
        self.verticalLayout = QVBoxLayout(self.verticalLayoutWidget)
        self.verticalLayout.setObjectName(u"verticalLayout")
        self.verticalLayout.setContentsMargins(0, 0, 0, 0)
        self.rollPassTable = RollPassTableWidget(self.verticalLayoutWidget)
        self.rollPassTable.setObjectName(u"rollPassTable")

        self.verticalLayout.addWidget(self.rollPassTable)

        self.horizontalLayout_2 = QHBoxLayout()
        self.horizontalLayout_2.setObjectName(u"horizontalLayout_2")
        self.contourLinesLayout = QHBoxLayout()
        self.contourLinesLayout.setObjectName(u"contourLinesLayout")

        self.horizontalLayout_2.addLayout(self.contourLinesLayout)

        self.inputProfileGrid = QGridLayout()
        self.inputProfileGrid.setObjectName(u"inputProfileGrid")

        self.horizontalLayout_2.addLayout(self.inputProfileGrid)

        self.grooveOptionsGrid = QGridLayout()
        self.grooveOptionsGrid.setObjectName(u"grooveOptionsGrid")

        self.horizontalLayout_2.addLayout(self.grooveOptionsGrid)


        self.verticalLayout.addLayout(self.horizontalLayout_2)

        self.solveButton = QPushButton(self.verticalLayoutWidget)
        self.solveButton.setObjectName(u"solveButton")

        self.verticalLayout.addWidget(self.solveButton)

        self.logText = QPlainTextEdit(self.verticalLayoutWidget)
        self.logText.setObjectName(u"logText")
        sizePolicy1 = QSizePolicy(QSizePolicy.Expanding, QSizePolicy.Minimum)
        sizePolicy1.setHorizontalStretch(0)
        sizePolicy1.setVerticalStretch(0)
        sizePolicy1.setHeightForWidth(self.logText.sizePolicy().hasHeightForWidth())
        self.logText.setSizePolicy(sizePolicy1)
        self.logText.setMinimumSize(QSize(0, 100))
        self.logText.setMaximumSize(QSize(16777215, 100))
        self.logText.setReadOnly(True)

        self.verticalLayout.addWidget(self.logText)

        MainWindow.setCentralWidget(self.centralwidget)
        self.menubar = QMenuBar(MainWindow)
        self.menubar.setObjectName(u"menubar")
        self.menubar.setGeometry(QRect(0, 0, 1384, 22))
        MainWindow.setMenuBar(self.menubar)
        self.statusbar = QStatusBar(MainWindow)
        self.statusbar.setObjectName(u"statusbar")
        MainWindow.setStatusBar(self.statusbar)

        self.retranslateUi(MainWindow)

        QMetaObject.connectSlotsByName(MainWindow)
    # setupUi

    def retranslateUi(self, MainWindow):
        MainWindow.setWindowTitle(QCoreApplication.translate("MainWindow", u"MainWindow", None))
        self.solveButton.setText(QCoreApplication.translate("MainWindow", u"Solve", None))
    # retranslateUi

