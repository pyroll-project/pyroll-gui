import React from "react";
import ScientificInputField from "./ScientificInputField";

export default function InputField({label, type, value, onChange, placeholder}) {

    if (type === 'number') {
        return (
            <ScientificInputField
                label={label}
                value={value}
                onChange={onChange}
                placeholder={placeholder}
            />
        );
    }

    const handleChange = (e) => {
        onChange(e.target.value);
    };

    return (
        <div>
            <label style={{fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px'}}>
                {label}
            </label>
            <input
                type={type}
                value={value}
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