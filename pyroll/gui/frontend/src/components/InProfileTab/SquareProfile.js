import React from "react";
import InputField from "./InputField";

export default function SquareProfile({inProfile, setInProfile}) {
    return (
        <>
            <InputField
                label="Side Length"
                type="number"
                value={inProfile.side}
                onChange={(value) => setInProfile({...inProfile, side: value})}
            />
            <InputField
                label="Corner Radius"
                type="number"
                value={inProfile.corner_radius}
                onChange={(value) => setInProfile({...inProfile, corner_radius: value})}
            />
        </>
    );
}