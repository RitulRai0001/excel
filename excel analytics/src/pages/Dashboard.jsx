import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Navbar from '../components/Navbar';
import SampleBarChart from '../components/SampleBarChart';
import SampleLineChart from '../components/SampleLineChart';
import UploadHistory from '../components/UploadHistory';
import { logout } from '../features/auth/authSlice';
import { fetchUploadHistory } from '../features/dashboard/dashboardAPI';
import { GoogleOAuthProvider } from '@react-oauth/google'; 

const Dashboard = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const [showDetails, setShowDetails] = useState(false);
  const [history, setHistory] = useState([]);
  const [loadingHistory, setLoadingHistory] = useState(false);
  const [historyError, setHistoryError] = useState('');

  useEffect(() => {
    if (!showDetails) return;
    const loadHistory = async () => {
      setLoadingHistory(true);
      setHistoryError('');
      try {
        // Replace with your token logic if needed
        const token = user?.token || localStorage.getItem('token');
        const res = await fetchUploadHistory(token);
        setHistory(res.history || []);
      } catch (err) {
        setHistoryError('Failed to load upload history');
      } finally {
        setLoadingHistory(false);
      }
    };
    loadHistory();
  }, [showDetails, user]);

  const handleLogout = () => {
    dispatch(logout());
  };

  // Handler for AI Insights button
  const handleGetInsights = () => {
    alert('AI Insights feature coming soon!');
  };

  // Handler to delete all upload history
  const handleDeleteHistory = async () => {
    try {
      const token = user?.token || localStorage.getItem('token');
      const res = await fetch('/api/upload/history', {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      });
      if (!res.ok) throw new Error('Failed to delete upload history');
      setHistory([]);
    } catch (err) {
      setHistoryError('Failed to delete upload history');
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-100 to-blue-300">
      <div className="w-full max-w-[2000px] p-8 rounded-2xl shadow-2xl bg-white border border-blue-200">
        <Navbar />
        <h1 className="text-4xl font-extrabold text-blue-700 mb-6 text-center">📊 Dashboard</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
          <div className="bg-blue-50 rounded-xl shadow p-6 flex flex-col items-center">
            <h2 className="text-xl font-bold mb-2 text-blue-800">Upload History</h2>
            <p className="text-gray-500 mb-4 text-center">Your recent uploads and analytics summary will appear here.</p>
            <button
              className="px-4 py-2 bg-blue-600 text-black rounded hover:bg-blue-700 transition"
              onClick={() => setShowDetails((prev) => !prev)}
            >
              {showDetails ? 'Hide Details' : 'View Details'}
            </button>
            {showDetails && (
              <div className="w-full mt-4">
                {loadingHistory && <div className="text-blue-500">Loading history...</div>}
                {historyError && <div className="text-red-500">{historyError}</div>}
                <UploadHistory history={history} onDeleteAll={handleDeleteHistory} />
                {/* Extract analysis data from history and pass to charts */}
                <div className="bg-white rounded-xl shadow p-6 mt-4">
                  <SampleBarChart analysisData={history.map(h => h.analysisResult || h.analysis?.analysisResult)} />
                </div>
                <div className="bg-white rounded-xl shadow p-6 mt-4">
                  <SampleLineChart analysisData={history.map(h => h.analysisResult || h.analysis?.analysisResult)} />
                </div>
              </div>
            )}
          </div>
          <div className="bg-blue-50 rounded-xl shadow p-6 flex flex-col items-center">
            <h2 className="text-xl font-bold mb-2 text-blue-800">AI Insights</h2>
            <p className="text-gray-500 mb-4 text-center">Get smart insights and summary reports from your data.</p>
            <button
              className="px-4 py-2 bg-green-600 text-black rounded hover:bg-green-700 transition"
              onClick={handleGetInsights}
            >
              Get Insights
            </button>
          </div>
        </div>
        <div className="bg-white rounded-xl shadow p-6 mb-8">
          <SampleBarChart />
        </div>
        <div className="bg-white rounded-xl shadow p-6">
          <SampleLineChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
