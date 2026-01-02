import React from "react";
import InputField from "../InputField/InputField";

export default function BoxProfile({inProfile, setInProfile}) {
    return (
        <>
            <InputField
                label="Height"
                type="number"
                value={inProfile.height}
                onChange={(value) => setInProfile({...inProfile, height: value})}
            />
            <InputField
                label="Width"
                type="number"
                value={inProfile.width}
                onChange={(value) => setInProfile({...inProfile, width: value})}
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