function generateData() {
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
  export default generateData;
