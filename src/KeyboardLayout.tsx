import React from "react";
import Key from "./Key";
import { keyboardLayouts, isAlpha, EventKey } from "./utils/musicUtils";
 

export const KeyboardLayout = ({ activeEventKey }: { activeEventKey: Set<EventKey> }) => {
  return (
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      {keyboardLayouts.map((keys, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            alignItems: "center",
            marginLeft: `${index * 20}px`,
          }}
        >
          <div style={{ display: "flex", gap: "5px" }}>
            {keys.map((key, keyIndex) => (
              <React.Fragment key={key}>
                {keyIndex === 3 && <div style={{ width: "15px" }}></div>}
                <Key
                  rightUpCornerTag={keyIndex + 1}
                  isActive={activeEventKey.has(key)}
                >
                  {isAlpha(key) ? key.toUpperCase() : key}
                </Key>
              </React.Fragment>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};
