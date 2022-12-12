import React from 'react';

type Props = {
    children: React.ReactNode;
}

export default function Grid(props: Props) {
    //Image grid 3 columns x n rows
    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, 1fr)",
            justifyItems: "center",
            gridGap: "10px",
        }}>
            {props.children}
        </div>
    );
}