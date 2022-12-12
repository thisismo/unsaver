import React from 'react';
import { Collection } from '../endpoints';

type Props = {
    collectionInfo: Collection;
    onClick?: () => void;
}

export default function CollectionTile({ collectionInfo, onClick }: Props) {
    return (
        <div onClick={onClick} style={{
            display: "grid",
            gridTemplateColumns: "repeat(2, 1fr)",
        }}>
            {
                collectionInfo.cover_media_list.map((media) => (
                    <img style={{
                        maxWidth: "100%",
                        maxHeight: "100%"
                    }} src={media.image_versions2.candidates[3].url} crossOrigin="anonymous" decoding="auto" />
                ))
            }
        </div>
    );
}