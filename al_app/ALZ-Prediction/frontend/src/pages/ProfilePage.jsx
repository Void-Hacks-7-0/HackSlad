import React from 'react';
import { User, Mail, Calendar, LogOut } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
    const navigate = useNavigate();
    const username = localStorage.getItem('username');

    // Placeholder data - in a real app this would come from an API
    const joinDate = "November 2025";
    const email = `${username || 'user'}@example.com`;

    const handleLogout = () => {
        localStorage.removeItem('username');
        navigate('/');
    };

    if (!username) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-900">Please sign in to view your profile</h2>
                    <button
                        onClick={() => navigate('/signin')}
                        className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
                    >
                        Sign In
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">
                <div className="bg-white shadow rounded-lg overflow-hidden">
                    {/* Header/Banner */}
                    <div className="bg-teal-600 h-32"></div>

                    {/* Profile Info */}
                    <div className="px-4 py-5 sm:px-6 relative">
                        <div className="-mt-16 mb-4">
                            <div className="inline-flex items-center justify-center h-24 w-24 rounded-full bg-white p-1">
                                <div className="h-full w-full rounded-full bg-gray-200 flex items-center justify-center">
                                    <User className="h-12 w-12 text-gray-400" />
                                </div>
                            </div>
                        </div>

                        <h3 className="text-2xl font-bold leading-6 text-gray-900">{username}</h3>
                        <p className="mt-1 max-w-2xl text-sm text-gray-500">Member since {joinDate}</p>
                    </div>

                    {/* Details List */}
                    <div className="border-t border-gray-200 px-4 py-5 sm:p-0">
                        <dl className="sm:divide-y sm:divide-gray-200">
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 flex items-center">
                                    <User className="h-4 w-4 mr-2" />
                                    Username
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{username}</dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 flex items-center">
                                    <Mail className="h-4 w-4 mr-2" />
                                    Email
                                </dt>
                                <dd className="mt-1 text-sm text-gray-900 sm:mt-0 sm:col-span-2">{email}</dd>
                            </div>
                            <div className="py-4 sm:py-5 sm:grid sm:grid-cols-3 sm:gap-4 sm:px-6">
                                <dt className="text-sm font-medium text-gray-500 flex items-center">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Account Status
                                </dt>
                                <dd className="mt-1 text-sm text-green-600 font-medium sm:mt-0 sm:col-span-2">Active</dd>
                            </div>
                        </dl>
                    </div>

                    {/* Actions */}
                    <div className="bg-gray-50 px-4 py-4 sm:px-6 flex justify-end">
                        <button
                            onClick={handleLogout}
                            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-red-700 bg-red-100 hover:bg-red-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                        >
                            <LogOut className="h-4 w-4 mr-2" />
                            Sign out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfilePage;
