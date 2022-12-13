import React from "react";

export type Props = {
    children: React.ReactNode;
    header?: React.ReactNode;
    footer?: React.ReactNode;
}

export default function ScreenContainer({children, header, footer}: Props) {
    return (
        <>
        {header}
        <div style={{ minWidth: "400px" }}>
            {children}
        </div>
        {footer}
        </>
    );
}