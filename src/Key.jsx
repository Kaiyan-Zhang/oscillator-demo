import React from "react";

const Key = ({ rightUpCornerTag, isActive, children }) => {
  return (
    <div
      style={{
        width: "60px",
        height: "120px",
        backgroundColor: isActive ? "#4CAF50" : "#f0f0f0",
        borderWidth: "1px",
        borderStyle: "solid",
        borderColor: isActive ? "#2E7D32" : "#ccc",
        borderRadius: "5px",
        cursor: "default",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative",
        transition: "all 0.2s ease",
      }}
    >
      <span
        style={{
          fontSize: "36px",
          fontWeight: "bold",
        }}
      >
        {children}
      </span>

      <span
        style={{
          position: "absolute",
          top: "5px",
          right: "5px",
          fontSize: "16px",
          color: "#666",
        }}
      >
        {rightUpCornerTag}
      </span>
    </div>
  );
};

export default Key;
