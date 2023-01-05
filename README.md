# PyRoll GUI

A graphical user interface for the PyRoll Library

### Keyboard shortcuts

* Ctrl-Shift-A: Add a new row
* Ctrl-Shift-Delete: Delete the selected row
* Ctrl-Shift-D: Duplicate the selected row
----

## Requirements for GUI

- save and load of XML files acc. to `process_data.xsd`
- create inputs for all elements in XSD
- button to fire solution procedure `pyroll.core.solve()`

### Initial Profile `<in_profile>`

- square, box, diamond, round
- input boxes for each parameter

### Pass Sequence `<pass_sequence>`

- tabular layout
- plot of roll pass contour lines with ideal in profile (updated with unit selection and change of properties)
- assume one transport after each roll pass for better layout of table (set time to 0 if not present or similar)

### Parameters equal for all units `<pass_defaults>`

- such as heat transfer coefficients
- include column to override for each pass