import React, { useRef, useEffect } from 'react';
import Chart from 'chart.js/auto';

const SampleLineChart = () => {
  const chartRef = useRef(null);
  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    const chartInstance = new Chart(ctx, {
      type: 'line',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [
          {
            label: 'Active Users',
            data: [10, 15, 8, 12, 20],
            borderColor: 'rgba(59, 130, 246, 1)',
            backgroundColor: 'rgba(59, 130, 246, 0.2)',
            tension: 0.4,
            fill: true,
            pointRadius: 5,
            pointBackgroundColor: 'rgba(59, 130, 246, 1)',
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: true },
        },
        scales: {
          y: { beginAtZero: true },
        },
      },
    });
    return () => chartInstance.destroy();
  }, []);
  return (
    <div className="bg-white rounded shadow p-4 mt-6">
      <h2 className="text-xl font-semibold mb-2">Active Users Over Time</h2>
      <canvas ref={chartRef} height={200}></canvas>
    </div>
  );
};

export default SampleLineChart;
