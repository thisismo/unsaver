import React, { useEffect } from "react";
import Button from "../components/Button";
import ButtonRow from "../components/ButtonRow";
import Grid from "../components/Grid";
import HeaderRow from "../components/HeaderRow";
import MediaTile, { getMediaUrls } from "../components/MediaTile";
import { Collection, getAllSavedMedia, getCollectionMedia, Media } from "../endpoints";
import { doDownload, useDownload } from "../hooks/useDownload";
import ScreenContainer from "./ScreenContainer";

type Props = {
    collection: Collection;
    onBack?: () => void;
}

export type SelectionType = false | true | "ALL";

const qualityIndex = 0;

export default function SelectionScreen({ collection, onBack }: Props) {
    const [media, setMedia] = React.useState<Media[]>([]);
    const [selecting, setSelecting] = React.useState<SelectionType>(false);
    const [selectedMedia, setSelectedMedia] = React.useState<Media[]>([]);

    useEffect(() => {
        fetchMedia();
    }, []);

    console.log("selectedMedia", selecting, selectedMedia);

    const fetchMedia = async () => {
        if (collection.collection_id === "AUDIO_AUTO_COLLECTION") {
            return;
        }
        if (collection.collection_id === "ALL_MEDIA_AUTO_COLLECTION") {
            const response = await getAllSavedMedia();
            setMedia(response.items);
            return;
        }
        const response = await getCollectionMedia(collection.collection_id);
        setMedia(response.items);
    };

    const handleMediaClick = (media: Media) => {
        console.log("media clicked", media);
        if(!selecting) return;
        if (selectedMedia.includes(media)) {
            setSelectedMedia(selectedMedia.filter((m) => m !== media));
            return;
        }
        setSelectedMedia([...selectedMedia, media]);
    };

    return (
        <ScreenContainer header={
            <HeaderRow>
                <svg onClick={onBack} style={{
                    cursor: "pointer",
                }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" height="32" width="32" preserveAspectRatio="xMidYMid meet"><path d="M24 40 8 24 24 8l2.1 2.1-12.4 12.4H40v3H13.7l12.4 12.4Z" /></svg>
                <h1>{collection.collection_name}</h1>
            </HeaderRow>
        } footer={
            <ButtonRow>
                <Button onClick={() => {
                    setSelecting("ALL");
                }}>
                    Select All
                </Button>
                {
                    selecting ? (
                        <Button onClick={() => {
                            setSelecting(false);
                            setSelectedMedia([]);
                        }}>
                            Cancel
                        </Button>
                    ) : (
                        <Button onClick={() => {
                            setSelecting(true);
                        }}>
                            Select
                        </Button>
                    )
                }
                <Button disabled>
                    Unsave
                </Button>
            </ButtonRow>
        }
        >
            <>
                {
                    media.length === 0 && <div>Loading...</div>
                }
                <Grid>
                    {
                        media.map((media) => (
                            <MediaTile
                                key={media.id}
                                media={media}
                                onClick={handleMediaClick}
                                selected={selecting === "ALL" && !selectedMedia.includes(media) || selecting !== "ALL" && selectedMedia.includes(media)}>
                                {
                                    !selecting && <div style={{
                                        display: "flex",
                                        justifyContent: "center",
                                        alignItems: "center",
                                        flexDirection: "column",
                                        height: "100%",
                                    }}
                                    onClick={() => {
                                        window.open(`https://www.instagram.com/p/${media.code}`)
                                    }}>
                                        <h3>View on IG</h3>
                                        <Button onClick={(e) => {
                                            e.stopPropagation();
                                            doDownload(media);
                                        }}>
                                            Download
                                        </Button>
                                    </div>
                                }
                                {
                                    selecting && <h3>
                                        I am selected
                                    </h3>
                                }
                            </MediaTile>
                        ))
                    }
                </Grid>
            </>
        </ScreenContainer>
    )
}