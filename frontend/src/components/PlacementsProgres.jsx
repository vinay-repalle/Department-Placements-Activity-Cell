import React, { useEffect, useState } from 'react';

const barData = [
  { year: '2026', value: 0, color: 'from-gray-200 to-gray-300', label: '--', placeholder: true },
  { year: '2025', value: 83, color: 'from-green-400 to-green-600', label: '83%' },
  { year: '2024', value: 75, color: 'from-blue-400 to-blue-600', label: '75%' },
  { year: '2023', value: 85, color: 'from-orange-400 to-orange-600', label: '85%' },
  { year: '2022', value: 80, color: 'from-red-400 to-red-600', label: '80%' },
];

const PlacementsProgres = () => {
  const [animatedHeights, setAnimatedHeights] = useState(barData.map(() => 0));

  useEffect(() => {
    // Animate bar growth
    const timeouts = barData.map((bar, i) =>
      setTimeout(() => {
        setAnimatedHeights((prev) => {
          const next = [...prev];
          next[i] = bar.value;
          return next;
        });
      }, 200 + i * 120)
    );
    return () => timeouts.forEach(clearTimeout);
  }, []);

  return (
    <div className="w-full max-w-3xl mx-auto h-72 sm:h-80 md:h-96 lg:h-[28rem] mb-10 mt-[33px] flex items-center justify-center">
      <div className="w-full h-full border border-gray-200 rounded-2xl shadow-2xl bg-white/80 flex flex-col justify-center items-center backdrop-blur-md">
        {/* Header */}
        <div className="flex justify-between items-center mb-2 mt-6 w-full px-6">
          <h3 className="text-xl font-semibold text-red-900">Placements Progress In Past Three Years</h3>
        </div>
        {/* Bar Chart */}
        <div className="flex-1 flex flex-col justify-center w-full px-2">
          <div className="flex justify-center items-end space-x-6 mb-4 h-2/3">
            {barData.map((bar, i) => (
              <div key={bar.year} className="flex flex-col items-center group">
                <div className="w-12 h-40 bg-transparent flex items-end">
                  <div
                    className={`w-full transition-all duration-700 ease-out rounded-t-xl shadow-lg ${bar.placeholder ? 'bg-gradient-to-t from-gray-200 to-gray-300 border-2 border-dashed border-gray-400 opacity-60' : `bg-gradient-to-t ${bar.color}`} group-hover:scale-105 group-hover:shadow-2xl`}
                    style={{ height: `${animatedHeights[i]}%`, minHeight: bar.placeholder ? '10%' : '8px' }}
                  >
                    <div className={`flex items-center justify-center text-xs h-full ${bar.placeholder ? 'text-gray-500' : 'text-white font-bold drop-shadow'}`}>{bar.label}</div>
                  </div>
                </div>
                <span className="text-sm font-semibold text-gray-800 mt-2 drop-shadow-sm">{bar.year}</span>
              </div>
            ))}
          </div>
        </div>
        {/* Legend */}
        <div className="flex justify-center space-x-5 mb-4 w-full px-2 flex-wrap">
          <div className="flex items-center space-x-2 opacity-60">
            <div className="w-3 h-3 bg-gradient-to-t from-gray-200 to-gray-300 border-2 border-dashed border-gray-400 rounded"></div>
            <span className="text-[13px] text-gray-800">2026 - --</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-t from-green-400 to-green-600 rounded-full"></div>
            <span className="text-[13px] text-gray-800">2025 - 83%</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-t from-blue-400 to-blue-600 rounded-full"></div>
            <span className="text-[13px] text-gray-800 ">2024 - 75%</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-t from-orange-400 to-orange-600 rounded-full"></div>
            <span className="text-[13px] text-gray-800">2023 - 85%</span>
          </div>
          <div className="flex items-center space-x-2">
            <div className="w-3 h-3 bg-gradient-to-t from-red-400 to-red-600 rounded-full"></div>
            <span className="text-[13px] text-gray-800">2022 - 80%</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlacementsProgres;