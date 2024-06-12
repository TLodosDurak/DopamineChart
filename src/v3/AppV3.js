// AppV3.js (modified)
import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import useTime from './useTime';
import { calculateDopamineBatch, addEvent, generateInitialData } from './utilityV3';
import {
    Chart,
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
  
Chart.register(
    LineController,
    LineElement,
    PointElement,
    LinearScale,
    CategoryScale,
    Title,
    Tooltip,
    Legend
);

const baseline = 100;
const activities = {
  meal: { change: 15, duration: 30 },
  snack: { change: 5, duration: 10 },
  gym: { change: 30, duration: 60 },
  lightExercise: { change: 10, duration: 20 },
  friends: { change: 20, duration: 45 },
  talk: { change: 15, duration: 30 },
  instrument: { change: 25, duration: 40 },
  book: { change: 10, duration: 30 },
  task: { change: 20, duration: 60 },
  praise: { change: 25, duration: 30 },
  shower: { change: 5, duration: 10 },
  cleaning: { change: 5, duration: 15 },
  smoking: { change: 20, duration: 15 },
  alcohol: { change: 15, duration: 30 },
  sugar: { change: 10, duration: 20 },
  drugs: { change: 30, duration: 60 },
  stress: { change: -15, duration: 30 },
  argue: { change: -20, duration: 20 },
  bingeWatch: { change: 10, duration: 60 },
  gaming: { change: 15, duration: 45 },
};

const initialData = generateInitialData();

const AppV3 = () => {
  const [data, setData] = useState(initialData);
  const [events, setEvents] = useState([]);
  const [currentTime, startSimulation, stopSimulation] = useTime(new Date(0, 0, 0, 7, 0, 0), 1);

  const handleActivityClick = (activity) => {
    const startTime = currentTime;
    const newEvent = { startTime, ...activity };
    console.log('Adding event:', newEvent);
    setEvents((prevEvents) => addEvent(prevEvents, newEvent));
  };

  useEffect(() => {
    const updatedData = calculateDopamineBatch(data, events, currentTime);
    console.log('Updated data:', updatedData);
    setData(updatedData);
  }, [currentTime, events]);

  const chartData = {
    labels: data.map(point => point.time),
    datasets: [
      {
        label: 'Dopamine Level',
        data: data.map(point => point.dopamine),
        borderColor: 'lightblue',
        borderWidth: 2,
        pointRadius: 0,
        fill: false,
      },
    ],
  };

  console.log('Chart data:', chartData);

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-center mb-4">
        <button className="bg-green-500 text-white p-2 m-1 rounded" onClick={startSimulation}>
          Play
        </button>
        <button className="bg-red-500 text-white p-2 m-1 rounded" onClick={stopSimulation}>
          Stop
        </button>
      </div>
      <Line data={chartData} options={{ animation: false, scales: { x: { display: true, ticks: { maxTicksLimit: 24 } } } }} />
      <div className="flex flex-wrap justify-center mt-4">
        {Object.entries(activities).map(([label, activity]) => (
          <button key={label} className="bg-blue-500 text-white p-2 m-1 rounded" onClick={() => handleActivityClick(activity)}>
            {label}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AppV3;
