import React from "react";

export default function ScientificInputField({label, value, onChange, placeholder}) {
    const [displayValue, setDisplayValue] = React.useState(String(value));

    React.useEffect(() => {
        setDisplayValue(String(value));
    }, [value]);

    const handleChange = (e) => {
        const inputValue = e.target.value;
        setDisplayValue(inputValue);

        const scientificRegex = /^-?\d*\.?\d*[eE]?[+-]?\d*$/;

        if (scientificRegex.test(inputValue)) {
            const parsedValue = parseFloat(inputValue);

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