import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import CollectionTile from "./components/CollectionTile";
import Grid from "./components/Grid";
import Endpoints, { Collection } from "./endpoints";

enum Screen {
  ALL_COLLECTIONS,
  COLLECTION,
  UNSAVING,
  UNSAVED,
}

const endpoints = new Endpoints();

const Popup = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

  useEffect(() => {
    refreshCollections();
  }, []);

  const refreshCollections = async () => {
    const collections = await endpoints.getCollections();
    console.log("collections", collections);
    setCollections(collections.items);
  }

  if (collections.length === 0) return <div>Loading...</div>;

  return (
    <>
      <h1>Your collections</h1>
      <div style={{ minWidth: "400px" }}>
        <Grid>
          {
            collections.map((collection) => (
              <CollectionTile collectionInfo={collection} onClick={() => {
                setSelectedCollection(collection);
                alert(collection.collection_name);
              }}/>
            ))
          }
        </Grid>
      </div>
      <button onClick={() => refreshCollections}>
        refresh
      </button>
      <button>change background</button>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
