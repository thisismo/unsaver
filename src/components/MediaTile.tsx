import React from "react";
import { Media, MediaInfo } from "../networking/endpoints";

type Props = {
    media: Media;
    selected: boolean;
    children: React.ReactNode;
    onClick?: (media: Media) => void;
    qualityIndex?: number;
}

export type FileType = "JPG" | "MP4";

export const getMediaUrls = (media: Media, includeThumbnails = false): [MediaInfo[], FileType][] => {
    switch (media.media_type) {
        case 1:
            return [getMediaInfoForImage(media)];
        case 2:
            return getMediaInfoForVideo(media, includeThumbnails);
        case 8:
            return getMediaInfoForCarousel(media);
        default:
            throw new Error("Unknown media type");
    }
}

const getMediaInfoForImage = (media: Media): [MediaInfo[], "JPG"] => {
    if (!("image_versions2" in media)) throw new Error("Media is not an image");
    
    return [media.image_versions2.candidates, "JPG"];
}

const getMediaInfoForVideo = (media: Media, includeThumbnails = false): [MediaInfo[], FileType][] => {
    if (!("video_versions" in media)) throw new Error("Media is not a video");

    return [[media.video_versions, "MP4"], ...(includeThumbnails ? [getMediaInfoForImage(media)] : [])];
}

const getMediaInfoForCarousel = (media: Media): [MediaInfo[], FileType][] => {
    if (!("carousel_media" in media)) return [];

    return media.carousel_media.map((m) => getMediaUrls(m)).flat();
}

export const getThumbnailUrl = (media: Media): string => {
    let possibleThumbnails: MediaInfo[] = [];
    switch (media.media_type) {
        case 1:
        case 2:
            possibleThumbnails = getMediaInfoForImage(media)[0];
            break;
        case 8:
            if ("carousel_media" in media) {
                possibleThumbnails = getMediaInfoForImage(media.carousel_media[0])[0];
            } else if ("image_versions2" in media) {
                possibleThumbnails = getMediaInfoForImage(media)[0];
            }
    }

    return possibleThumbnails[possibleThumbnails.length - 1].url;
}

export default function MediaTile({ media, selected, onClick, children, qualityIndex }: Props) {
    const [hovered, setHovered] = React.useState<boolean>(false);

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
            }} src={getThumbnailUrl(media)} crossOrigin="anonymous" decoding="auto"
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