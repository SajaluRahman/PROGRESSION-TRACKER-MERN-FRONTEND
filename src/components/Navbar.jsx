
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  return (
    <nav className="bg-gradient-to-r from-gray-800 to-gray-900 shadow-lg">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          <div className="flex items-center">
            <h1 className="text-xl font-bold text-white tracking-tight">
              Progress Tracker
            </h1>
          </div>
          {user ? (
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-200">
                Welcome, {user.name} ({user.email}, {user.country})
              </span>
              <button
                onClick={() => {
                  logout();
                  navigate('/');
                }}
                className="py-2 px-4 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 transition-all duration-200"
              >
                Logout
              </button>
            </div>
          ) : (
            <div className="flex space-x-4">
              <button
                onClick={() => navigate('/login')}
                className="text-sm text-gray-200 hover:text-white transition-colors duration-200"
              >
                Login
              </button>
              <button
                onClick={() => navigate('/signup')}
                className="text-sm text-gray-200 hover:text-white transition-colors duration-200"
              >
                Signup
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
