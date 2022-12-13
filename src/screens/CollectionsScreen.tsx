import React from 'react';
import CollectionTile from '../components/CollectionTile';
import Grid from '../components/Grid';
import HeaderRow from '../components/HeaderRow';
import { Collection } from '../endpoints';
import ScreenContainer from './ScreenContainer';

type Props = {
    collections: Collection[];
    onSelectedCollectionChange: (collection: Collection) => void;
}

export default function CollectionsScreen({ collections, onSelectedCollectionChange }: Props) {
    return (
        <ScreenContainer header={
            <HeaderRow left={<div></div>} center={<h1>Your collections</h1>}/>
        }>
            <>
                {
                    collections.length === 0 && <div>Loading...</div>
                }
                <Grid>
                    {
                        collections.map((collection) => (
                            <CollectionTile key={collection.collection_id} collectionInfo={collection} onClick={
                                () => {
                                    onSelectedCollectionChange(collection);
                                }
                            } />
                        ))
                    }
                </Grid>
            </>
        </ScreenContainer>
    );
}