import React, { useContext, useEffect, useState } from 'react';
import { SpinnerCircular } from 'spinners-react';
import CollectionTile from '../components/CollectionTile';
import Grid from '../components/Grid';
import HeaderRow from '../components/HeaderRow';
import { Collection, collectionIterator, getCollections } from '../networking/endpoints';
import { UserContext } from '../popup';
import ScreenContainer from './ScreenContainer';

type Props = {
    onCollectionSelected: (collection: Collection) => void;
}

export default function CollectionsScreen({ onCollectionSelected: onSelectedCollection }: Props) {
    const [collections, setCollections] = useState<Collection[]>([]);
    const [isFetching, setIsFetching] = useState(false);
    const [generator, _] = React.useState(collectionIterator(getCollections));

    const userInfo = useContext(UserContext);

    useEffect(() => {
        fetchCollections();
    }, []);

    const fetchCollections = async () => {
        setIsFetching(true);
        const response = await generator.next();
        if (!response.done) {
            setCollections([...collections, ...response.value.filter((collection) => collection.collection_id !== "AUDIO_AUTO_COLLECTION")]);
        }
        setIsFetching(false);
    };

    const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
        const target = e.target as HTMLDivElement;
        if (isFetching) return;
        if (target.scrollTop + target.clientHeight < target.scrollHeight * 4 / 5) return;

        fetchCollections();
    }

    return (
        <ScreenContainer
            onScroll={handleScroll}
            header={
                <HeaderRow center={<h2>{userInfo?.userName}'s collections</h2>} />
            }
            footer={
                <div style={{
                    margin: "1.5rem",
                }}/>
            }>
            <>
                <Grid>
                    {
                        collections.map((collection) => (
                            <CollectionTile key={collection.collection_id} collectionInfo={collection} onClick={onSelectedCollection.bind(null, collection)} />
                        ))
                    }
                </Grid>
                {
                    isFetching && <div style={{
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        padding: "1rem"
                    }}>
                        <SpinnerCircular color={"#4065dd"} />
                    </div>
                }
            </>
        </ScreenContainer>
    );
}