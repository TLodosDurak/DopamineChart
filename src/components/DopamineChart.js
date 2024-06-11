import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine, ReferenceArea } from 'recharts';

const DopamineChart = ({ data, markers, currentTime }) => {
  const currentDopamine = data.find((d) => d.time === currentTime)?.dopamine;
  const baseline = 100;

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis domain={[0, 250]} />
        <Tooltip />
        <Legend />
        <ReferenceArea x1="1 AM" x2="7 AM" strokeOpacity={0.3} />

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

export default DopamineChart;
