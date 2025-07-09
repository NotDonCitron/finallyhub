import React, { useState } from 'react';
import { login } from '../../services/auth';

const Login = ({ onLogin }) => {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    if (error) setError('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');

    try {
      const { user, token } = await login(formData.username, formData.password);
      onLogin(user, token);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const demoUsers = [
    { username: 'user1', password: 'pass123' },
    { username: 'user2', password: 'pass123' },
    { username: 'user3', password: 'pass123' }
  ];

  const fillDemoUser = (username) => {
    setFormData({ username, password: 'pass123' });
    setError('');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-600 rounded-full mb-4">
            <span className="text-white font-bold text-xl">BB</span>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-2">Bluebirdhub</h1>
          <p className="text-gray-600">Team Workspace & Aufgabenmanagement</p>
        </div>

        <div className="card">
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label htmlFor="username" className="block text-sm font-medium text-gray-700 mb-1">
                Benutzername
              </label>
              <input
                id="username"
                name="username"
                type="text"
                required
                className="input"
                placeholder="Benutzername eingeben"
                value={formData.username}
                onChange={handleChange}
                disabled={loading}
                autoFocus
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
                Passwort
              </label>
              <input
                id="password"
                name="password"
                type="password"
                required
                className="input"
                placeholder="Passwort eingeben"
                value={formData.password}
                onChange={handleChange}
                disabled={loading}
              />
            </div>

            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg text-sm">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="btn-primary w-full flex items-center justify-center"
            >
              {loading ? (
                <>
                  <div className="spinner mr-2"></div>
                  Anmelden...
                </>
              ) : (
                'Anmelden'
              )}
            </button>
          </form>

          <div className="mt-6 pt-6 border-t border-gray-200">
            <p className="text-sm text-gray-600 mb-3 text-center">Demo-Benutzer:</p>
            <div className="space-y-2">
              {demoUsers.map((user) => (
                <button
                  key={user.username}
                  type="button"
                  onClick={() => fillDemoUser(user.username)}
                  className="w-full text-left px-3 py-2 text-sm bg-gray-50 hover:bg-gray-100 rounded-lg border border-gray-200 transition-colors"
                  disabled={loading}
                >
                  <div className="font-medium text-gray-700">{user.username}</div>
                  <div className="text-gray-500">Passwort: {user.password}</div>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-6 text-center text-sm text-gray-500">
          Bluebirdhub &copy; 2025 - Team Workspace Demo
        </div>
      </div>
    </div>
  );
};

export default Login;