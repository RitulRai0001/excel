
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import './App.css';
import AdminPanel from './pages/AdminPanel';
import Dashboard from './pages/Dashboard';
import FileUpload from './pages/FileUpload';
import Login from './pages/Login';
import RequireAuth from './components/RequireAuth';


function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Login />} />
        <Route path="/dashboard" element={
          <RequireAuth>
            <Dashboard />
          </RequireAuth>
        } />
        <Route path="/upload" element={
          <RequireAuth>
            <FileUpload />
          </RequireAuth>
        } />
        <Route path="/admin" element={
          <RequireAuth>
            <AdminPanel />
          </RequireAuth>
        } />
      </Routes>
    </Router>
  );
}

export default App;


