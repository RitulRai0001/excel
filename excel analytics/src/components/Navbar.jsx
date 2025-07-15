import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';

const Navbar = ({ showDashboardOnly }) => {
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);

  const handleLogout = () => {
    dispatch(logout());
  };

  return (
    <nav className="sticky top-0 z-50 flex flex-col md:flex-row md:items-center md:justify-between px-8 py-4 bg-gradient-to-r from-red-700 via-blue-500 to-blue-400 text-black shadow-lg rounded-2xl mb-10 border border-blue-300">
      <div className="flex flex-col md:flex-row md:items-center gap-2 md:gap-6 w-full md:w-auto">
        <Link to="/dashboard" className="flex items-center gap-2 text-2xl font-extrabold tracking-tight hover:underline text-black">
          <span className="bg-black text-white rounded-full w-10 h-10 flex items-center justify-center font-bold text-xl shadow">EA</span>
          <span className="text-white">Excel Analytics</span>
        </Link>
        <Link to="/dashboard" className="px-4 py-2 rounded-lg bg-blue-100 text-black font-semibold hover:bg-blue-200 transition shadow">Dashboard</Link>
        {!showDashboardOnly && (
          <>
            <Link to="/upload" className="px-4 py-2 rounded-lg bg-blue-100 text-black font-semibold hover:bg-blue-200 transition shadow">Upload File</Link>
            <Link to="/admin" className="px-4 py-2 rounded-lg bg-blue-100 text-black font-semibold hover:bg-blue-200 transition shadow">Admin Panel</Link>
          </>
        )}
      </div>
      <div className="flex items-center gap-4 mt-4 md:mt-0">
        <span className="font-semibold text-lg bg-white/20 px-3 py-1 rounded-lg flex items-center gap-2 text-black">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-yellow-300" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.121 17.804A13.937 13.937 0 0112 15c2.5 0 4.847.655 6.879 1.804M15 10a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
          {user?.username || 'User'}
        </span>
        <button onClick={handleLogout} className="px-4 py-2 rounded-lg bg-red-100 text-red-700 font-semibold hover:bg-red-200 transition shadow">Logout</button>
      </div>
    </nav>
  );
};

export default Navbar;
