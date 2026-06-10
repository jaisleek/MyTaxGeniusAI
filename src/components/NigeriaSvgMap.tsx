import React, { useState, useRef, useEffect, useLayoutEffect } from 'react';
import Nigeria from '@svg-maps/nigeria';

interface Props {
  onStateClick: (stateName: string) => void;
}

export default function NigeriaSvgMap({ onStateClick }: Props) {
  const [hoveredState, setHoveredState] = useState<string | null>(null);
  const [labels, setLabels] = useState<{ id: string; x: number; y: number; name: string }[]>([]);
  const svgRef = useRef<SVGSVGElement>(null);

  useLayoutEffect(() => {
    if (svgRef.current) {
      const paths = svgRef.current.querySelectorAll('path');
      const newLabels: { id: string; x: number; y: number; name: string }[] = [];
      paths.forEach((path) => {
        const bbox = path.getBBox();
        newLabels.push({
          id: path.id,
          name: path.getAttribute('name') || '',
          x: bbox.x + bbox.width / 2,
          y: bbox.y + bbox.height / 2,
        });
      });
      setLabels(newLabels);
    }
  }, []);

  const handleLocationClick = (stateName: string) => {
    onStateClick(stateName);
  };

  const handleLocationMouseOver = (stateName: string) => {
    setHoveredState(stateName);
  };

  const handleLocationMouseOut = () => {
    setHoveredState(null);
  };

  return (
    <div className="w-full max-w-lg mx-auto relative cursor-pointer group">
      <div className="absolute top-0 right-0 p-2 bg-emerald-600 text-white rounded-lg text-sm font-bold shadow-md z-10 pointer-events-none transition-opacity">
        {hoveredState || 'Click to select a State'}
      </div>
      <svg
        ref={svgRef}
        viewBox={Nigeria.viewBox}
        className="w-full h-auto stroke-emerald-500 stroke-1 fill-slate-50 dark:stroke-emerald-600 dark:fill-slate-800 relative z-0 drop-shadow-md"
        aria-label={Nigeria.label}
      >
        {Nigeria.locations.map((location) => (
          <path
            key={location.id}
            id={location.id}
            name={location.name}
            d={location.path}
            onClick={() => handleLocationClick(location.name)}
            onMouseOver={() => handleLocationMouseOver(location.name)}
            onMouseOut={handleLocationMouseOut}
            className="cursor-pointer transition-colors duration-300 hover:fill-emerald-200 dark:hover:fill-emerald-800 focus:outline-none focus:fill-emerald-500"
            tabIndex={0}
          />
        ))}
        {labels.map((label) => (
          <text
            key={`label-${label.id}`}
            x={label.x}
            y={label.y}
            textAnchor="middle"
            dominantBaseline="middle"
            className="pointer-events-none text-[8px] sm:text-[10px] md:text-[11px] font-extrabold fill-slate-800 dark:fill-slate-100 opacity-90 transition-opacity drop-shadow-md"
          >
            {label.name}
          </text>
        ))}
      </svg>
    </div>
  );
}
