import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import { SpinnerCircular } from "spinners-react";
import { useIdentity } from "./hooks/hooks";
import { Collection, collectionIterator, getCollections } from "./networking/endpoints";
import CollectionsScreen from "./screens/CollectionsScreen";
import LoginScreen from "./screens/LoginScreen";
import SelectionScreen from "./screens/SelectionScreen";

const Popup = () => {
  const [selectedCollection, setSelectedCollection] = useState<Collection | null>(null);

  const identity = useIdentity();

  console.log("identity", identity);

  if(identity === "") {
    return (
      <div style={{
        minWidth: "400px",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}>
        <SpinnerCircular color="#4065dd" style={{padding: "4rem"}}/>
      </div>
    )
  }

  if (identity === undefined) return (
    <LoginScreen />
  )

  return (
    <>
      {
        selectedCollection === null && <CollectionsScreen onCollectionSelected={(collection: Collection) => {
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
