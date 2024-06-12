export const generateData = () => {
    const data = [];
    const times = [
      ...Array.from({ length: 5 }, (_, i) => `${i + 7} AM`),
      '12 PM',
      ...Array.from({ length: 10 }, (_, i) => `${i + 1} PM`),
      '12 AM',
      ...Array.from({ length: 7 }, (_, i) => `${i + 1} AM`),
    ];

    times.forEach(time => {
      data.push({ time, dopamine: 100 });
    });

    return data;
  };

  export const getFormattedTime = (date) => {
    return date.toTimeString().split(' ')[0]; // HH:MM:SS format
  };
  
  export const getNextTime = (current, speed = 1) => {
    const newTime = new Date(current.getTime() + 1000 * speed);
    return newTime;
  };
  
  export const addEvent = (events, event) => {
    return [...events, event];
  };
  
  export const calculateDopamine = (baseDopamine, currentTime, events) => {
    let dopamine = baseDopamine;
    events.forEach(event => {
      const eventTime = new Date(event.startTime);
      const duration = event.duration * 60 * 1000; // Convert minutes to milliseconds
      const endTime = new Date(eventTime.getTime() + duration);
      if (currentTime >= eventTime && currentTime <= endTime) {
        dopamine += event.change;
      }
    });
    return dopamine;
  };
  
  export const generateData2 = () => {
    const data = [];
    let currentTime = new Date();
    currentTime.setHours(7, 0, 0, 0);
  
    for (let i = 0; i < 1440; i++) { // 1440 minutes in a day
      const timeString = currentTime.toTimeString().split(' ')[0].slice(0, 5);
      data.push({ time: timeString, dopamine: 100 });
      currentTime.setMinutes(currentTime.getMinutes() + 1);
    }
  
    return data;
  };

  export const generateInitialData = () => {
    const data = [];
    let currentTime = new Date();
    currentTime.setHours(0, 0, 0, 0);
  
    for (let i = 0; i < 86400; i++) { // 86400 seconds in a day
      const timeString = currentTime.toTimeString().split(' ')[0]; // HH:MM:SS format
      data.push({ time: timeString, dopamine: 100, visible: false });
      currentTime.setSeconds(currentTime.getSeconds() + 1);
    }
  
    return data;
  };