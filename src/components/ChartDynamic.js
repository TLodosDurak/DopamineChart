import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ReferenceLine } from 'recharts';
import { getFormattedTime } from '../utility';

const ChartDynamic = ({ data, markers, events, currentTime }) => {
  const currentEntry = data.find(entry => entry.time === getFormattedTime(currentTime));

  return (
    <ResponsiveContainer width="100%" height={400}>
      <LineChart data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" ticks={data.filter((_, index) => index % 60 === 0).map(entry => entry.time)} />
        <YAxis domain={[0, 250]} />
        <Tooltip />
        <Legend />
        {events.map((event, index) => (
          <ReferenceLine key={index} x={getFormattedTime(new Date(event.startTime))} label={event.activity} stroke="blue" />
        ))}
        <Line type="monotoneX" dataKey="dopamine" stroke="#8884d8" />
        {currentEntry && (
          <ReferenceLine
            x={currentEntry.time}
            label={{ position: 'top', value: currentEntry.dopamine > 100 ? '😊' : '😢', fontSize: 24, fill: currentEntry.dopamine > 100 ? 'green' : 'red' }}
            stroke="transparent"
          />
        )}
      </LineChart>
    </ResponsiveContainer>
  );
};

export default ChartDynamic;
