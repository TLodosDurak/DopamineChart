import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import ActivityButton from '../components/ActivityButton';

const baseline = 100;
const activities = {
  meal: { change: 15, duration: 3 },
  snack: { change: 5, duration: 2 },
  gym: { change: 30, duration: 4 },
  lightExercise: { change: 10, duration: 30 },
  friends: { change: 20, duration: 4 },
  talk: { change: 15, duration: 3 },
  instrument: { change: 25, duration: 4 },
  book: { change: 10, duration: 3 },
  task: { change: 20, duration: 4 },
  praise: { change: 25, duration: 3 },
  shower: { change: 5, duration: 2 },
  cleaning: { change: 5, duration: 2 },
  smoking: { change: 20, duration: 3 },
  alcohol: { change: 15, duration: 3 },
  sugar: { change: 10, duration: 2 },
  drugs: { change: 30, duration: 4 },
  stress: { change: -15, duration: 3 },
  argue: { change: -20, duration: 3 },
  bingeWatch: { change: 10, duration: 4 },
  gaming: { change: 15, duration: 3 },
};

const AppV4 = () => {
  const [events, setEvents] = useState([]);
  const svgRef = useRef(null);
  const width = 800;
  const height = 400;
  const margin = { top: 20, right: 30, bottom: 30, left: 40 };

  const addEvent = (activity) => {
    const currentTime = new Date();
    currentTime.setHours(7, 0, 0, 0);
    const newEvent = { time: new Date(currentTime), activity };
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  const removeEvent = (index) => {
    setEvents((prevEvents) => prevEvents.filter((_, i) => i !== index));
  };

  const calculateDopamineLevels = () => {
    const data = [];
    const timeStart = new Date();
    timeStart.setHours(7, 0, 0, 0);
    const timeEnd = new Date(timeStart);
    timeEnd.setHours(24, 0, 0, 0);
    const timeIntervals = d3.timeMinute.range(timeStart, timeEnd, 5);

    timeIntervals.forEach((time) => {
      let dopamine = baseline;
      events.forEach(({ time: eventTime, activity }) => {
        const startTime = new Date(eventTime);
        const endTime = new Date(startTime.getTime() + activity.duration * 5 * 60 * 1000);
        if (time >= startTime && time < endTime) {
          dopamine += activity.change;
        }
      });
      data.push({ time, dopamine });
    });

    return data;
  };

  const updateChart = () => {
    const data = calculateDopamineLevels();
    const svg = d3.select(svgRef.current);

    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.time))
      .range([margin.left, width - margin.right]);

    const yScale = d3.scaleLinear()
      .domain([60, 200])
      .range([height - margin.bottom, margin.top]);

    const line = d3.line()
      .x(d => xScale(d.time))
      .y(d => yScale(d.dopamine))
      .curve(d3.curveMonotoneX);

    svg.selectAll('*').remove();

    svg.append('g')
      .attr('transform', `translate(0,${height - margin.bottom})`)
      .call(d3.axisBottom(xScale).ticks(d3.timeHour.every(3)).tickFormat(d3.timeFormat('%I %p')));

    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));

    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', 'steelblue')
      .attr('stroke-width', 1.5)
      .attr('d', line);

    svg.selectAll('.event')
      .data(events)
      .enter()
      .append('line')
      .attr('class', 'event')
      .attr('x1', d => xScale(d.time))
      .attr('x2', d => xScale(d.time))
      .attr('y1', margin.top)
      .attr('y2', height - margin.bottom)
      .attr('stroke', 'red')
      .attr('stroke-width', 2)
      .call(d3.drag()
        .on('drag', function (event, d) {
          const newTime = xScale.invert(d3.pointer(event)[0]);
          d3.select(this).attr('x1', xScale(newTime)).attr('x2', xScale(newTime));
          d.time = newTime;
          setEvents([...events]);
        })
      );
  };

  useEffect(() => {
    updateChart();
  }, [events]);

  return (
    <div className="container max-w-6xl mx-auto p-4">
      <div className="flex justify-center mb-4">
        {Object.entries(activities).map(([label, activity]) => (
          <ActivityButton
            key={label}
            label={label}
            onClick={() => addEvent(activity)}
          />
        ))}
      </div>
      <svg ref={svgRef} width={width} height={height}></svg>
    </div>
  );
};

export default AppV4;
