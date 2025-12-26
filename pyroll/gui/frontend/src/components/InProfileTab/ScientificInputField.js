import React from "react";

export default function ScientificInputField({ label, value, onChange, placeholder }) {
  const [displayValue, setDisplayValue] = React.useState(String(value));

  React.useEffect(() => {
    setDisplayValue(String(value));
  }, [value]);

  const handleChange = (e) => {
    const inputValue = e.target.value;
    setDisplayValue(inputValue);

    // Allow scientific notation (e.g., 1e3, 1.5e-3, 5E6)
    const scientificRegex = /^-?\d*\.?\d*[eE]?[+-]?\d*$/;

    if (scientificRegex.test(inputValue)) {
      // Try to parse the value
      const parsedValue = parseFloat(inputValue);

      // Only update parent if it's a valid number
      if (!isNaN(parsedValue)) {
        onChange(parsedValue);
      } else if (inputValue === '' || inputValue === '-') {
        onChange(0);
      }
    }
  };

  return (
    <div>
      <label style={{fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px'}}>
        {label}
      </label>
      <input
        type="text"
        value={displayValue}
        onChange={handleChange}
        placeholder={placeholder}
        style={{
          width: '100%',
          padding: '8px',
          border: '1px solid #ddd',
          borderRadius: '4px',
          fontSize: '14px'
        }}
      />
    </div>
  );
}