import React, { useEffect } from "react";
import Button from "../components/Button";
import ButtonRow from "../components/ButtonRow";
import Grid from "../components/Grid";
import HeaderRow from "../components/HeaderRow";
import MediaTile, { getMediaUrls } from "../components/MediaTile";
import { Collection, collectionIterator, doDownload, getAllSavedMedia, getCollectionMedia, Media, unsaveMedia, unsaveSelectedMedia } from "../networking/endpoints";
import { useCsrfToken, useIdentity } from "../hooks/hooks";
import ScreenContainer from "./ScreenContainer";
import { SpinnerCircular } from "spinners-react";

type Props = {
    collection: Collection;
    onBack?: () => void;
    onUnsave?: (unsaveGenerator: AsyncGenerator<number, number, unknown>, total: number) => void;
}

export type SelectionType = false | true | "ALL";

export default function SelectionScreen({ collection, onBack, onUnsave }: Props) {
    const [media, setMedia] = React.useState<Media[]>([]);
    const [selecting, setSelecting] = React.useState<SelectionType>(false);
    const [selectedMedia, setSelectedMedia] = React.useState<Media[]>([]);
    const [isFetching, setIsFetching] = React.useState(false);

    const csrfToken = useCsrfToken();

    const [generator, _] = React.useState(collectionIterator(
        collection.collection_id === "ALL_MEDIA_AUTO_COLLECTION" ?
            getAllSavedMedia : getCollectionMedia.bind(null, collection.collection_id)));

    useEffect(() => {
        fetchMedia();
    }, []);

    console.log("selectedMedia", selecting, selectedMedia);

    const fetchMedia = async () => {
        setIsFetching(true);
        const response = await generator.next();
        if (!response.done) {
            setMedia([...media, ...response.value]);
        }
        setIsFetching(false);
    };

    const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const target = e.target as HTMLDivElement;
        if (isFetching) return;
        if (target.scrollTop + target.clientHeight < target.scrollHeight * 4 / 5) return;

        fetchMedia();
    }

    const handleMediaClick = (media: Media) => {
        console.log("media clicked", media);
        if (!selecting) return;
        if (selectedMedia.includes(media)) {
            setSelectedMedia(selectedMedia.filter((m) => m !== media));
            return;
        }
        setSelectedMedia([...selectedMedia, media]);
    };

    const handleUnsave = async () => {
        const unsaveGenerator = unsaveSelectedMedia(selectedMedia, csrfToken ?? "", selecting === "ALL" ? collection.collection_id : undefined);

        onUnsave?.(unsaveGenerator, selecting === "ALL" ? collection.collection_media_count - selectedMedia.length : selectedMedia.length);
    };

    return (
        <ScreenContainer
            onScroll={handleScroll}
            header={
                <HeaderRow>
                    <svg onClick={onBack} style={{
                        cursor: "pointer",
                    }} xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" height="32" width="32" preserveAspectRatio="xMidYMid meet"><path d="M24 40 8 24 24 8l2.1 2.1-12.4 12.4H40v3H13.7l12.4 12.4Z" /></svg>
                    <h2>{collection.collection_name}</h2>
                </HeaderRow>
            } footer={
                <ButtonRow>
                    <Button disabled={media.length === 0} onClick={() => {
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
                            <Button disabled={media.length === 0} onClick={() => {
                                setSelecting(true);
                            }}>
                                Select
                            </Button>
                        )
                    }
                    <Button disabled={selectedMedia.length <= 0 && selecting !== "ALL"} onClick={handleUnsave}>
                        Unsave
                    </Button>
                </ButtonRow>
            }
        >
            <>
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
                                    selecting && <div>
                                        <svg xmlns="http://www.w3.org/2000/svg" height="48" width="48"><path fill="#fff" d="M18.9 35.7 7.7 24.5l2.15-2.15 9.05 9.05 19.2-19.2 2.15 2.15Z" /></svg>
                                    </div>
                                }
                            </MediaTile>
                        ))
                    }
                </Grid>
                {
                    isFetching || (!isFetching && media.length === 0) && <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "1rem",
                    }}>
                        {
                            isFetching && <SpinnerCircular color={"#4065dd"} />
                        }
                        {
                            !isFetching && media.length === 0 && <h3>No media found</h3>
                        }
                    </div>
                }
            </>
        </ScreenContainer>
    )
}