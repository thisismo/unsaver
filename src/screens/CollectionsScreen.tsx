import React from 'react';
import CollectionTile from '../components/CollectionTile';
import Grid from '../components/Grid';
import { Collection } from '../endpoints';
import ScreenContainer from './ScreenContainer';

type Props = {
    collections: Collection[];
    onSelectedCollectionChange: (collection: Collection) => void;
}

export default function CollectionsScreen({ collections, onSelectedCollectionChange }: Props) {
    return (
        <ScreenContainer header={<h1>Your collections</h1>}>
            <>
                {
                    collections.length === 0 && <div>Loading...</div>
                }
                <Grid>
                    {
                        collections.map((collection) => (
                            <CollectionTile collectionInfo={collection} onClick={
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