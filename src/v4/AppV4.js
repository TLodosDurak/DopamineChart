import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import ActivityIcon from './ActivityIcon';
import { ReactComponent as MealIcon } from './meal-svgrepo-com.svg'; // Import the SVG icon

const baseline = 100;
const activities = {
  meal: { change: 15, peakDuration: 50, halfDuration: 50, quarterDuration: 50, icon: <MealIcon /> },
  snack: { change: 5, peakDuration: 25, halfDuration: 25, quarterDuration: 25, icon: <MealIcon /> },
  gym: { change: 30, peakDuration: 100, halfDuration: 120, quarterDuration: 80, icon: <MealIcon /> },
  lightExercise: { change: 10, peakDuration: 50, halfDuration: 50, quarterDuration: 30, icon: <MealIcon /> },
  friends: { change: 20, peakDuration: 100, halfDuration: 50, quarterDuration: 30, icon: <MealIcon /> },
  talk: { change: 15, peakDuration: 75, halfDuration: 50, quarterDuration: 15, icon: <MealIcon /> },
  instrument: { change: 25, peakDuration: 75, halfDuration: 75, quarterDuration: 30, icon: <MealIcon /> },
  book: { change: 10, peakDuration: 50, halfDuration: 40, quarterDuration: 30, icon: <MealIcon /> },
  task: { change: 20, peakDuration: 100, halfDuration: 60, quarterDuration: 30, icon: <MealIcon /> },
  praise: { change: 25, peakDuration: 75, halfDuration: 20, quarterDuration: 30, icon: <MealIcon /> },
  shower: { change: 5, peakDuration: 50, halfDuration: 50, quarterDuration: 25, icon: <MealIcon /> },
  cleaning: { change: 5, peakDuration: 50, halfDuration: 75, quarterDuration: 25, icon: <MealIcon /> },
  smoking: { change: 20, peakDuration: 75, halfDuration: 125, quarterDuration: 30, icon: <MealIcon /> },
  alcohol: { change: 15, peakDuration: 100, halfDuration: 90, quarterDuration: 30, icon: <MealIcon /> },
  sugar: { change: 10, peakDuration: 70, halfDuration: 60, quarterDuration: 20, icon: <MealIcon /> },
  drugs: { change: 30, peakDuration: 125, halfDuration: 200, quarterDuration: 75, icon: <MealIcon /> },
  stress: { change: -15, peakDuration: 75, halfDuration: 100, quarterDuration: 30, icon: <MealIcon /> },
  argue: { change: -20, peakDuration: 50, halfDuration: 100, quarterDuration: 15, icon: <MealIcon /> },
  bingeWatch: { change: 10, peakDuration: 100, halfDuration: 75, quarterDuration: 30, icon: <MealIcon /> },
  gaming: { change: 15, peakDuration: 150, halfDuration: 70, quarterDuration: 30, icon: <MealIcon /> },
};

const AppV4 = () => {
  const [events, setEvents] = useState([]);
  const [simulationTime, setSimulationTime] = useState(new Date().setHours(7, 0, 0, 0));
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [mode, setMode] = useState('full'); // 'full' or 'simulation'
  const svgRef = useRef(null);
  const width = window.innerWidth * 0.9;
  const height = window.innerHeight * 0.6;
  const margin = { top: 20, right: 30, bottom: 100, left: 30 };

  useEffect(() => {
    let interval;
    if (isPlaying) {
      interval = setInterval(() => {
        setSimulationTime((prevTime) => {
          const newTime = new Date(prevTime).getTime() + 5 * 60 * 1000 * speed;
          return new Date(newTime).getTime();
        });
      }, 1000);
    } else if (!isPlaying && interval) {
      clearInterval(interval);
    }
    return () => clearInterval(interval);
  }, [isPlaying, speed]);

  const addEvent = (activity, time) => {
    const newEvent = { time: new Date(time), activity };
    setEvents((prevEvents) => [...prevEvents, newEvent]);
  };

  const calculateDopamineLevels = (endTime) => {
    const data = [];
    const timeStart = new Date();
    timeStart.setHours(7, 0, 0, 0);
    const timeEnd = new Date(timeStart);
    timeEnd.setHours(24, 0, 0, 0);
    const timeIntervals = d3.timeMinute.range(timeStart, endTime || timeEnd, 5);

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
            dopamine += activity.change * (0.5 - 0.25 * d3.easeSinInOut(t)) - baseline * Math.sign(activity.change) * 0.15 * d3.easeSinInOut(t);
          }
        }
      });
      data.push({ time, dopamine });
    });

    return data;
  };

  const updateChart = () => {
    const data = mode === 'simulation' ? calculateDopamineLevels(simulationTime) : calculateDopamineLevels();
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
      .attr('stroke', '#4444EF')
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
          .attr('stroke', '#4444EF')
          .attr('stroke-width', 0.5);

        g.append('circle')
          .attr('cx', d => xScale(d.time))
          .attr('cy', height - margin.bottom + 40)
          .attr('r', 15)
          .attr('fill', '#4444EF')
          .call(d3.drag()
            .on('drag', function (event, d) {
              const coords = d3.pointer(event);
              const boundedX = Math.max(margin.left, Math.min(coords[0], width - margin.right));
              const newTime = xScale.invert(boundedX);
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
  }, [events, simulationTime, mode]);

  return (
    <div className="container max-w-6xl mx-auto p-4">
      <div className="flex justify-center">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-500 to-cyan-500 text-transparent bg-clip-text">
          Dopamine Baseline Chart
        </h1>
      </div>
      <div className="flex justify-center mb-4">
        <button className="mr-4" onClick={() => setMode(mode === 'full' ? 'simulation' : 'full')}>
          Switch to {mode === 'full' ? 'Simulation' : 'Full'} Mode
        </button>
        {mode === 'simulation' && (
          <>
            <button className="mr-4" onClick={() => setIsPlaying(!isPlaying)}>
              {isPlaying ? 'Stop' : 'Play'}
            </button>
            <button className="mr-4" onClick={() => setSpeed(prevSpeed => prevSpeed + 1)}>
              Speed Up
            </button>
            <button onClick={() => setSpeed(prevSpeed => Math.max(1, prevSpeed - 1))}>
              Slow Down
            </button>
            <div className="ml-4">
              <span>Current Time: {new Date(simulationTime).toLocaleTimeString()}</span>
            </div>
          </>
        )}
      </div>
      <div className="flex justify-center">
        <svg ref={svgRef} width={width} height={height}></svg>
      </div>
      <div className="max-w-2xl mx-auto bg-white rounded-lg justify-center mb-4 p-8 border-2 border-[#4444EF]">
        <h1 className="text-2xl font-bold text-start bg-gradient-to-r from-blue-500 to-cyan-500 text-transparent bg-clip-text box-border mb-4">
          Stimuli
        </h1>
        <div className='flex flex-wrap'>
            {Object.entries(activities).map(([label, activity]) => (
            <div key={label} className="flex flex-col items-center">
                <ActivityIcon
                label={label}
                activity={activity}
                onDrop={addEvent}
                />
                <span className="text-sm md:text-base">{label}</span>
            </div>
            ))}
        </div>    
        </div>
    </div>
  );
};

export default AppV4;

