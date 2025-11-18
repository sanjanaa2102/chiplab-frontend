import React, { useState, useEffect, useRef } from 'react';
import socket from './socket.js';
import CanvasArea from './CanvasArea.jsx';
import InspectorPanel from './InspectorPanel.jsx';
import UserAccount from './UserAccount.jsx';

// --- Left Sidebar ---
function ComponentLibrary({ onDragStart }) {
  return (
    <div className="component-library">
      <h2>Components</h2>
      <div
        draggable="true"
        onDragStart={onDragStart}
        data-name="CPU Core"
        className="draggable-item"
        style={{ borderColor: '#3182ce' }}
      >
        CPU Core
      </div>
      <div
        draggable="true"
        onDragStart={onDragStart}
        data-name="L2 Cache"
        className="draggable-item"
        style={{ borderColor: '#63b3ed' }}
      >
        L2 Cache
      </div>
      <div
        draggable="true"
        onDragStart={onDragStart}
        data-name="GPU Core"
        className="draggable-item"
        style={{ borderColor: '#38a169' }}
      >
        GPU Core
      </div>
      <div
        draggable="true"
        onDragStart={onDragStart}
        data-name="NPU (AI)"
        className="draggable-item"
        style={{ borderColor: '#9f7aea' }}
      >
        NPU (AI)
      </div>
      <div
        draggable="true"
        onDragStart={onDragStart}
        data-name="Memory Ctrl"
        className="draggable-item"
        style={{ borderColor: '#f56565' }}
      >
        Memory Ctrl
      </div>
      <div
        draggable="true"
        onDragStart={onDragStart}
        data-name="ISP (Camera)"
        className="draggable-item"
        style={{ borderColor: '#ed8936' }}
      >
        ISP (Camera)
      </div>
      <div
        draggable="true"
        onDragStart={onDragStart}
        data-name="Video Codec"
        className="draggable-item"
        style={{ borderColor: '#ecc94b' }}
      >
        Video Codec
      </div>
      <div
        draggable="true"
        onDragStart={onDragStart}
        data-name="PCIe Ctrl"
        className="draggable-item"
        style={{ borderColor: '#718096' }}
      >
        PCIe Ctrl
      </div>
      <div
        draggable="true"
        onDragStart={onDragStart}
        data-name="Security"
        className="draggable-item"
        style={{ borderColor: '#a0aec0' }}
      >
        Security
      </div>
    </div>
  );
}

// --- Main App ---
function App() {
  const [blocks, setBlocks] = useState([]);
  const [selectedId, setSelectedId] = useState(null);
  const dragItemName = useRef(null);

  const handleDragStart = (e) => {
    dragItemName.current = e.currentTarget.getAttribute('data-name');
  };

  useEffect(() => {
    socket.on('blocks-updated', (serverBlocks) => {
      setBlocks(serverBlocks);
    });
    return () => {
      socket.off('blocks-updated');
    };
  }, []);

  const handleLocalBlockUpdate = (updatedBlock) => {
    setBlocks((currentBlocks) =>
      currentBlocks.map((block) =>
        block.id === updatedBlock.id
          ? { ...block, ...updatedBlock }
          : block
      )
    );
    socket.emit('block-updated', updatedBlock);
  };

  const updateBlockInServer = (updatedBlock) => {
    socket.emit('block-updated', updatedBlock);
  };

  const deleteBlockInServer = (blockId) => {
    socket.emit('block-deleted', blockId);
    setSelectedId(null);
  };

  const handleNewProject = () => {
    if (window.confirm("Are you sure you want to start a new project? This will clear the current canvas.")) {
      socket.emit('clear-canvas');
    }
  };

  return (
    <div className="app-container">
      <nav className="navbar">
        <div style={{ display: 'flex', gap: '20px', alignItems: 'center' }}>
          <div style={{ fontSize: '1.2rem' }}>ChipLab</div>
          <button 
            onClick={handleNewProject}
            style={{
              background: '#4a5568',
              border: '1px solid #718096',
              color: 'white',
              padding: '5px 10px',
              borderRadius: '4px',
              cursor: 'pointer',
              fontSize: '0.8rem'
            }}
          >
            + New Project
          </button>
        </div>
        <UserAccount />
      </nav>

      <div className="main-content">
        <ComponentLibrary onDragStart={handleDragStart} />
        
        <div className="canvas-area">
          <CanvasArea
            blocks={blocks}
            onUpdateBlock={updateBlockInServer}
            onDeleteBlock={deleteBlockInServer}
            selectedId={selectedId}
            setSelectedId={setSelectedId}
            dragItemName={dragItemName}
          />
        </div>
        <InspectorPanel
          blocks={blocks}
          onUpdateBlock={handleLocalBlockUpdate}
          selectedId={selectedId}
          onDeleteBlock={deleteBlockInServer}
        />
      </div>
    </div>
  );
}

export default App;