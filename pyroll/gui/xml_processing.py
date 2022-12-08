import xmlschema
from pprint import pprint
from pyroll.gui.in_profiles import InputProfile, SelectedInputProfile
from pyroll.gui.row_data import RowData
from pyroll.gui.table_data import TableRow
import xmltodict


class XmlProcessing:
    def __init__(self, schema_path="pyroll/gui/process_data.xsd"):
        self.schema = xmlschema.XMLSchema(schema_path)

    def validate_xml(self, xml_path: str):
        return self.schema.is_valid(xml_path)

    def decode_xml(self, xml_path: str):
        return self.schema.decode(xml_path)

    def encode_xml(self, data: dict):
        return self.schema.encode(data)

    def save_pyroll_xml(
        self,
        row_data: list[RowData],
        table_rows: list[TableRow],
        input_profile: SelectedInputProfile,
        file_path: str,
    ):
        # TODO: This is currently not properly structured, we need to fix this
        data = {
            "process_data": {
                "row_data": [
                    {
                        row.selected_groove_option.groove_option.name: row.selected_groove_option.selected_values
                    }
                    for row in row_data
                ],
                "table_row": [row.__dict__ for row in table_rows],
                input_profile.input_profile.name: input_profile.selected_values,
            }
        }
        # xml = self.encode_xml(data)
        xml = xmltodict.unparse(data, pretty=True)
        with open(file_path, "w", encoding="utf-8") as f:
            f.write(xml)


if __name__ == "__main__":
    xml_processing = XmlProcessing()
    xml_processing.validate_xml("tests/process_data.xml")
    data = xml_processing.decode_xml("tests/process_data.xml")
    pprint(data)
