import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import ActivityIcon from './ActivityIcon';

const baseline = 100;
const activities = {
  meal: { change: 15, peakDuration: 50, halfDuration: 50, quarterDuration: 50 },
  snack: { change: 5, peakDuration: 25, halfDuration: 25, quarterDuration: 25 },
  gym: { change: 30, peakDuration: 100, halfDuration: 120, quarterDuration: 80 },
  lightExercise: { change: 10, peakDuration: 50, halfDuration: 50, quarterDuration: 30 },
  friends: { change: 20, peakDuration: 100, halfDuration: 50, quarterDuration: 30 },
  talk: { change: 15, peakDuration: 75, halfDuration: 50, quarterDuration: 15 },
  instrument: { change: 25, peakDuration: 75, halfDuration: 75, quarterDuration: 30 },
  book: { change: 10, peakDuration: 50, halfDuration: 40, quarterDuration: 30 },
  task: { change: 20, peakDuration: 100, halfDuration: 60, quarterDuration: 30 },
  praise: { change: 25, peakDuration: 75, halfDuration: 20, quarterDuration: 30 },
  shower: { change: 5, peakDuration: 50, halfDuration: 50, quarterDuration: 25 },
  cleaning: { change: 5, peakDuration: 50, halfDuration: 75, quarterDuration: 25 },
  smoking: { change: 20, peakDuration: 75, halfDuration: 125, quarterDuration: 30 },
  alcohol: { change: 15, peakDuration: 100, halfDuration: 90, quarterDuration: 30 },
  sugar: { change: 10, peakDuration: 70, halfDuration: 60, quarterDuration: 20 },
  drugs: { change: 30, peakDuration: 125, halfDuration: 200, quarterDuration: 75 },
  stress: { change: -15, peakDuration: 75, halfDuration: 100, quarterDuration: 30 },
  argue: { change: -20, peakDuration: 50, halfDuration: 100, quarterDuration: 15 },
  bingeWatch: { change: 10, peakDuration: 100, halfDuration: 75, quarterDuration: 30 },
  gaming: { change: 15, peakDuration: 150, halfDuration: 70, quarterDuration: 30 },
};

const AppV4 = () => {
  const [events, setEvents] = useState([]);
  const svgRef = useRef(null);
  const width = 800;
  const height = 400;
  const margin = { top: 20, right: 30, bottom: 100, left: 40 };

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
        const peakEndTime = new Date(startTime.getTime() + activity.peakDuration * 60 * 1000);
        const halfEndTime = new Date(peakEndTime.getTime() + activity.halfDuration * 60 * 1000);
        const quarterEndTime = new Date(halfEndTime.getTime() + activity.quarterDuration * 60 * 1000);

        if (time >= startTime && time <= quarterEndTime) {
          let t;
          if (time <= peakEndTime) {
            t = (time - startTime) / (peakEndTime - startTime);
            dopamine += activity.change * d3.easeQuadOut(t);
          } else if (time <= halfEndTime) {
            t = (time - peakEndTime) / (halfEndTime - peakEndTime);
            dopamine += activity.change * (1 - 0.5 * d3.easeCircleIn(t));
          } else if (time <= quarterEndTime) {
            t = (time - halfEndTime) / (quarterEndTime - halfEndTime);
            dopamine += activity.change * (0.5 - 0.25 * d3.easeSinInOut(t)) - baseline * 0.15 * d3.easeSinInOut(t);
          }
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
      .domain([50, 200])
      .range([height - margin.bottom, margin.top]);

    const line = d3.line()
      .x(d => xScale(d.time))
      .y(d => yScale(d.dopamine))
      .curve(d3.curveBasis);

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
      .attr('stroke-width', 3)
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
          .attr('stroke-width', 0.5);

        g.append('circle')
          .attr('cx', d => xScale(d.time))
          .attr('cy', height - margin.bottom + 40)
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
      <div className="flex justify-center">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-red-500 to-pink-500 text-transparent bg-clip-text">
          Dopamine Baseline Chart
        </h1>
      </div>
      <div className="flex justify-center">
        <svg ref={svgRef} width={width} height={height}></svg>
      </div>
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
    </div>
  );
};

export default AppV4;
