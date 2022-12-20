import React from "react";

type Props = {
    left?: React.ReactNode;
    center?: React.ReactNode;
    right?: React.ReactNode;
    children?: React.ReactNode;
}

export default function ButtonRow({ left, center, right, children }: Props) {
    return (
        // Make center div take up all the space and align the left and right divs to the left and right
        <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            alignItems: "center",
            gap: 10,
            margin: "1.5rem 10px",
            textAlign: "center",
        }}>
            {
                !children &&
                <>
                    {left || <div></div>}
                    {center || <div></div>}
                    {right || <div></div>}
                </>
            }
            {children}
        </div>
    );
}