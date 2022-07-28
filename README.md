# PyRoll GUI

## Requirements for GUI

- save and load of XML or JSON files (only values of input fields)
- button to fire solution procedure `pyroll.core.solve()`

### Initial Profile

- quare, box, diamond, round
- input boxes for each parameter

### Pass Sequence

- tabular layout
- plot of roll pass contour lines with ideal in profile (updated with unit selection and change of properties)
- assume one transport after each roll pass for better layout of table (set time to 0 if not present or similar)

### Parameters equal for all units

- such as heat transfer coefficients
- may include column to override