import React, { useState, useEffect, useRef } from 'react';
import DopamineChart from './components/DopamineChart';
import ActivityButton from './components/ActivityButton';
import generateData from './utility';

const baseline = 100;
const activities = {
  meal: 15,
  snack: 5,
  gym: 30,
  lightExercise: 10,
  friends: 20,
  talk: 15,
  instrument: 25,
  book: 10,
  task: 20,
  praise: 25,
  shower: 5,
  cleaning: 5,
  smoking: 20,
  alcohol: 15,
  sugar: 10,
  drugs: 30,
  stress: -15,
  argue: -20,
  bingeWatch: 10,
  gaming: 15,
};

const initialData = generateData();

const App = () => {
  const [data, setData] = useState(initialData);
  const [markers, setMarkers] = useState([]);
  const [running, setRunning] = useState(false);
  const [currentTime, setCurrentTime] = useState("7 AM");
  const intervalRef = useRef(null);

  const adjustDopamine = (current) => {
    const diff = baseline - current;
    const adjustment = diff * 0.1; // Increase for sharper attraction
    const newValue = current + adjustment;

    if (newValue > 200) return 200;
    if (newValue < 60) return 60;
    return newValue;
  };

  const handleActivityClick = (change) => {
    setMarkers((prevMarkers) => [...prevMarkers, currentTime]);
    setData((prevData) => {
      const newData = [...prevData];
      const index = newData.findIndex(entry => entry.time === currentTime);
      if (index !== -1) {
        const newDopamine = newData[index].dopamine + change;
        newData[index] = {
          ...newData[index],
          dopamine: newDopamine > 200 ? 200 : newDopamine < 60 ? 60 : newDopamine,
        };
      }
      return newData;
    });
  };

  const startSimulation = () => {
    setRunning(true);
    intervalRef.current = setInterval(() => {
      setCurrentTime((prevTime) => {
        const nextTime = getNextTime(prevTime);
        setData((prevData) => {
          const newData = [...prevData];
          const index = newData.findIndex(entry => entry.time === nextTime);
          if (index !== -1) {
            const newDopamine = adjustDopamine(newData[index].dopamine);
            newData[index] = { ...newData[index], dopamine: newDopamine };
          }

          if (nextTime === '7 AM') {
            return generateData();
          }

          return newData;
        });
        console.log(nextTime);
        return nextTime;
      });
    }, 1000); // Adjust time interval for faster progression
  };

  const stopSimulation = () => {
    setRunning(false);
    clearInterval(intervalRef.current);
  };

  const getNextTime = (current) => {
    const [hour, period] = current.split(' ');
    let nextHour = parseInt(hour);
    let nextPeriod = period;

    nextHour += 1;

    if (nextHour === 12) {
      nextPeriod = period === 'AM' ? 'PM' : 'AM';
    } else if (nextHour === 13) {
      nextHour = 1;
    }

    if (nextHour === 7 && nextPeriod === 'AM') {
      return '7 AM';
    }

    return `${nextHour} ${nextPeriod}`;
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return (
    <div className="container max-w-6xl mx-auto p-4">
      <div className="flex justify-center mb-4">
        <button className="bg-blue-400 text-white p-2 m-1 rounded border border-blue-500 hover:bg-blue-300 hover:shadow-md  transition-all active:shadow-none active:bg-blue-400" onClick={startSimulation} disabled={running}>
          Play
        </button>
        <button className="bg-blue-300 text-white p-2 m-1 rounded border border-gray-500 hover:bg-gray-300 hover:shadow-md  transition-all active:shadow-none active:bg-gray-400" onClick={stopSimulation} disabled={!running}>
          Stop
        </button>
        <div className="p-2 m-1 rounded bg-gray-200 w-[75px] flex-grow-0 text-center">
          {currentTime}
        </div>
      </div>
      <DopamineChart data={data} markers={markers} currentTime={currentTime} />
      <div className="flex flex-wrap justify-center mt-4 bg-slate-100 rounded-md p-3">
        {Object.entries(activities).map(([label, change]) => (
          <ActivityButton
            key={label}
            label={label}
            onClick={() => handleActivityClick(change)}
          />
        ))}
      </div>
    </div>
  );
};

export default App;
