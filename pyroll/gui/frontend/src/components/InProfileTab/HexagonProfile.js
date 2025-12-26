import React from "react";
import InputField from "./InputField";

export default function HexagonProfile({ inProfile, setInProfile }) {
  return (
    <>
      <InputField
        label="Side Length"
        type="number"
        value={inProfile.side || 0}
        onChange={(value) => setInProfile({...inProfile, side: value})}
      />
      <InputField
        label="Corner Radius"
        type="number"
        value={inProfile.corner_radius || 0}
        onChange={(value) => setInProfile({...inProfile, corner_radius: value})}
      />
    </>
  );
}