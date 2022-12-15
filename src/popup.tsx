import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Collection, collectionIterator, getCollections } from "./networking/endpoints";
import CollectionsScreen from "./screens/CollectionsScreen";
import SelectionScreen from "./screens/SelectionScreen";

const Popup = () => {
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

  return (
    <>
      {
        selectedCollection === null && <CollectionsScreen onSelectedCollection={(collection: Collection) => {
          setSelectedCollection(collection);
        }} />
      }
      {
        selectedCollection !== null && <SelectionScreen collection={selectedCollection} onBack={() => {
          setSelectedCollection(null);
        }} />
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
