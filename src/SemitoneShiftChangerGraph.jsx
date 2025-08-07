import React from "react";

export const SemitoneShiftChangerGraph = () => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginBottom: "15px",
      fontFamily: "monospace",
    }}
  >
    <div
      style={{
        width: "40px",
        height: "40px",
        borderRadius: "50%",
        backgroundColor: "#f0f0f0",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        marginBottom: "5px",
        boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
        fontSize: "20px",
      }}
    >
      ↑
    </div>

    <div style={{ display: "flex", alignItems: "center", gap: "5px" }}>
      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          backgroundColor: "#f0f0f0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          fontSize: "20px",
        }}
      >
        ←
      </div>

      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          backgroundColor: "#f0f0f0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          fontSize: "20px",
        }}
      >
        ↓
      </div>

      <div
        style={{
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          backgroundColor: "#f0f0f0",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          boxShadow: "0 2px 4px rgba(0,0,0,0.1)",
          fontSize: "20px",
        }}
      >
        →
      </div>
    </div>

    <div style={{ marginTop: "10px", fontSize: "12px", color: "#666" }}>
      使用方向键调整半音
    </div>
  </div>
);
