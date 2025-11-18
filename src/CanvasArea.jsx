// src/CanvasArea.jsx

import React, { useState, useRef, useEffect } from 'react';
import { Stage, Layer, Rect, Transformer, Group, Text } from 'react-konva';

// A more sophisticated color gradient
const getRealColor = (temp) => {
  const ambient = 20;
  const maxTemp = 30;
  const clampedTemp = Math.max(ambient, Math.min(temp, maxTemp));
  const percent = (clampedTemp - ambient) / (maxTemp - ambient);

  let r, g, b;
  if (percent < 0.5) {
    const p = percent * 2;
    r = Math.floor(0 + p * 255);
    g = Math.floor(0 + p * 255);
    b = Math.floor(255 - p * 255);
  } else {
    const p = (percent - 0.5) * 2;
    r = 255;
    g = Math.floor(255 - p * 255);
    b = 0;
  }
  return `rgb(${r}, ${g}, ${b})`;
};

// --- NEW AESTHETIC BLOCK COMPONENT ---
// This now has a "header" and "body" for a professional look
const Block = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = React.useRef();
  const trRef = React.useRef();

  React.useEffect(() => {
    if (isSelected) {
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  const { name, fill, width, height, ...restProps } = shapeProps;
  const headerHeight = 20; // Height of the title bar

  return (
    <React.Fragment>
      <Group
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...restProps} // Passes x, y
        draggable // <-- THE DRAG FIX IS HERE
        onDragEnd={(e) => {
          onChange({ ...shapeProps, x: e.target.x(), y: e.target.y() });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: Math.max(20, shapeProps.width * scaleX),
            height: Math.max(headerHeight + 10, shapeProps.height * scaleY),
          });
        }}
      >
        {/* Main Body (the color part) */}
        <Rect
          width={width}
          height={height}
          fill={fill}
          y={0}
          shadowBlur={isSelected ? 10 : 5}
          shadowColor="#000"
          shadowOpacity={0.3}
        />
        {/* Header Bar */}
        <Rect
          width={width}
          height={headerHeight}
          fill="#4A5568" // A dark gray
          stroke="#718096"
          strokeWidth={1}
        />
        {/* Text Label */}
        <Text
          text={name}
          fontFamily="Arial"
          fontSize={12}
          fill="#FFF"
          width={width}
          height={headerHeight}
          padding={5}
          align="left"
          verticalAlign="middle"
        />
      </Group>

      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            if (newBox.width < 20 || newBox.height < headerHeight + 10) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

// --- CanvasArea component ---
const CanvasArea = ({
  blocks,
  onUpdateBlock,
  onDeleteBlock,
  selectedId,
  setSelectedId,
  dragItemName,
}) => {
  const containerRef = useRef(null);
  const [stageSize, setStageSize] = useState({ width: 0, height: 0 });
  const stageRef = useRef(null);
  const blockCounter = useRef({});

  // Resize logic
  useEffect(() => {
    const checkResize = () => {
      if (containerRef.current) {
        setStageSize({
          width: containerRef.current.offsetWidth,
          height: containerRef.current.offsetHeight,
        });
      }
    };
    checkResize();
    window.addEventListener('resize', checkResize);
    return () => window.removeEventListener('resize', checkResize);
  }, []);

  const handleDragOver = (e) => e.preventDefault();

  // Drop logic (with unique names)
  const handleDrop = (e) => {
    e.preventDefault();
    if (!dragItemName.current) return;
    if (!stageRef.current) return;

    const baseName = dragItemName.current;
    const count = blockCounter.current[baseName] || 0;
    blockCounter.current[baseName] = count + 1;
    const newName = `${baseName}_${count}`;

    const stage = stageRef.current;
    const stageRect = stage.container().getBoundingClientRect();

    const pointerPosition = {
      x: e.clientX - stageRect.left,
      y: e.clientY - stageRect.top,
    };

    const newBlock = {
      id: `block_${Date.now()}`,
      name: newName,
      x: pointerPosition.x - 50,
      y: pointerPosition.y - 25,
      width: 150, // Let's make blocks bigger by default
      height: 100,
      dynamicLoad: 50,
      temperature: 20,
    };

    onUpdateBlock(newBlock);
    dragItemName.current = null;
  };

  // Delete key listener
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.key === 'Delete' || e.key === 'Backspace') && selectedId) {
        onDeleteBlock(selectedId);
        setSelectedId(null);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, onDeleteBlock, setSelectedId]);

  return (
    <div style={{ width: '100%', height: '100%' }} ref={containerRef}>
      <div
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        style={{ width: '100%', height: '100%' }}
      >
        <Stage
          ref={stageRef}
          width={stageSize.width}
          height={stageSize.height}
          onMouseDown={(e) => {
            const clickedOnEmpty = e.target === e.target.getStage();
            if (clickedOnEmpty) setSelectedId(null);
          }}
        >
          <Layer>
            {blocks.map((block) => (
              <Block
                key={block.id}
                shapeProps={{
                  id: block.id,
                  name: block.name,
                  x: block.x,
                  y: block.y, // <-- THE TYPO FIX IS HERE (was block.f)
                  width: block.width,
                  height: block.height,
                  dynamicLoad: block.dynamicLoad,
                  temperature: block.temperature,
                  fill: getRealColor(block.temperature || 20),
                }}
                isSelected={block.id === selectedId}
                onSelect={() => {
                  setSelectedId(block.id);
                }}
                onChange={(newAttrs) => {
                  onUpdateBlock(newAttrs);
                }}
              />
            ))}
          </Layer>
        </Stage>
      </div>
    </div>
  );
};

export default CanvasArea;