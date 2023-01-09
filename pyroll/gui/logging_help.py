from functools import cached_property
import logging

from PySide6.QtCore import QObject, Signal


class Bridge(QObject):  # This has to be done because there is a naming conflict
    log = Signal(str)


class TextLogHandler(logging.Handler):
    @cached_property
    def bridge(self):
        return Bridge()

    def emit(self, record):  # This is inherited from logging.Handler
        msg = self.format(record)
        self.bridge.log.emit(msg)  #
