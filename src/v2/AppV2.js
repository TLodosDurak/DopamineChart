import React, { useState, useEffect, useRef } from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';

const baseline = 100;
const events = []; // Array to hold events

const addEvent = (time, amplitude, frequency, decayRate) => {
  events.push({ time, amplitude, frequency, decayRate });
};

const calculateDopamine = (currentTime) => {
  let dopamine = baseline; // Baseline

  events.forEach(event => {
    const { time, amplitude, frequency, decayRate } = event;
    const elapsedTime = (currentTime - time) / 1000; // Convert ms to seconds
    if (elapsedTime >= 0) {
      dopamine += amplitude * Math.sin(frequency * elapsedTime) * Math.exp(-decayRate * elapsedTime);
    }
  });

  return dopamine;
};

const App = () => {
  const [data, setData] = useState([]);
  const [running, setRunning] = useState(false);
  const intervalRef = useRef(null);

  const startSimulation = () => {
    setRunning(true);
    const startTime = Date.now();
    intervalRef.current = setInterval(() => {
      const currentTime = Date.now();
      const elapsedSeconds = Math.floor((currentTime - startTime) / 1000);
      const newDopamine = calculateDopamine(currentTime);
      setData((prevData) => [...prevData, { time: elapsedSeconds, dopamine: newDopamine }]);
    }, 1000);
  };

  const stopSimulation = () => {
    setRunning(false);
    clearInterval(intervalRef.current);
  };

  const handleActivityClick = () => {
    const currentTime = Date.now();
    const amplitude = 50; // Example amplitude
    const frequency = 0.1; // Example frequency
    const decayRate = 0.05; // Example decay rate
    addEvent(currentTime, amplitude, frequency, decayRate);
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-center mb-4">
        <button className="bg-green-500 text-white p-2 m-1 rounded" onClick={startSimulation} disabled={running}>
          Play
        </button>
        <button className="bg-red-500 text-white p-2 m-1 rounded" onClick={stopSimulation} disabled={!running}>
          Stop
        </button>
        <button className="bg-blue-500 text-white p-2 m-1 rounded" onClick={handleActivityClick}>
          Add Event
        </button>
      </div>
      <ResponsiveContainer width="100%" height={400}>
        <LineChart data={data} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="time" />
          <YAxis domain={[0, 200]} />
          <Tooltip />
          <Line type="monotone" dataKey="dopamine" stroke="#8884d8" />
        </LineChart>
      </ResponsiveContainer>
    </div>
  );
};

export default App;
