import React from "react";
import InputField from "./InputField";

const materialOptions = ['C20', 'C45', 'S355j2', 'B10', 'BST500', '11MnS30', 'Other'];

export default function CommonParameters({ inProfile, setInProfile }) {
  const isMaterialOther = inProfile.material === 'Other';

  return (
    <>
      <div>
        <label style={{fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px'}}>
          Temperature
        </label>
        <input
          type="number"
          value={inProfile.temperature}
          onChange={(e) => setInProfile({...inProfile, temperature: parseFloat(e.target.value) || 0})}
          style={{
            width: '250px',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        />
      </div>

      <div>
        <label style={{fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px'}}>
          Pre Strain
        </label>
        <input
          type="number"
          value={inProfile.strain || 0}
          onChange={(e) => setInProfile({...inProfile, strain: parseFloat(e.target.value) || 0})}
          style={{
            width: '250px',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        />
      </div>
        <div>
        <label style={{fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px'}}>
          Density
        </label>
        <input
          type="number"
          value={inProfile.density || 0}
          onChange={(e) => setInProfile({...inProfile, density: parseFloat(e.target.value) || 0})}
          style={{
            width: '250px',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        />
      </div><div>
        <label style={{fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px'}}>
          Specific Heat Capacity
        </label>
        <input
          type="number"
          value={inProfile.specific_heat_capacity || 0}
          onChange={(e) => setInProfile({...inProfile, specific_heat_capacity: parseFloat(e.target.value) || 0})}
          style={{
            width: '250px',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        />
      </div><div>
        <label style={{fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px'}}>
          Thermal Conductivity
        </label>
        <input
          type="number"
          value={inProfile.thermal_conductivity || 0}
          onChange={(e) => setInProfile({...inProfile, thermal_conductivity: parseFloat(e.target.value) || 0})}
          style={{
            width: '250px',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px'
          }}
        />
      </div>
      <div>
        <label style={{fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px'}}>
          Material
        </label>
        <select
          value={inProfile.material}
          onChange={(e) => setInProfile({...inProfile, material: e.target.value})}
          style={{
            width: '250px',
            padding: '8px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            fontSize: '14px',
            cursor: 'pointer'
          }}
        >
          {materialOptions.map(option => (
            <option key={option} value={option}>{option}</option>
          ))}
        </select>
      </div>

      {/* Material Flow Stress Parameters - nur wenn "Other" ausgewählt */}
      {isMaterialOther && (
        <>
          <div style={{
            width: '100%',
            padding: '15px',
            background: '#fff8e1',
            borderRadius: '8px',
            border: '1px solid #ffc107',
            marginTop: '10px'
          }}>
            <div style={{fontWeight: 'bold', marginBottom: '12px', color: '#333', fontSize: '14px'}}>
              Custom Material Parameters
            </div>

            <div style={{marginBottom: '10px'}}>
              <label style={{fontSize: '12px', color: '#666', display: 'block', marginBottom: '4px'}}>
                Material Type (Short Name)
              </label>
              <input
                type="text"
                value={inProfile.materialType || ''}
                onChange={(e) => setInProfile({...inProfile, materialType: e.target.value})}
                placeholder="e.g., CustomSteel"
                style={{
                  width: '250px',
                  padding: '8px',
                  border: '1px solid #ddd',
                  borderRadius: '4px',
                  fontSize: '14px'
                }}
              />
            </div>

            <div style={{fontWeight: 'bold', marginTop: '15px', marginBottom: '8px', color: '#555', fontSize: '13px'}}>
              Flow Stress Model Parameters:
            </div>

            <div style={{display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px'}}>
              <InputField
                label="A"
                type="number"
                value={inProfile.flowStressParams?.a || 0}
                onChange={(value) => setInProfile({
                  ...inProfile,
                  flowStressParams: {...inProfile.flowStressParams, a: value}
                })}
              />
              <InputField
                label="m1"
                type="number"
                value={inProfile.flowStressParams?.m1 || 0}
                onChange={(value) => setInProfile({
                  ...inProfile,
                  flowStressParams: {...inProfile.flowStressParams, m1: value}
                })}
              />
              <InputField
                label="m2"
                type="number"
                value={inProfile.flowStressParams?.m2 || 0}
                onChange={(value) => setInProfile({
                  ...inProfile,
                  flowStressParams: {...inProfile.flowStressParams, m2: value}
                })}
              />
              <InputField
                label="m3"
                type="number"
                value={inProfile.flowStressParams?.m3 || 0}
                onChange={(value) => setInProfile({
                  ...inProfile,
                  flowStressParams: {...inProfile.flowStressParams, m3: value}
                })}
              />
              <InputField
                label="m4"
                type="number"
                value={inProfile.flowStressParams?.m4 || 0}
                onChange={(value) => setInProfile({
                  ...inProfile,
                  flowStressParams: {...inProfile.flowStressParams, m4: value}
                })}
              />
              <InputField
                label="m5"
                type="number"
                value={inProfile.flowStressParams?.m5 || 0}
                onChange={(value) => setInProfile({
                  ...inProfile,
                  flowStressParams: {...inProfile.flowStressParams, m5: value}
                })}
              />
              <InputField
                label="m6"
                type="number"
                value={inProfile.flowStressParams?.m6 || 0}
                onChange={(value) => setInProfile({
                  ...inProfile,
                  flowStressParams: {...inProfile.flowStressParams, m6: value}
                })}
              />
              <InputField
                label="m7"
                type="number"
                value={inProfile.flowStressParams?.m7 || 0}
                onChange={(value) => setInProfile({
                  ...inProfile,
                  flowStressParams: {...inProfile.flowStressParams, m7: value}
                })}
              />
              <InputField
                label="m8"
                type="number"
                value={inProfile.flowStressParams?.m8 || 0}
                onChange={(value) => setInProfile({
                  ...inProfile,
                  flowStressParams: {...inProfile.flowStressParams, m8: value}
                })}
              />
              <InputField
                label="m9"
                type="number"
                value={inProfile.flowStressParams?.m9 || 0}
                onChange={(value) => setInProfile({
                  ...inProfile,
                  flowStressParams: {...inProfile.flowStressParams, m9: value}
                })}
              />
              <InputField
                label="Base Strain"
                type="number"
                value={inProfile.flowStressParams?.baseStrain || 0.1}
                onChange={(value) => setInProfile({
                  ...inProfile,
                  flowStressParams: {...inProfile.flowStressParams, baseStrain: value}
                })}
              />
              <InputField
                label="Base Strain Rate"
                type="number"
                value={inProfile.flowStressParams?.baseStrainRate || 0.1}
                onChange={(value) => setInProfile({
                  ...inProfile,
                  flowStressParams: {...inProfile.flowStressParams, baseStrainRate: value}
                })}
              />
            </div>
          </div>
        </>
      )}
    </>
  );
}