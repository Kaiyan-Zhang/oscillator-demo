import React from "react";

const NoteButton = ({ note, isHighlighted, onClick, onContextMenu }) => {
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
      onContextMenu={(e) => {
        e.preventDefault();
        onContextMenu && onContextMenu();
      }}
    >
      {note}
    </button>
  );
};

export default NoteButton;
