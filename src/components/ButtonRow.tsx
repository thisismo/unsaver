import React from "react";

type Props = {
    left?: React.ReactNode;
    center?: React.ReactNode;
    right?: React.ReactNode;
    children: React.ReactNode;
}

export default function ButtonRow({ left, center, right, children }: Props) {
    return (
        // Make center div take up all the space and align the left and right divs to the left and right
        <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr 1fr",
            alignItems: "center",
            gap: 10,
            margin: 10,
        }}>
            {left}
            {center}
            {right}
            {!left && !center && !right && children}
        </div>
    );
}