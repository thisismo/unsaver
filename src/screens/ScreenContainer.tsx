import React from "react";

export type Props = {
    children: React.ReactNode;
    header?: React.ReactNode;
    footer?: React.ReactNode;
}

export default function ScreenContainer({ children, header, footer }: Props) {
    return (
        <div style={{
            display: "flex",
            flexDirection: "column",
            minWidth: "400px",
            maxHeight: "600px"
        }}>
            <div style={{ justifySelf: "flex-start" }}>
                {header}
            </div>
            <div style={{ flex: 1, overflowX: "hidden", overflowY: "scroll", paddingLeft: "10px"}}>
                {children}
            </div>
            <div style={{ justifySelf: "flex-end" }}>
                {footer}
            </div>
        </div>
    );
}