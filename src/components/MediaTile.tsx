import React from "react";
import { Media } from "../endpoints";

type Props = {
    media: Media;
    selected: boolean;
    children: React.ReactNode;
    onClick?: (media: Media) => void;
    qualityIndex?: number;
}

export type FileType = "JPG" | "MP4";

export const getMediaUrls = (media: Media, includeThumbnails = false): [string, FileType][] => {
    switch (media.media_type) {
        case 1:
            return getMediaUrlsFromImage(media);
        case 2:
            return getMediaUrlsFromVideo(media, includeThumbnails);
        case 8:
            return getMediaUrlsFromCarousel(media);
        default:
            throw new Error("Unknown media type");
    }
}

const getMediaUrlsFromImage = (media: Media): [string, "JPG"][] => {
    if (!("image_versions2" in media)) return [];

    return [[media.image_versions2.candidates[0].url, "JPG"]];
}

const getMediaUrlsFromVideo = (media: Media, includeThumbnails = false): [string, FileType][] => {
    if (!("video_versions" in media)) return [];

    return [[media.video_versions[0].url, "MP4"], ...(includeThumbnails ? getMediaUrlsFromImage(media) : [])];
}

const getMediaUrlsFromCarousel = (media: Media): [string, FileType][] => {
    if (!("carousel_media" in media)) return [];

    return media.carousel_media.map((m) => getMediaUrls(m)).flat();
}


export default function MediaTile({ media, selected, onClick, children, qualityIndex }: Props) {
    const [hovered, setHovered] = React.useState<boolean>(false);

    //No need to load all the images, just the first one
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
            }} src={imgVersions.candidates[0].url ?? getMediaUrls(media)[0]} crossOrigin="anonymous" decoding="auto"
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