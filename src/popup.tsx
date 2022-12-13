import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import CollectionTile from "./components/CollectionTile";
import Grid from "./components/Grid";
import Endpoints, { Collection } from "./endpoints";
import CollectionsScreen from "./screens/CollectionsScreen";
import SelectionScreen from "./screens/SelectionScreen";

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

  return (
    <>
      {
        selectedCollection === null && <CollectionsScreen collections={collections} onSelectedCollectionChange={(collection: Collection) => {
          setSelectedCollection(collection);
        }}/>
      }
      {
        selectedCollection !== null && <SelectionScreen collection={selectedCollection}/>
      }
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Popup />
  </React.StrictMode>,
  document.getElementById("root")
);
