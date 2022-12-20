import React, { useEffect, useState } from "react";
import ReactDOM from "react-dom";
import Button from "./components/Button";
import Tooltip from "./components/Tooltip";

export type AvailableOptions = {
  downloadMedia: boolean;
  includeThumbnails: boolean;
  waitTime: number;
};

export const defaultOptions: AvailableOptions = {
  downloadMedia: false,
  includeThumbnails: false,
  waitTime: 1000,
}

const labels: Record<keyof AvailableOptions, string> = {
  downloadMedia: "Download media",
  includeThumbnails: "Include thumbnails",
  waitTime: "Wait time (ms)",
};

const info: Record<keyof AvailableOptions, string> = {
  downloadMedia: "Download media before unsaving",
  includeThumbnails: "Include video thumbnails in the download",
  waitTime: "The time to wait between unsaving posts. Recommended: 1000ms (Instagram will temporarily block you if you unsave too fast)",
};

const Options = () => {
  const [options, setOptions] = useState<AvailableOptions>(defaultOptions);

  const [status, setStatus] = useState("");

  useEffect(() => {
    // Restores select box and checkbox state using the preferences
    // stored in chrome.storage.
    let mounted = true;
    chrome.storage.sync.get(
      options,
      (items) => {
        if (!mounted) return;
        setOptions(items as AvailableOptions);
      }
    );

    return () => {
      mounted = false;
    }
  }, []);

  const saveOptions = () => {
    // Saves options to chrome.storage.sync.
    chrome.storage.sync.set(
      options,
      () => {
        // Update status to let user know options were saved.
        setStatus("Options saved.");
        const id = setTimeout(() => {
          setStatus("");
        }, 1000);
        return () => clearTimeout(id);
      }
    );
  };

  return (
    <>
      <div style={{
        fontSize: "1rem",
        margin: "1rem",
      }}>
        <p>Options:</p>
        <div style={{
          margin: "1rem",
        }}>
          {
            Object.entries(options).map(([key, value]) => {
              if (typeof value === "number") {
                return (
                  <div key={key} style={{
                    display: "flex",
                    justifyItems: "left",
                    marginBottom: "0.5rem",
                    flexDirection: "column",
                    width: "fit-content",
                    marginLeft: 4
                  }}>
                    <Tooltip text={info[key as keyof AvailableOptions]}>
                      <label htmlFor={key}>{labels[key as keyof AvailableOptions]}:</label>
                    </Tooltip>
                    <input
                      type="number"
                      style={{ marginRight: "0.5rem", width: "60px" }}
                      value={value as number}
                      onChange={(e) => {
                        setOptions({
                          ...options,
                          [key]: parseInt(e.target.value),
                        });
                      }}
                    />
                  </div>
                );
              }

              return (
                <div key={key} style={{
                  display: "flex",
                  alignItems: "center",
                  marginBottom: "0.5rem",
                  width: "fit-content",
                }}>
                  <input
                    type="checkbox"
                    style={{ marginRight: "0.5rem" }}
                    checked={value as boolean}
                    onChange={(e) => {
                      setOptions({
                        ...options,
                        [key]: e.target.checked,
                      });
                    }}
                  />
                  <Tooltip text={info[key as keyof AvailableOptions]}>
                    <label htmlFor={key}>{labels[key as keyof AvailableOptions]}</label>
                  </Tooltip>
                </div>
              );
            })
          }
        </div>
        <div>{status}</div>
        <Button block onClick={saveOptions}>Save</Button>
      </div>
    </>
  );
};

ReactDOM.render(
  <React.StrictMode>
    <Options />
  </React.StrictMode>,
  document.getElementById("root")
);
