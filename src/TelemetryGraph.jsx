// src/TelemetryGraph.jsx
import React, { useState, useEffect } from 'react';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';

const TelemetryGraph = ({ temperature }) => {
  const [data, setData] = useState([]);

  // Every time the temperature changes (or at least every 1s), update the graph
  useEffect(() => {
    setData((currentData) => {
      // Create a new data point
      const newPoint = {
        time: new Date().toLocaleTimeString(),
        temp: temperature || 20, // Default to 20 if null
      };

      // Add new point to the end
      const newData = [...currentData, newPoint];

      // Keep only the last 30 data points (scrolling effect)
      if (newData.length > 30) {
        newData.shift(); // Remove the oldest point
      }

      return newData;
    });
  }, [temperature]); // Run this whenever 'temperature' prop changes

  return (
    <div style={{ width: '100%', height: 150, marginTop: '10px' }}>
      <ResponsiveContainer>
        <LineChart data={data}>
          {/* The Grid Lines */}
          <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
          
          {/* The X Axis (Hidden to look cleaner) */}
          <XAxis dataKey="time" hide />
          
          {/* The Y Axis (Temperature) */}
          <YAxis 
            domain={[20, 'auto']} // Start at 20c, auto-scale up
            stroke="#a0aec0" 
            fontSize={12} 
            width={30}
          />
          
          {/* The Hover Tooltip */}
          <Tooltip 
            contentStyle={{ backgroundColor: '#2d3748', border: 'none' }}
            labelStyle={{ color: '#a0aec0' }}
          />
          
          {/* The Line itself */}
          <Line
            type="monotone" // Makes the line smooth/curved
            dataKey="temp"
            stroke="#f56565" // Red line
            strokeWidth={2}
            dot={false} // Hide dots for a clean "heartbeat" look
            isAnimationActive={false} // Disable animation for instant real-time feel
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TelemetryGraph;