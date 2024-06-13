import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, ReferenceArea } from 'recharts';

const ChartV4 = ({ data, markers, currentTime }) => {
  const currentDopamine = data.find((d) => d.time === currentTime)?.dopamine;
  const baseline = 100;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data.filter(d => d.visible)}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" interval={36} label={{ value: "Time", position: "insideBottomRight", offset: -5 }} />
        <YAxis domain={[60, 200]} label={{ value: "Dopamine Levels", angle: -90, position: 'insideLeft' }} />
        <Tooltip />
        <Legend />
        <ReferenceLine y={baseline} stroke="lightblue" label={{ position: 'insideRight', value: 'Baseline', fill: 'lightblue' }} />

        {markers.map((marker, index) => (
          <ReferenceLine key={index} x={marker} stroke="rgba(0,0,0,0.2)" />
        ))}
        <Line type="monotoneX" dataKey="dopamine" stroke="#8884d8" activeDot={{ r: 8 }} />
        {currentTime && (
          <ReferenceLine x={currentTime} stroke="red" label={{
            position: 'top',
            value: currentDopamine > baseline ? '😊' : '😟',
            fontSize: 24,
            fill: currentDopamine > baseline ? 'green' : 'red'
          }} />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ChartV4;
