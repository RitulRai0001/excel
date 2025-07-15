import { GoogleLogin, GoogleOAuthProvider } from '@react-oauth/google';
import { useNavigate } from 'react-router-dom';

const clientId = '119571199998-agrnglgn3du0qsrriope7p448e9pobqn.apps.googleusercontent.com'; // Replace with your Google OAuth Client ID


import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { login, register } from '../features/auth/authSlice';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user, token, loading, error } = useSelector((state) => state.auth);
  const [showRegister, setShowRegister] = useState(false);


  // Google OAuth success handler
  const handleSuccess = async (credentialResponse) => {
    try {
      // Decode JWT from Google
      const base64Url = credentialResponse.credential.split('.')[1];
      const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
      const jsonPayload = decodeURIComponent(atob(base64).split('').map(function(c) {
        return '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2);
      }).join(''));
      const { email, name } = JSON.parse(jsonPayload);
      // Send to backend for login/registration
      const res = await fetch('http://localhost:5173/api/auth/google-login' 
, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, username: name })
      });
      const data = await res.json();
      if (res.ok && data.token) {
        // Store token and user in localStorage or Redux as needed
        localStorage.setItem('token', data.token);
        // Optionally dispatch to Redux here
        navigate('/dashboard');
      } else {
        alert(data.message || 'Google login failed');
      }
    } catch (err) {
      alert('Google login failed');
    }
  };


  const handleError = () => {
    // Optionally dispatch error to Redux or show toast
    // setError('Google login failed');
  };

  const handleFormLogin = (e) => {
    e.preventDefault();
    const email = e.target[0].value;
    const password = e.target[1].value;
    dispatch(login({ email, password }));
  };

  // Redirect if already authenticated
  useEffect(() => {
    if (token && user) {
      navigate('/dashboard');
    }
  }, [token, user, navigate]);

  return (
    <div className="fixed inset-0 flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-400 via-blue-200 to-blue-100">
      <div className="w-full max-w-md p-10 space-y-8 bg-white/90 rounded-3xl shadow-2xl border border-blue-300 relative">
        <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-blue-600 text-white rounded-full w-16 h-16 flex items-center justify-center shadow-lg text-3xl font-extrabold border-4 border-white">EA</div>
        <h2 className="text-3xl font-extrabold text-center text-blue-700 mt-8">Excel Analytics Platform</h2>
        <h3 className="text-xl font-bold text-center text-blue-500 mb-4">{showRegister ? 'Register a new account' : 'Sign in to your account'}</h3>
        {showRegister ? (
          <RegisterForm setShowRegister={setShowRegister} loading={loading} error={error} />
        ) : (
          <form className="space-y-4" onSubmit={handleFormLogin}>
            <input className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" type="email" placeholder="Email" required />
            <input className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" type="password" placeholder="Password" required />
            <button type="submit" className="w-full py-2 font-semibold text-black bg-black-600 rounded-lg hover:bg-blue-700 transition" disabled={loading}>{loading ? 'Signing In...' : 'Sign In'}</button>
            <button type="button" className="w-full py-2 mt-2 font-semibold text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition" onClick={() => setShowRegister(true)}>Create an account</button>
          </form>
        )}
        {error && <div className="text-red-500 text-center mt-2">{error}</div>}
        <div className="flex items-center justify-center mt-6">
          <span className="text-gray-400 text-sm mr-2">or sign in with</span>
          <GoogleOAuthProvider clientId={clientId}>
            <GoogleLogin onSuccess={handleSuccess} onError={handleError} />
          </GoogleOAuthProvider>
        </div>
      </div>
    </div>
  );
// Registration form component
function RegisterForm({ setShowRegister, loading, error }) {
  const dispatch = useDispatch();
  const [username, setRegUsername] = useState('');
  const [email, setRegEmail] = useState('');
  const [password, setRegPassword] = useState('');
  const [success, setSuccess] = useState('');

  const handleRegister = async (e) => {
    e.preventDefault();
    setSuccess('');
    const resultAction = await dispatch(register({ username, email, password }));
    if (register.fulfilled.match(resultAction)) {
      setSuccess('Registration successful! You can now log in.');
      setTimeout(() => setShowRegister(false), 1500);
    }
  };

  return (
    <form className="space-y-4" onSubmit={handleRegister}>
      <input className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" type="text" placeholder="Username" value={username} onChange={e => setRegUsername(e.target.value)} required />
      <input className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" type="email" placeholder="Email" value={email} onChange={e => setRegEmail(e.target.value)} required />
      <input className="w-full px-4 py-2 border border-blue-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-400 transition" type="password" placeholder="Password" value={password} onChange={e => setRegPassword(e.target.value)} required />
      <button type="submit" className="w-full py-2 font-semibold text-black bg-black-600 rounded-lg hover:bg-blue-700 transition" disabled={loading}>{loading ? 'Registering...' : 'Register'}</button>
      <button type="button" className="w-full py-2 mt-2 font-semibold text-blue-700 bg-blue-100 rounded-lg hover:bg-blue-200 transition" onClick={() => setShowRegister(false)}>Back to Login</button>
      {success && <div className="text-green-600 text-center mt-2">{success}</div>}
      {error && <div className="text-red-500 text-center mt-2">{error}</div>}
    </form>
  );
}
};

export default Login;
