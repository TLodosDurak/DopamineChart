import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import './icon-wrapper.css';

const ActivityIcon = ({ label, activity, onDrop }) => {
  const iconRef = useRef(null);

  useEffect(() => {
    const drag = d3.drag()
      .on('end', (event) => {
        const svg = d3.select('svg');
        const coords = d3.pointer(event, svg.node());
        console.log('d3.pointer coordinates:', coords);
        console.log('d3.pointer(event) cord actual:', d3.pointer(event));
        console.log('d3.pointer(event, svg.node()):', d3.pointer(event, svg.node()));
        console.log('d3.pointer(event, window):', d3.pointer(event, window));
        const svgWidth = svg.node().getBoundingClientRect().width;
        const margin = { left: 30, right: 30 }; // match with AppV4 margin
        const timeScale = d3.scaleTime()
          .domain([new Date().setHours(7, 0, 0, 0), new Date().setHours(31, 0, 0, 0)])
          .range([margin.left, svgWidth - margin.right]);
        //x_cord has to be between margin.left and svgWidth - margin.right
        const x_cord = Math.min(Math.max(coords[0], margin.left), svgWidth - margin.right);
        const dropTime = timeScale.invert(x_cord);
        console.log('dropTime:', dropTime);
        onDrop(activity, dropTime);
      });

    d3.select(iconRef.current).call(drag);
  }, [activity, onDrop]);

  return (
    <div ref={iconRef} className="bg-[#4444EF] text-white text-center justify-center flex w-[40px] h-[40px] p-2 m-4 rounded-full cursor-pointer flex-shrink-0 hover:bg-[#4444AB] hover:shadow-md hover:scale-150 transition-all active:shadow-none active:bg-[#4444EF]">
      <div className="icon-wrapper">
        {activity.icon}
      </div>
    </div>
  );
};

export default ActivityIcon;
