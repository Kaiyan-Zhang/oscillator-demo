import React, { useState, useEffect } from "react";

const SemitoneShiftChangerGraph = ({ semitoneShift }: { semitoneShift: number }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      marginBottom: "15px",
      fontFamily: "monospace",
    }}
  >
    <p style={{ marginBottom: "15px" }}>当前半音偏移: {semitoneShift}</p>
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


export const useSemitoneShift = () => {
  const [semitoneShift, setSemitoneShift] = useState<number>(0);
  
  useEffect(() => {
    const handleArrowKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowUp") {
        setSemitoneShift((prev) => prev + 1);
      } else if (e.key === "ArrowDown") {
        setSemitoneShift((prev) => prev - 1);
      } else if (e.key === "ArrowLeft") {
        setSemitoneShift((prev) => prev - 12);
      } else if (e.key === "ArrowRight") {
        setSemitoneShift((prev) => prev + 12);
      }
    };
    document.addEventListener("keydown", handleArrowKeyDown);
    return () => {
      document.removeEventListener("keydown", handleArrowKeyDown);
    };
  }, []);


  return {
    semitoneShift,
    semitoneShiftChangerGraph: <SemitoneShiftChangerGraph semitoneShift={semitoneShift} />,
  };
}
