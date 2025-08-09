import React from "react";

const RecordedNote = ({ fullNoteName, isHighlighted, isStartIndex, onClick }: {
  fullNoteName: string,
  isHighlighted: boolean,
  isStartIndex: boolean,
  onClick: () => void,
}) => {
  return (
    <button
      style={{
        padding: "8px 12px",
        margin: "4px",
        borderRadius: "4px",
        backgroundColor: isHighlighted ? "#ffcc00" : isStartIndex ? "#ff6600" : "#f0f0f0",
        borderColor: isHighlighted ? "#ff9900" : isStartIndex ? "#ff6600" : "#ccc",
        borderWidth: "1px",
        borderStyle: "solid",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
      onClick={onClick}
    >
      {fullNoteName}
    </button>
  );
};

export default RecordedNote;
