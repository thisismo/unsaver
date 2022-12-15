import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { Collection, collectionIterator, getCollections } from "./endpoints";
import CollectionsScreen from "./screens/CollectionsScreen";
import SelectionScreen from "./screens/SelectionScreen";

const generator = collectionIterator(getCollections);

const Popup = () => {
  const [collections, setCollections] = useState<Collection[]>([]);
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);
  const [isFetching, setIsFetching] = useState(false);

  useEffect(() => {
    fetchCollections();
  }, []);

  const fetchCollections = async () => {
    setIsFetching(true);
    const response = await generator.next();
    if (response.done) return;
    setCollections([...collections, ...response.value]);
    setIsFetching(false);
  };

  const handleScroll = (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
    const target = e.target as HTMLDivElement;
    if (isFetching) return;
    if (target.scrollTop + target.clientHeight < target.scrollHeight * 4 / 5) return;

    fetchCollections();
  }

  return (
    <>
      {
        selectedCollection === null && <CollectionsScreen onScroll={handleScroll} collections={collections} onSelectedCollectionChange={(collection: Collection) => {
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
