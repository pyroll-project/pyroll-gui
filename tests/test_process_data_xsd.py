import xmlschema
from pathlib import Path
from pprint import pprint

THIS_DIR = Path(__file__).parent

def test_process_data_xsd():
    schema = xmlschema.XMLSchema("pyroll/gui/process_data.xsd")

    schema.validate(THIS_DIR / "process_data.xml")

    data = schema.decode(THIS_DIR / "process_data.xml")

    print()
    pprint(data)
