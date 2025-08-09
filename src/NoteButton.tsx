import React from "react";

const NoteButton = ({ fullNoteName, isHighlighted, onClick }: {
  fullNoteName: string,
  isHighlighted: boolean,
  onClick: () => void,
}) => {
  return (
    <button
      style={{
        padding: "8px 12px",
        margin: "4px",
        borderRadius: "4px",
        backgroundColor: isHighlighted ? "#ffcc00" : "#f0f0f0",
        border: isHighlighted ? "1px solid #ff9900" : "1px solid #ccc",
        fontWeight: isHighlighted ? "bold" : "normal",
        cursor: "pointer",
        transition: "all 0.2s ease",
      }}
      onClick={onClick}
    >
      {fullNoteName}
    </button>
  );
};

export default NoteButton;
