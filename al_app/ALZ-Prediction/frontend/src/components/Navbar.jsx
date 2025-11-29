import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Brain, LogOut } from 'lucide-react';

const Navbar = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    const handleLogout = () => {
        localStorage.removeItem('username');
        navigate('/');
    };

    return (
        <nav className="bg-white shadow-md">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="flex justify-between h-16">
                    <div className="flex items-center">
                        <Link to="/" className="flex-shrink-0 flex items-center">
                            <Brain className="h-8 w-8 text-teal-600" />
                            <div className="ml-2 flex flex-col">
                                <span className="text-xl font-bold text-gray-800">WebMed</span>
                                <span className="text-xs text-gray-500 -mt-1">your personal HealthCare Companion</span>
                            </div>
                        </Link>
                    </div>
                    <div className="flex items-center space-x-4">
                        <Link to="/" className="text-gray-600 hover:text-teal-600 px-3 py-2 rounded-md text-sm font-medium">Home</Link>

                        {username ? (
                            <>
                                <Link to="/main" className="text-gray-600 hover:text-teal-600 px-3 py-2 rounded-md text-sm font-medium">Dashboard</Link>
                                <Link to="/consultancy" className="text-gray-600 hover:text-teal-600 px-3 py-2 rounded-md text-sm font-medium">Consultancy</Link>
                                <Link to="/profile" className="text-gray-600 hover:text-teal-600 px-3 py-2 rounded-md text-sm font-medium">Profile</Link>
                                <div className="flex items-center ml-4">
                                    <Link to="/profile" className="text-gray-800 mr-4 hover:text-teal-600">Welcome, {username}</Link>
                                    <button
                                        onClick={handleLogout}
                                        className="flex items-center text-red-600 hover:text-red-800 px-3 py-2 rounded-md text-sm font-medium"
                                    >
                                        <LogOut className="h-4 w-4 mr-1" />
                                        Logout
                                    </button>
                                </div>
                            </>
                        ) : (
                            <>
                                <Link to="/signin" className="text-gray-600 hover:text-teal-600 px-3 py-2 rounded-md text-sm font-medium">Sign In</Link>
                                <Link to="/signup" className="bg-teal-600 text-white hover:bg-teal-700 px-4 py-2 rounded-md text-sm font-medium">Sign Up</Link>
                            </>
                        )}
                    </div>
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
