export const generateData = () => {
  const data = [];
  const times = [];

  let currentTime = new Date();
  currentTime.setHours(7, 0, 0, 0);

  for (let i = 0; i < 1440; i += 5) { // 1440 minutes in a day, 5-minute intervals
    const timeString = currentTime.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit', hour12: true });
    times.push(timeString);
    currentTime.setMinutes(currentTime.getMinutes() + 5);
  }

  times.forEach(time => {
    data.push({ time, dopamine: 100, visible: false });
  });

  return data;
};
