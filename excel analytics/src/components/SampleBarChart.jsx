import Chart from 'chart.js/auto';
import { useEffect, useRef } from 'react';

const SampleBarChart = () => {
  const chartRef = useRef(null);
  useEffect(() => {
    const ctx = chartRef.current.getContext('2d');
    const chartInstance = new Chart(ctx, {
      type: 'bar',
      data: {
        labels: ['Jan', 'Feb', 'Mar', 'Apr', 'May'],
        datasets: [
          {
            label: 'Uploads',
            data: [12, 19, 3, 5, 2],
            backgroundColor: 'rgba(59, 130, 246, 0.7)',
            borderRadius: 6,
          },
        ],
      },
      options: {
        responsive: true,
        plugins: {
          legend: { display: false },
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
      <h2 className="text-xl font-semibold mb-2">Monthly Uploads</h2>
      <canvas ref={chartRef} height={200}></canvas>
    </div>
  );
};

export default SampleBarChart;
