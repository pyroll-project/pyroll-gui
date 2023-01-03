import logging
from pyroll.gui.pyrollgui import main

if __name__ == "__main__":
    # FORMAT = "[%(asctime)s %(filename)s->%(funcName)s():%(lineno)s]%(levelname)s: %(message)s"

    logging.basicConfig(level=logging.DEBUG)
    # logging.basicConfig(level=logging.DEBUG, format=FORMAT)

    main()
