// utilityV3.js

export const generateInitialData = () => {
    const data = [];
    let currentTime = new Date();
    currentTime.setHours(0, 0, 0, 0);
  
    for (let i = 0; i < 1440; i++) { // 1440 minutes in a day
      const timeString = currentTime.toTimeString().split(' ')[0].slice(0, 5); // HH:MM format
      data.push({ time: timeString, dopamine: 100 });
      currentTime.setMinutes(currentTime.getMinutes() + 1);
    }
  
    console.log('Initial data generated:', data);
    return data;
  };
  
  export const addEvent = (events, event) => {
    const newEvents = [...events, event];
    console.log('Events after adding new one:', newEvents);
    return newEvents;
  };
  
  export const calculateDopamineBatch = (data, events, currentTime) => {
    const updatedData = data.map(point => {
      const time = new Date(`1970-01-01T${point.time}:00`);
      const dopamine = calculateDopamine(time, events, currentTime);
      return { ...point, dopamine };
    });
    console.log('Updated data:', updatedData);
    return updatedData;
  };
  
  export const calculateDopamine = (currentTime, events, simulationTime) => {
    const baseline = 100;
    const dampingFactor = 0.1;
    let dopamine = baseline;
  
    events.forEach(event => {
      const { startTime, change, duration } = event;
      const elapsedSeconds = (simulationTime - startTime) / 1000;
      if (elapsedSeconds >= 0 && elapsedSeconds <= duration * 60) {
        const spike = change * Math.sin(0.1 * elapsedSeconds) * Math.exp(-dampingFactor * elapsedSeconds);
        dopamine += spike;
      }
    });
  
    console.log('Dopamine level at', currentTime, ':', dopamine);
    return dopamine;
  };
  
  export const getFormattedTime = (date) => {
    return date.toTimeString().split(' ')[0]; // HH:MM:SS format
  };
  
  export const getNextTime = (current, speed = 1) => {
    const newTime = new Date(current.getTime() + 1000 * speed * 60);
    return newTime;
  };
  