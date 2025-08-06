import React from 'react';

const Key = ({ keyValue, noteName, isActive, onPlay, onStop }) => {
  return (
    <button
      style={{
        width: '50px',  // 减小键宽度
        height: '100px', // 减小键高度
        fontSize: '16px',
        backgroundColor: isActive ? '#4CAF50' : '#f0f0f0',
        border: isActive ? '3px solid #2E7D32' : '1px solid #ccc',
        borderRadius: '5px',
        cursor: 'pointer',
        boxShadow: isActive
          ? '0 0 15px rgba(76, 175, 80, 0.7)' 
          : '0 2px 4px rgba(0,0,0,0.1)',
        transform: isActive
          ? 'scale(1.05) translateY(-3px)' // 略微减少上移距离
          : 'scale(1) translateY(0)',
        transition: 'all 0.2s ease-in-out',
        outline: 'none',
        zIndex: isActive ? 1 : 0,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}
      onClick={onPlay}
      onMouseDown={onPlay}
      onMouseUp={onStop}
      onMouseLeave={onStop}
    >
      {keyValue}
      <br />
      {noteName}
    </button>
  );
};

export default Key;