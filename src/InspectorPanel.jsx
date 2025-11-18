// src/InspectorPanel.jsx
import React from 'react';
import TelemetryGraph from './TelemetryGraph.jsx';

// --- MODIFIED: Now receives 'onDeleteBlock' ---
const InspectorPanel = ({ blocks, onUpdateBlock, onDeleteBlock, selectedId }) => {
  const selectedBlock = blocks.find((block) => block.id === selectedId);

  const updateBlockProperty = (property, value) => {
    const updatedBlock = {
      id: selectedId,
      [property]: value,
    };
    onUpdateBlock(updatedBlock);
  };

  if (!selectedBlock) {
    return (
      <div className="inspector-panel">
        <h2>Inspector</h2>
        <p className="inspector-placeholder">
          Select a block to see its properties.
        </p>
      </div>
    );
  }

  return (
    <div className="inspector-panel">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '10px' }}>
        <h2 style={{ margin: 0 }}>{selectedBlock.name}</h2>
        {/* --- NEW: Delete Button --- */}
        <button
          onClick={() => onDeleteBlock(selectedId)}
          style={{
            background: '#e53e3e',
            border: 'none',
            color: 'white',
            padding: '4px 8px',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '0.7rem'
          }}
        >
          Delete
        </button>
      </div>

      <div className="form-control">
        <label>Block Name</label>
        <input
          type="text"
          value={selectedBlock.name}
          onChange={(e) => updateBlockProperty('name', e.target.value)}
        />
      </div>

      <div className="form-control">
        <label>Utilization: {selectedBlock.dynamicLoad}%</label>
        <input
          type="range"
          min="0"
          max="100"
          value={selectedBlock.dynamicLoad}
          onChange={(e) =>
            updateBlockProperty('dynamicLoad', parseInt(e.target.value, 10))
          }
        />
      </div>

      <div className="form-control">
        <label>Live Temperature</label>
        <p style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '5px 0' }}>
          {(selectedBlock.temperature || 20).toFixed(2)} °C
        </p>
      </div>

      <div className="form-control">
        <label>Thermal Telemetry (30s)</label>
        <TelemetryGraph temperature={selectedBlock.temperature} />
      </div>
    </div>
  );
};

export default InspectorPanel;