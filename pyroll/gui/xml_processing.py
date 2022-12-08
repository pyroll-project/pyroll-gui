import xmlschema
from pprint import pprint


class XmlProcessing:
    def __init__(self, schema_path = 'pyroll/gui/process_data.xsd'):
        self.schema = xmlschema.XMLSchema(schema_path)

    def validate_xml(self, xml_path:str):
        return self.schema.is_valid(xml_path)

    def decode_xml(self, xml_path:str):
        return self.schema.decode(xml_path)

    def encode_xml(self, data:dict):
        return self.schema.encode(data)


if __name__ == '__main__':
    xml_processing = XmlProcessing()
    xml_processing.validate_xml('tests/process_data.xml')
    data = xml_processing.decode_xml('tests/process_data.xml')
    pprint(data)