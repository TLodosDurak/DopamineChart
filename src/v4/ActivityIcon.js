import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';

const ActivityIcon = ({ label, activity, onDrop }) => {
  const iconRef = useRef(null);

  useEffect(() => {
    const drag = d3.drag()
      .on('end', (event) => {
        const svg = d3.select('svg');
        const coords = d3.pointer(event, svg.node());
        const timeScale = d3.scaleTime()
          .domain([new Date().setHours(7, 0, 0, 0), new Date().setHours(24, 0, 0, 0)])
          .range([0, 800]); // Update range based on your chart width

        const dropTime = timeScale.invert(coords[0]);
        onDrop(activity, dropTime);
      });

    d3.select(iconRef.current).call(drag);
  }, [activity, onDrop]);

  return (
    <div ref={iconRef} className="bg-red-500 text-white text-center justify-center flex w-[40px] h-[40px] p-2 m-2 rounded-full cursor-pointer flex-shrink-0 *
                                     hover:bg-red-700 hover:shadow-md hover:scale-150 transition-all active:shadow-none active:bg-red-500">
      {label}
    </div>
  );
};

export default ActivityIcon;
