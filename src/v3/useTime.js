// useTime.js
import { useState, useRef, useEffect } from 'react';

const useTime = (initialTime, speed = 1) => {
  const [currentTime, setCurrentTime] = useState(initialTime);
  const intervalRef = useRef(null);

  const start = () => {
    if (!intervalRef.current) {
      console.log('Simulation started');
      intervalRef.current = setInterval(() => {
        setCurrentTime((prevTime) => {
          const newTime = new Date(prevTime.getTime() + 1000 * speed * 60);
          console.log('Current time:', newTime);
          return newTime;
        });
      }, 1000 * 60); // Update every minute
    }
  };

  const stop = () => {
    if (intervalRef.current) {
      console.log('Simulation stopped');
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
  }, []);

  return [currentTime, start, stop];
};

export default useTime;
