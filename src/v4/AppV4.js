import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import ActivityIcon from './ActivityIcon';

const baseline = 100;
const activities = {
  meal: { change: 15, duration: 3 },
  snack: { change: 5, duration: 2 },
  gym: { change: 30, duration: 4 },
  lightExercise: { change: 10, duration: 3 },
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
  const margin = { top: 20, right: 30, bottom: 50, left: 40 };

  const addEvent = (activity, time) => {
    const newEvent = { time: new Date(time), activity };
    setEvents((prevEvents) => [...prevEvents, newEvent]);
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
        if (time >= startTime && time <= endTime) {
          const t = (time - startTime) / (endTime - startTime);
          const easedT = d3.easeCubic(t);
          dopamine += activity.change * easedT;
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
      .append('g')
      .attr('class', 'event')
      .call(g => {
        g.append('line')
          .attr('x1', d => xScale(d.time))
          .attr('x2', d => xScale(d.time))
          .attr('y1', margin.top)
          .attr('y2', height - margin.bottom)
          .attr('stroke', 'red')
          .attr('stroke-width', 2);

        g.append('circle')
          .attr('cx', d => xScale(d.time))
          .attr('cy', height - margin.bottom + 20)
          .attr('r', 15)
          .attr('fill', 'red')
          .call(d3.drag()
            .on('drag', function (event, d) {
              const newTime = xScale.invert(d3.pointer(event)[0]);
              d3.select(this).attr('cx', xScale(newTime));
              d3.select(this.parentNode).select('line').attr('x1', xScale(newTime)).attr('x2', xScale(newTime));
              d.time = newTime;
              setEvents([...events]);
            })
          );

        g.append('text')
          .attr('x', d => xScale(d.time))
          .attr('y', height - margin.bottom + 25)
          .attr('text-anchor', 'middle')
          .attr('fill', 'white')
          .text(d => d.activity.label);
      });
  };

  useEffect(() => {
    updateChart();
  }, [events]);

  return (
    <div className="container max-w-6xl mx-auto p-4 ">
        <div className="max-w-2xl mx-auto bg-rose-200 rounded-lg flex justify-center mb-4 p-3 flex-wrap">
            {Object.entries(activities).map(([label, activity]) => (
            <ActivityIcon
                key={label}
                label={label}
                activity={activity}
                onDrop={addEvent}
            />
            ))}
        </div>
        <div className="flex justify-center">
            <svg ref={svgRef} width={width} height={height}></svg>
        </div>
    </div>
  );
};

export default AppV4;
