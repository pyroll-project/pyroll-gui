import React from "react";
import InputField from "./InputField";

export default function RoundProfile({inProfile, setInProfile}) {
    return (
        <InputField
            label="Diameter"
            type="number"
            value={inProfile.diameter}
            onChange={(value) => setInProfile({...inProfile, diameter: value})}
        />
    );
}