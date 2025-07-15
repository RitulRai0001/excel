import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, PointElement, LineElement, ArcElement);


const ChartDisplay = ({ stats, columns, history }) => {
  if (!stats || !columns || columns.length === 0) return null;
  return (
    <div className="mt-8">
      <h2 className="text-xl font-bold mb-2">Charts</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {columns.map(col => (
          stats[col] ? (
            <div key={col} className="bg-blue-50 rounded-xl shadow p-4 min-w-[320px] min-h-[320px] flex flex-col items-center justify-center overflow-x-auto">
              <h3 className="font-semibold mb-2">{col} (Bar)</h3>
              <Bar
                data={{
                  labels: ['Sum', 'Mean', 'Min', 'Max', 'Count'],
                  datasets: [{
                    label: col,
                    data: [stats[col].sum, stats[col].mean, stats[col].min, stats[col].max, stats[col].count],
                    backgroundColor: [
                      'rgba(54, 162, 235, 0.6)',
                      'rgba(255, 206, 86, 0.6)',
                      'rgba(75, 192, 192, 0.6)',
                      'rgba(255, 99, 132, 0.6)',
                      'rgba(153, 102, 255, 0.6)'
                    ]
                  }]
                }}
                options={{ responsive: true, plugins: { legend: { display: false } } }}
                height={260}
                width={420}
              />
              <h3 className="font-semibold mt-4 mb-2">{col} (Line)</h3>
              <Line
                data={{
                  labels: ['Sum', 'Mean', 'Min', 'Max', 'Count'],
                  datasets: [{
                    label: col,
                    data: [stats[col].sum, stats[col].mean, stats[col].min, stats[col].max, stats[col].count],
                    borderColor: 'rgba(54, 162, 235, 1)',
                    backgroundColor: 'rgba(54, 162, 235, 0.2)'
                  }]
                }}
                options={{ responsive: true, plugins: { legend: { display: false } } }}
                height={260}
                width={420}
              />
              <h3 className="font-semibold mt-4 mb-2">{col} (Pie)</h3>
              <Pie
                data={{
                  labels: ['Sum', 'Mean', 'Min', 'Max', 'Count'],
                  datasets: [{
                    label: col,
                    data: [stats[col].sum, stats[col].mean, stats[col].min, stats[col].max, stats[col].count],
                    backgroundColor: [
                      'rgba(54, 162, 235, 0.6)',
                      'rgba(255, 206, 86, 0.6)',
                      'rgba(75, 192, 192, 0.6)',
                      'rgba(255, 99, 132, 0.6)',
                      'rgba(153, 102, 255, 0.6)'
                    ]
                  }]
                }}
                options={{ responsive: true, plugins: { legend: { display: true } } }}
                height={260}
                width={420}
              />
            </div>
          ) : null
        ))}
      </div>
      {history && history.length > 0 && (
        <div className="mt-8">
          <h2 className="text-xl font-bold mb-2">Upload History</h2>
          <p className="mb-2">Total files uploaded: <span className="font-semibold">{history.length}</span></p>
          <ul className="list-disc pl-6">
            {history.map((item, idx) => (
              <li key={item._id || idx} className="mb-1">
                <span className="font-semibold">{item.originalname}</span> - <span className="text-gray-500">{new Date(item.uploadDate).toLocaleString()}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default ChartDisplay;
