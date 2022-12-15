import React, { useEffect } from "react";

type Props = {
    children: React.ReactNode;
    disabled?: boolean;
    onClick?: (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => void;
}

export default function Button({ onClick, children, disabled }: Props) {
    const [hovered, setHovered] = React.useState(false);
    const [pressed, setPressed] = React.useState(false);

    return (
        <button
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            onMouseDown={() => setPressed(true)}
            onMouseUp={() => setPressed(false)}
            onClick={(e) => {
                if (disabled !== true && onClick) {
                    onClick(e);
                }
            }} style={{
                ...{
                    borderRadius: 4,
                    padding: 12,
                    backgroundColor: !disabled ? "#4065dd" : "rgba(0, 0, 0, 0.12)",
                    color: "#fff",
                    border: "none",
                    cursor: !disabled ? "pointer" : "default",
                    fontWeight: "bold"
                }, ...(hovered && !disabled ? {
                    backgroundColor: "#466ef2"
                } : null),
                ...(pressed && !disabled ? {
                    backgroundColor: "#5279f9"
                } : null)
            }}>
            {children}
        </button>
    )
}