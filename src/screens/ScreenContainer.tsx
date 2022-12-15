import React from "react";

export type Props = {
    children: React.ReactNode;
    header?: React.ReactNode;
    footer?: React.ReactNode;
    onScroll?: (e: React.UIEvent<HTMLDivElement, UIEvent>) => void;
}

export default function ScreenContainer({ children, header, footer, onScroll }: Props) {
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
            <div onScroll={onScroll} style={{ flex: 1, overflowX: "hidden", overflowY: "scroll", paddingLeft: "10px"}}>
                {children}
            </div>
            <div style={{ justifySelf: "flex-end" }}>
                {footer}
            </div>
        </div>
    );
}