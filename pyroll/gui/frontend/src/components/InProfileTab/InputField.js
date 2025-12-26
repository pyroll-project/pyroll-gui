import React from "react";

export default function InputField({ label, type, value, onChange, placeholder }) {
  const handleChange = (e) => {
    const val = type === 'number' ? (parseFloat(e.target.value) || 0) : e.target.value;
    onChange(val);
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