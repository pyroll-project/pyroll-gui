# import xmlschema
from pprint import pprint

# We need the xml package because duplicate keys are not allowed in dicts -> Can not
from xml.etree import ElementTree

from pyroll.gui.groove_options import DEFAULT_GROOVE_OPTIONS, SelectedGrooveOption
from pyroll.gui.in_profiles import (
    DEFAULT_INPUT_PROFILES,
    InputProfile,
    SelectedInputProfile,
)
from pyroll.gui.row_data import RowData
from pyroll.gui.table_data import TableRow


class XmlProcessing:
    def __init__(self, schema_path="pyroll/gui/process_data.xsd"):
        return
        # Currently not used
        self.schema = xmlschema.XMLSchema(schema_path)

    #    def validate_xml(self, xml_path: str):
    #        return self.schema.is_valid(xml_path)
    #
    #    def decode_xml(self, xml_path: str):
    #        return self.schema.decode(xml_path)
    #
    #    def encode_xml(self, data: dict):
    #        return self.schema.encode(data)

    def save_pyroll_xml(
        self,
        row_groove_data: list[RowData],
        table_rows: list[TableRow],
        input_profile: SelectedInputProfile,
        file_path: str,
    ):
        # Check if the number of rows in the table is the same as the number of rows in the row_data
        if len(row_groove_data) != len(table_rows):
            raise ValueError(
                "The number of rows in the table is not the same as the number of rows in the row_data"
            )

        # Now we do the same, but only with the xml package
        root = ElementTree.Element("process_data")
        input_profile_element = ElementTree.SubElement(root, "in_profile")
        # Create a subelement for the input profile name
        input_profile_name = ElementTree.SubElement(
            input_profile_element, input_profile.input_profile.name
        )
        for key, value in input_profile.selected_values.items():
            # Create subelements, not attributes
            ElementTree.SubElement(input_profile_name, key).text = str(value)
        pass_sequence_element = ElementTree.SubElement(root, "pass_sequence")
        for row, table_row in zip(row_groove_data, table_rows):
            pass_element = ElementTree.SubElement(pass_sequence_element, "pass")

            groove_element = ElementTree.SubElement(pass_element, "groove")
            groove_name_element = ElementTree.SubElement(
                groove_element, row.selected_groove_option.groove_option.name
            )
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

    def load_pyroll_xml(
        self, file_path: str
    ) -> tuple[list[RowData], list[TableRow], SelectedInputProfile]:
        # Load the xml file
        tree = ElementTree.parse(file_path)
        root = tree.getroot()

        # Get the input profile
        input_profile_element = root.find("in_profile")
        # Find the first child of the input profile element
        input_profile_name_el = input_profile_element.find("*")
        # Get the name of the input profile
        input_profile_name = input_profile_name_el.tag
        selected_values = {}
        # Get the values of the input profile
        for inputparams in input_profile_name_el.findall("*"):
            selected_values[inputparams.tag] = inputparams.text

        input_profile = SelectedInputProfile(
            DEFAULT_INPUT_PROFILES.get_input_profile(input_profile_name),
            selected_values,
        )

        # Get the pass sequence
        pass_sequence_element = root.find("pass_sequence")
        row_data = []
        table_rows = []

        for i, pass_element in enumerate(pass_sequence_element.findall("pass")):
            # Get the groove
            groove_element = pass_element.find("groove")
            groove_name_element = groove_element.find("*")
            groove_name = groove_name_element.tag
            groove_values = {}
            for grooveparam in groove_name_element.findall("*"):
                groove_values[grooveparam.tag] = grooveparam.text
            row_data.append(
                RowData(
                    # i,
                    SelectedGrooveOption(
                        DEFAULT_GROOVE_OPTIONS.get_groove_option(groove_name),
                        groove_values,
                    ),
                )
            )
            # Get the table row
            table_row = TableRow()
            for child in pass_element.findall("*"):
                table_row.__dict__[child.tag] = child.text
            table_rows.append(table_row)

        return row_data, table_rows, input_profile


if __name__ == "__main__":
    xml_processing = XmlProcessing()
    xml_processing.validate_xml("tests/process_data.xml")
    data = xml_processing.decode_xml("tests/process_data.xml")
    pprint(data)
