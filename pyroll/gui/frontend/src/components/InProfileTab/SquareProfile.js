import React from "react";
import InputField from "./InputField";

export default function SquareProfile({ inProfile, setInProfile }) {
  return (
    <>
      <InputField
        label="Side (mm)"
        type="number"
        value={inProfile.side || 0}
        onChange={(value) => setInProfile({...inProfile, side: value})}
      />
      <InputField
        label="Corner Radius (mm)"
        type="number"
        value={inProfile.corner_radius || 0}
        onChange={(value) => setInProfile({...inProfile, corner_radius: value})}
      />
    </>
  );
}