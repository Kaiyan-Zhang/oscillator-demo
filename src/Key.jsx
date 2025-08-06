import React from "react";

const Key = ({ keyValue, noteName, isActive, onPlay, onStop }) => {
  return (
    <button
      style={{
        width: "60px",
        height: "120px",
        backgroundColor: isActive ? "#4CAF50" : "#f0f0f0",
        border: isActive ? "3px solid #2E7D32" : "1px solid #ccc",
        borderRadius: "5px",
        cursor: "pointer",
        boxShadow: isActive
          ? "0 0 15px rgba(76, 175, 80, 0.7)"
          : "0 2px 4px rgba(0,0,0,0.1)",
        transform: isActive
          ? "scale(1.05) translateY(-3px)"
          : "scale(1) translateY(0)",
        transition: "all 0.2s ease-in-out",
        outline: "none",
        zIndex: isActive ? 1 : 0,
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        position: "relative", // 相对定位，用于放置右上角的级数
      }}
      onClick={onPlay}
      onMouseDown={onPlay}
      onMouseUp={onStop}
      onMouseLeave={onStop}
    >
      {/* 中央大字符 */}
      <span
        style={{
          fontSize: "36px",
          fontWeight: "bold",
        }}
      >
        {keyValue.toUpperCase()}
      </span>

      {/* 右上角小数字 */}
      <span
        style={{
          position: "absolute",
          top: "5px",
          right: "5px",
          fontSize: "16px",
          color: "#666",
        }}
      >
        {noteName}
      </span>
    </button>
  );
};

export default Key;
