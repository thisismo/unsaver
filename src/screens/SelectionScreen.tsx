import React, { useEffect } from "react";
import Grid from "../components/Grid";
import Endpoints, { Collection, Media } from "../endpoints";
import ScreenContainer from "./ScreenContainer";

type Props = {
    collection: Collection;
}

const endpoints = new Endpoints();

export default function SelectionScreen({ collection }: Props) {
    const [media, setMedia] = React.useState<Media[]>([]);

    useEffect(() => {
        fetchMedia();
    }, []);


    const fetchMedia = async () => {
        const response = await endpoints.getCollectionMedia(collection.collection_id);
        setMedia(response.items);
    };

    return (
        <ScreenContainer header={<h1>{collection.collection_name}</h1>}>
            <>
                {
                    media.length === 0 && <div>Loading...</div>
                }
                <Grid>
                    {
                        media.map((media) => (
                            <img style={{
                                maxWidth: "100%",
                                maxHeight: "100%"
                            }} src={media.media.image_versions2.candidates[3].url} crossOrigin="anonymous" decoding="auto" />
                        ))
                    }
                </Grid>
            </>
        </ScreenContainer>
    )
}