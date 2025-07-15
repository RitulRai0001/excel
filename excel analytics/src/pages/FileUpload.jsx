import { useRef, useState } from 'react';
import ChartDisplay from '../components/ChartDisplay';
import Navbar from '../components/Navbar';

const FileUpload = () => {
  const fileInputRef = useRef();
  const [excelData, setExcelData] = useState(null);
  const [stats, setStats] = useState(null);
  const [columns, setColumns] = useState([]);
  const [history, setHistory] = useState([]);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [aiSummary, setAiSummary] = useState('');
  const [aiLoading, setAiLoading] = useState(false);

  const handleFileChange = async (e) => {
    setError('');
    setSuccess('');
    setLoading(true);
    const file = e.target.files[0];
    if (!file) {
      setLoading(false);
      return;
    }
    const formData = new FormData();
    formData.append('file', file);
    const token = localStorage.getItem('token');
    try {
      const res = await fetch('http://localhost:5173/api/upload', {
        method: 'POST',
        headers: { Authorization: `Bearer ${token}` },
        body: formData,
      });
      const data = await res.json();
      if (res.ok) {
        setExcelData(data.data ? Object.values(data.data) : null);
        setStats(data.stats || null);
        setColumns(data.columns || []);
        setHistory(data.history || []);
        setSuccess('File uploaded and analyzed successfully!');
      } else {
        setError(data.message || 'Upload failed');
      }
    } catch {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Navbar showDashboardOnly={true} />
      <div className="min-h-screen w-[1000px] h-max screen-h-[2000px] items-top justify-center bg-gradient-to-br from-blue-100 to-blue-300 py-8">
        <div className="w-full max-w-[1800px] p-8 rounded-2xl shadow-2xl bg-white border border-blue-200 flex flex-col">
          <h1 className="text-3xl font-bold mb-4">Upload Excel File</h1>
          <div className="bg-white rounded shadow p-4 flex-1">
            <input
              type="file"
              accept=".xlsx,.xls"
              ref={fileInputRef}
              onChange={handleFileChange}
              className="mb-4"
              disabled={loading}
            />
            <p className="text-gray-500">Select an Excel file to upload and analyze.</p>
            {loading && <div className="text-blue-500 mt-2">Uploading...</div>}
            {error && <div className="text-red-500 mt-2">{error}</div>}
            {success && <div className="text-green-600 mt-2">{success}</div>}
            {excelData && (
              <>
                <div className="flex flex-col md:flex-row md:justify-between md:items-center mt-4 gap-2">
                  <span className="font-semibold">Raw Data Table</span>
                  <div className="flex gap-2">
                    <button
                      className="px-4 py-2 bg-blue-500 text-black rounded-lg hover:bg-blue-600 transition text-black"
                      onClick={() => {
                        // Download as CSV
                        const csvRows = [];
                        if (excelData.length > 0) {
                          csvRows.push(Object.keys(excelData[0]).join(","));
                          for (const row of excelData) {
                            csvRows.push(Object.values(row).map(cell => `"${String(cell).replace(/"/g, '""')}"`).join(","));
                          }
                          const csvContent = csvRows.join("\n");
                          const blob = new Blob([csvContent], { type: 'text/csv' });
                          const url = URL.createObjectURL(blob);
                          const a = document.createElement('a');
                          a.href = url;
                          a.download = 'analysis.csv';
                          document.body.appendChild(a);
                          a.click();
                          document.body.removeChild(a);
                          URL.revokeObjectURL(url);
                        }
                      }}
                    >
                      Download CSV
                    </button>
                    <button
                      className="px-4 py-2 bg-green-500 text-black rounded-lg hover:bg-green-600 transition"
                      disabled={aiLoading}
                      onClick={async () => {
                        setAiLoading(true);
                        setAiSummary('');
                        try {
                          const res = await fetch('/api/ai/summary', {
                            method: 'POST',
                            headers: { 'Content-Type': 'application/json' },
                            body: JSON.stringify({ data: excelData })
                          });
                          const data = await res.json();
                          if (res.ok && data.summary) {
                            setAiSummary(data.summary);
                          } else {
                            setAiSummary(data.message || 'AI summary failed.');
                          }
                        } catch (err) {
                          setAiSummary('AI summary failed.');
                        } finally {
                          setAiLoading(false);
                        }
                      }}
                    >
                      {aiLoading ? 'Generating Summary...' : 'AI Summary'}
                    </button>
                  </div>
                </div>
                {aiSummary && (
                  <div className="mt-2 p-4 bg-green-50 border border-green-200 rounded-lg text-black-900">
                    <strong>AI Summary:</strong>
                    <div className="mt-1 whitespace-pre-line">{aiSummary}</div>
                  </div>
                )}
                <div className="mt-2 overflow-x-auto">
                  <table className="min-w-full text-sm text-left">
                    <tbody>
                      {excelData.map((row, i) => (
                        <tr key={i}>
                          {Object.values(row).map((cell, j) => (
                            <td key={j} className="border px-2 py-1">{cell}</td>
                          ))}
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {stats && columns.length > 0 && (
                  <ChartDisplay stats={stats} columns={columns} history={history} />
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default FileUpload;
