import React from "react";
import { Media } from "../endpoints";

type Props = {
    media: Media;
    selected: boolean;
    children: React.ReactNode;
    onClick?: (media: Media) => void;
    qualityIndex?: number;
}

export default function MediaTile({ media, selected, onClick, children, qualityIndex }: Props) {
    const [hovered, setHovered] = React.useState<boolean>(false);

    const imgVersions = "image_versions2" in media ? media["image_versions2"] : media["carousel_media"][0]["image_versions2"];

    return (
        <div onClick={onClick?.bind(null, media)}
            onMouseEnter={() => setHovered(true)}
            onMouseLeave={() => setHovered(false)}
            style={{
                position: "relative",
                cursor: "pointer",
                aspectRatio: "1/1",
                //Center the image
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
            }}>
            <img style={{
                maxWidth: "100%",
                maxHeight: "100%",
            }} src={(imgVersions.candidates[qualityIndex ?? 0].url) ?? "mo"} crossOrigin="anonymous" decoding="auto"
                key={media.id} />
            {
                (hovered || selected) && <div style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    bottom: 0,
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    color: "white",
                    textAlign: "center",
                    padding: 8,
                }}>
                    {children}
                </div>
            }
        </div>
    );
}