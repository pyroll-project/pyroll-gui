import logging

from PySide6.QtWidgets import QPlainTextEdit


class QTextEditLogger(logging.Handler):
    def __init__(self, parent):
        super(QTextEditLogger, self).__init__()

        self.widget = QPlainTextEdit(parent)
        self.widget.setReadOnly(True)

        # Set fixed height: 150px
        self.widget.setMaximumHeight(150)
        self.widget.setMinimumHeight(150)

    def emit(self, record):
        msg = self.format(record)
        self.widget.appendPlainText(msg)

    def write(self, m):
        pass
