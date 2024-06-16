import React, { useState, useEffect, useRef } from 'react';
import * as d3 from 'd3';
import ActivityIcon from './ActivityIcon';
import { ReactComponent as MealIcon } from './meal-svgrepo-com.svg'; // Import the SVG icon
import ReactDOMServer from 'react-dom/server';
import './icon-wrapper.css';

const baseline = 100;
const activities = {
    meal: { label: 'Meal', change: 15, peakDuration: 50, halfDuration: 50, quarterDuration: 50, icon: <MealIcon /> },
    snack: { label: 'Snack', change: 5, peakDuration: 25, halfDuration: 25, quarterDuration: 25, icon: <MealIcon /> },
    gym: { label: 'Gym', change: 30, peakDuration: 100, halfDuration: 120, quarterDuration: 80, icon: <MealIcon /> },
    lightExercise: { label: 'Light Exercise', change: 10, peakDuration: 50, halfDuration: 50, quarterDuration: 30, icon: <MealIcon /> },
    friends: { label: 'Friends', change: 20, peakDuration: 100, halfDuration: 50, quarterDuration: 30, icon: <MealIcon /> },
    talk: { label: 'Talk', change: 15, peakDuration: 75, halfDuration: 50, quarterDuration: 15, icon: <MealIcon /> },
    instrument: { label: 'Instrument', change: 25, peakDuration: 75, halfDuration: 75, quarterDuration: 30, icon: <MealIcon /> },
    book: { label: 'Book', change: 10, peakDuration: 50, halfDuration: 40, quarterDuration: 30, icon: <MealIcon /> },
    task: { label: 'Task', change: 20, peakDuration: 100, halfDuration: 60, quarterDuration: 30, icon: <MealIcon /> },
    praise: { label: 'Praise', change: 25, peakDuration: 75, halfDuration: 20, quarterDuration: 30, icon: <MealIcon /> },
    shower: { label: 'Shower', change: 5, peakDuration: 50, halfDuration: 50, quarterDuration: 25, icon: <MealIcon /> },
    cleaning: { label: 'Cleaning', change: 5, peakDuration: 50, halfDuration: 75, quarterDuration: 25, icon: <MealIcon /> },
    smoking: { label: 'Smoking', change: 20, peakDuration: 75, halfDuration: 125, quarterDuration: 30, icon: <MealIcon /> },
    alcohol: { label: 'Alcohol', change: 15, peakDuration: 100, halfDuration: 90, quarterDuration: 30, icon: <MealIcon /> },
    sugar: { label: 'Sugar', change: 10, peakDuration: 70, halfDuration: 60, quarterDuration: 20, icon: <MealIcon /> },
    drugs: { label: 'Drugs', change: 30, peakDuration: 125, halfDuration: 200, quarterDuration: 75, icon: <MealIcon /> },
    stress: { label: 'Stress', change: -15, peakDuration: 75, halfDuration: 100, quarterDuration: 30, icon: <MealIcon /> },
    argue: { label: 'Argue', change: -20, peakDuration: 50, halfDuration: 100, quarterDuration: 15, icon: <MealIcon /> },
    bingeWatch: { label: 'Binge Watch', change: 10, peakDuration: 100, halfDuration: 75, quarterDuration: 30, icon: <MealIcon /> },
    gaming: { label: 'Gaming', change: 15, peakDuration: 150, halfDuration: 70, quarterDuration: 30, icon: <MealIcon /> },
  };
  

