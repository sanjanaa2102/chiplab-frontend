
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

 
  useEffect(() => {
    setData((currentData) => {
      
      const newPoint = {
        time: new Date().toLocaleTimeString(),
        temp: temperature || 20, 
      };

    
      const newData = [...currentData, newPoint];

      
      if (newData.length > 30) {
        newData.shift(); 
      }

      return newData;
    });
  }, [temperature]); 

  return (
    <div style={{ width: '100%', height: 150, marginTop: '10px' }}>
      <ResponsiveContainer>
        <LineChart data={data}>
         
          <CartesianGrid strokeDasharray="3 3" stroke="#4a5568" />
          
        
          <XAxis dataKey="time" hide />
          
     
          <YAxis 
            domain={[20, 'auto']} 
            stroke="#a0aec0" 
            fontSize={12} 
            width={30}
          />
          
         
          <Tooltip 
            contentStyle={{ backgroundColor: '#2d3748', border: 'none' }}
            labelStyle={{ color: '#a0aec0' }}
          />
          
       
          <Line
            type="monotone" 
            dataKey="temp"
            stroke="#f56565" 
            strokeWidth={2}
            dot={false} 
            isAnimationActive={false} 
          />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default TelemetryGraph;
