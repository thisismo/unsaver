import React from "react";

type Props = {
    children: React.ReactNode;
    text: string;
};

export default function Tooltip({ children, text }: Props) {
    const [hovered, setHovered] = React.useState(false);

    return (
        <div style={{
            position: "relative",
        }} onMouseEnter={() => setHovered(true)} onMouseLeave={() => setHovered(false)}>
            {children}
            <div>
                {
                    hovered && <div style={{
                        position: "fixed",
                        translate: "transform(-50%, 0)",
                        backgroundColor: "#000",
                        left: 0,
                        right: 0,
                        margin: "auto",
                        width: "fit-content",
                        color: "#fff",
                        padding: 8,
                        borderRadius: 4,
                        fontSize: 12,
                        pointerEvents: "none"
                    }}>
                        {text}
                    </div>
                }
            </div>
        </div>
    );
}