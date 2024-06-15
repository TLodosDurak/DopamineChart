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
        const svgWidth = svg.node().getBoundingClientRect().width;
        const margin = { left: 30, right: 30 }; // match with AppV4 margin
        const timeScale = d3.scaleTime()
          .domain([new Date().setHours(7, 0, 0, 0), new Date().setHours(31, 0, 0, 0)])
          .range([margin.left, svgWidth - margin.right]);
        const x_cord = Math.min(Math.max(coords[0], margin.left), svgWidth - margin.right);
        const dropTime = timeScale.invert(x_cord);
        onDrop(activity, dropTime);
      });

    d3.select(iconRef.current).call(drag);
  }, [activity, onDrop]);

  return (
    <div ref={iconRef} className="bg-[#4444EF] text-black text-center justify-center flex-col w-[40px] h-[40px] p-2 m-4 rounded-full cursor-pointer flex-shrink-0 hover:bg-[#4444AB] hover:shadow-md hover:scale-150 transition-all active:shadow-none active:bg-[#4444EF]">
      <div className="icon-wrapper mb-2">
        {activity.icon}
      </div>
      <div className=" justify-center flex leading-3">
        {activity.label}
      </div>

    </div>
  );
};

export default ActivityIcon;
