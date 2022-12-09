import xmlschema
from pprint import pprint
from pyroll.gui.in_profiles import InputProfile, SelectedInputProfile
from pyroll.gui.row_data import RowData
from pyroll.gui.table_data import TableRow

# We need the xml package because duplicate keys are not allowed in dicts -> Can not
from xml.etree import ElementTree


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
        # Check if the number of rows in the table is the same as the number of rows in the row_data
        if len(row_data) != len(table_rows):
            raise ValueError(
                "The number of rows in the table is not the same as the number of rows in the row_data"
            )

        # Now we do the same, but only with the xml package
        root = ElementTree.Element("process_data")
        input_profile_element = ElementTree.SubElement(root, "in_profile")
        for key, value in input_profile.selected_values.items():
            # Create subelements, not attributes
            ElementTree.SubElement(input_profile_element, key).text = str(value)
        pass_sequence_element = ElementTree.SubElement(root, "pass_sequence")
        for row, table_row in zip(row_data, table_rows):
            pass_element = ElementTree.SubElement(pass_sequence_element, "pass")

            groove_element = ElementTree.SubElement(pass_element, "groove")
            groove_name_element = ElementTree.SubElement(groove_element, row.selected_groove_option.groove_option.name)
            # Create subelement for each key, value pair in the selected_values dict
            for key, value in row.selected_groove_option.selected_values.items():
                ElementTree.SubElement(groove_name_element, key).text = str(value)

            for key, value in table_row.__dict__.items():
                ElementTree.SubElement(pass_element, key).text = str(value)

        # Print to file
        tree = ElementTree.ElementTree(root)
        ElementTree.indent(tree, space="  ")

        # Write with indent 4
        tree.write(file_path, encoding="utf-8", xml_declaration=True)


if __name__ == "__main__":
    xml_processing = XmlProcessing()
    xml_processing.validate_xml("tests/process_data.xml")
    data = xml_processing.decode_xml("tests/process_data.xml")
    pprint(data)