const AppV4 = () => {
  const [events, setEvents] = useState([]);
  const [simulationTime, setSimulationTime] = useState(new Date().setHours(7, 0, 0, 0));
  const [isPlaying, setIsPlaying] = useState(false);
  const [speed, setSpeed] = useState(1);
  const [mode, setMode] = useState('full'); // 'full' or 'simulation'
  const svgRef = useRef(null);
  const containerRef = useRef(null); // Reference to the parent container

  const updateDimensions = () => {
    const containerWidth = containerRef.current ? containerRef.current.offsetWidth * 0.9: window.innerWidth * 0.9;
    const containerHeight = containerWidth * 0.6; // Keep the aspect ratio consistent
    if(window.innerWidth >= 1024 && !containerRef.current){
        const largeContainerWidth = containerWidth * 3/5;
        const largeContainerHeight = largeContainerWidth * 0.6; // Keep the aspect ratio consistent
        return { width: largeContainerWidth, height: largeContainerHeight };
    }
    if (window.innerWidth <= 370) return { width: containerWidth, height: containerHeight * 1.2 };
    return { width: containerWidth, height: containerHeight };
  };

  const [dimensions, setDimensions] = useState(updateDimensions());
  const getTickInterval = () => {
    const width = window.innerWidth;
    if (width >= 768) return 2; // Medium screen
    if (width >= 350) return 3; // Small screen
    return 6; // x Small screen
  };
  const [tickInterval, setTickInterval] = useState(getTickInterval());


  const margin = { top: 20, right: 30, bottom: 100, left: 30 };

  useEffect(() => {
    const handleResize = () => {
      setDimensions(updateDimensions());
      setTickInterval(getTickInterval());
      updateChart();
    };

    window.addEventListener('resize', handleResize);

    // Trigger the resize handler manually on initial load
    handleResize();

    return () => window.removeEventListener('resize', handleResize);
  }, []);

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
    timeEnd.setHours(31, 0, 0, 0);
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
    
    // Create a single tooltip
    const tooltip = d3.select('body').selectAll('.tooltip').data([null]);
    const tooltipEnter = tooltip.enter().append('div').attr('class', 'tooltip').style('opacity', 0);
    tooltip.exit().remove();
    
    const mergedTooltip = tooltip.merge(tooltipEnter);
    
    const xScale = d3.scaleTime()
      .domain(d3.extent(data, d => d.time))
      .range([margin.left, dimensions.width - margin.right]);
    
    const yScale = d3.scaleLinear()
      .domain([50, 200])
      .range([dimensions.height - margin.bottom, margin.top]);
    
    const line = d3.line()
      .x(d => xScale(d.time))
      .y(d => yScale(d.dopamine))
      .curve(d3.curveBasis);
    
    svg.selectAll('*').remove();
    
    // Draw the main line chart
    svg.append('path')
      .datum(data)
      .attr('fill', 'none')
      .attr('stroke', '#4444EF')
      .attr('stroke-width', 3)
      .attr('d', line);
    
    // Draw the x-axis with thicker lines for each hour
    const tickValues = xScale.ticks(d3.timeHour.every(tickInterval));
    svg.append('g')
      .attr('transform', `translate(0,${dimensions.height - margin.bottom})`)
      .call(d3.axisBottom(xScale).ticks(tickValues.length).tickFormat(d3.timeFormat('%I %p')));
    
    // Add thin marks for each hour without labels
    const allHourTicks = xScale.ticks(d3.timeHour.every(1));
    allHourTicks.forEach(tick => {
      if (!tickValues.includes(tick)) {
        svg.append('line')
          .attr('x1', xScale(tick))
          .attr('x2', xScale(tick))
          .attr('y1', dimensions.height - margin.bottom)
          .attr('y2', dimensions.height - margin.bottom + 4)
          .attr('stroke', '#000000')
          .attr('stroke-width', 1);
      }
    });
    
    // Draw the y-axis
    svg.append('g')
      .attr('transform', `translate(${margin.left},0)`)
      .call(d3.axisLeft(yScale));
    
    // Draw the events with icons or text
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
          .attr('y2', dimensions.height - margin.bottom)
          .attr('stroke', '#4444EF')
          .attr('stroke-width', 0.5);
    
        const eventGroup = g.append('g')
          .attr('transform', d => `translate(${xScale(d.time)}, ${dimensions.height - margin.bottom + 40})`)
          .attr('justify-content', 'center')
          .call(d3.drag()
            .on('start', function (event, d) {
              d3.select(this).classed('dragging', true);
              mergedTooltip.style('opacity', 0);
            })
            .on('drag', function (event, d) {
              const coords = d3.pointer(event, svg.node());
              const boundedX = Math.max(margin.left, Math.min(coords[0], dimensions.width - margin.right));
              const newTime = xScale.invert(boundedX);
              d3.select(this).attr('transform', `translate(${xScale(newTime)}, ${dimensions.height - margin.bottom + 40})`);
              d3.select(this.parentNode).select('line').attr('x1', xScale(newTime)).attr('x2', xScale(newTime));
              d.time = newTime;
              setEvents([...events]);
            })
            .on('end', function () {
              d3.select(this).classed('dragging', false);
            })
          )
          .on('mouseenter', function (event, d) {
            d3.select(this).select('circle').attr('fill', '#4444AB');
            d3.select(this).classed('hovered', true);
    
            mergedTooltip.transition()
              .duration(200)
              .style('opacity', .9);
            mergedTooltip.html(d.activity.label)
              .style('left', (event.pageX + 5) + 'px')
              .style('top', (event.pageY - 28) + 'px');
          })
          .on('mouseleave', function () {
            const eventGroup = d3.select(this);
            if (!eventGroup.classed('dragging')) {
              eventGroup.select('circle').attr('fill', '#4444EF');
              eventGroup.classed('hovered', false);
            }
    
            mergedTooltip.transition()
              .duration(500)
              .style('opacity', 0);
          });
    
        eventGroup.append('circle')
          .attr('r', 15)
          .attr('fill', '#4444EF')
          .attr('border', 'solid')
          .attr('stroke', '#000000');

    
        eventGroup.append('foreignObject')
          .attr('x', -15)
          .attr('y', -15)
          .attr('width', 30)
          .attr('height', 30)
          .attr('class', 'justify-center items-center')
          .append('xhtml:div')
          .attr('class', 'event-icon-wrapper h-[30px] w-[30px] flex justify-center items-center')
          .html(d => ReactDOMServer.renderToString(d.activity.icon || <span>{d.activity.label}</span>));
    
        eventGroup.append('title')
          .text(d => d.activity.label);
      });
    };
  
  useEffect(() => {
    updateChart();
  }, [events, simulationTime, mode, dimensions]);

  return (
    <div className="container max-w-6xl mx-auto p-4 justify-center min-w-80 ">
      <div className="flex justify-center">
        <h1 className="text-3xl font-bold text-center bg-gradient-to-r from-blue-500 to-cyan-500 text-transparent bg-clip-text">
          Dopamine Baseline Chart
        </h1>
      </div>
      <div className="flex justify-center mb-4">
        <button className="mr-4" disabled onClick={() => setMode(mode === 'full' ? 'simulation' : 'full')}>
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
      <div className="lg:flex lg:justify-between">
        <div className="max-w-2xl mx-auto bg-white rounded-lg mb-4 p-8 border-2 border-[#4444EF] lg:w-2/5">
          <h1 className="text-2xl font-bold text-start bg-gradient-to-r from-blue-500 to-cyan-500 text-transparent bg-clip-text box-border mb-4">
            Stimuli
          </h1>
          <div className="flex flex-wrap justify-center align">
            {Object.entries(activities).map(([label, activity]) => (
              <div key={label} className="flex flex-col items-center">
                <ActivityIcon label={label} activity={activity} onDrop={addEvent} />
              </div>
            ))}
          </div>
        </div>
        <div ref={containerRef} className="lg:w-3/5 flex items-center justify-center">
          <svg id="main-svg" ref={svgRef} width={dimensions.width} height={dimensions.height}></svg>
        </div>
      </div>
    </div>
  );
};

export default AppV4;
