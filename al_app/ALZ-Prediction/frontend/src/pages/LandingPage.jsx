import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Activity, Users, UserCheck } from 'lucide-react';

const LandingPage = () => {
    const [stats, setStats] = useState(null);
    const [error, setError] = useState(false);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const response = await axios.get('http://localhost:8000/stats/');
                if (response.data.error) {
                    setError(true);
                } else {
                    setStats(response.data);
                }
            } catch (error) {
                console.error("Error fetching stats:", error);
                setError(true);
            }
        };
        fetchStats();
    }, []);

    if (error) {
        return <div className="flex justify-center items-center h-screen text-red-500">Failed to load stats. Please ensure backend is running.</div>;
    }

    if (!stats) {
        return <div className="flex justify-center items-center h-screen">Loading stats...</div>;
    }

    const diagnosisData = [
        { name: 'Diagnosed', value: stats.diagnosed_count },
        { name: 'Healthy', value: stats.not_diagnosed_count },
    ];

    const COLORS = ['#EF4444', '#10B981'];

    // Process age distribution for chart
    const ageData = Object.entries(stats.age_distribution).map(([age, count]) => ({
        age: age,
        count: count
    })).slice(0, 15); // Show first 15

    return (
        <div className="bg-gray-50 h-screen w-screen overflow-hidden flex flex-col">
            {/* Hero Section - Restored Size */}
            <div className="bg-teal-600 text-white py-8 flex-shrink-0 shadow-md z-10">
                <div className="max-w-7xl mx-auto px-4 text-center">
                    <h1 className="text-3xl font-bold mb-2">Early Detection Saves Memories</h1>
                    <p className="text-lg opacity-90">Advanced Alzheimer's prediction using machine learning.</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-grow p-4 min-h-0 flex flex-col">
                <div className="max-w-7xl mx-auto w-full h-full flex flex-col">

                    {/* Stats Cards - Restored Size */}
                    <div className="grid grid-cols-3 gap-6 mb-6 flex-shrink-0">
                        <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between border-l-4 border-teal-500">
                            <div>
                                <p className="text-gray-500 text-sm uppercase tracking-wide">Total Patients</p>
                                <p className="text-2xl font-bold text-gray-800">{stats.total_patients}</p>
                            </div>
                            <Users className="h-8 w-8 text-teal-500 opacity-80" />
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between border-l-4 border-red-500">
                            <div>
                                <p className="text-gray-500 text-sm uppercase tracking-wide">Diagnosed</p>
                                <p className="text-2xl font-bold text-gray-800">{stats.diagnosed_count}</p>
                            </div>
                            <Activity className="h-8 w-8 text-red-500 opacity-80" />
                        </div>
                        <div className="bg-white p-4 rounded-lg shadow-md flex items-center justify-between border-l-4 border-green-500">
                            <div>
                                <p className="text-gray-500 text-sm uppercase tracking-wide">Healthy</p>
                                <p className="text-2xl font-bold text-gray-800">{stats.not_diagnosed_count}</p>
                            </div>
                            <UserCheck className="h-8 w-8 text-green-500 opacity-80" />
                        </div>
                    </div>

                    {/* Charts Section - Smaller to fit remaining space */}
                    <div className="grid grid-cols-2 gap-6 flex-grow min-h-0">
                        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col border border-gray-100">
                            <h3 className="text-lg font-semibold mb-2 text-gray-700">Diagnosis Distribution</h3>
                            <div className="flex-grow min-h-0 relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <PieChart>
                                        <Pie
                                            data={diagnosisData}
                                            cx="50%"
                                            cy="50%"
                                            labelLine={false}
                                            outerRadius="60%"
                                            fill="#8884d8"
                                            dataKey="value"
                                            label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                                        >
                                            {diagnosisData.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                        <Legend verticalAlign="bottom" height={36} iconType="circle" />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>
                        </div>

                        <div className="bg-white p-4 rounded-lg shadow-md flex flex-col border border-gray-100">
                            <h3 className="text-lg font-semibold mb-2 text-gray-700">Age Distribution</h3>
                            <div className="flex-grow min-h-0 relative">
                                <ResponsiveContainer width="100%" height="100%">
                                    <BarChart data={ageData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                        <XAxis dataKey="age" tick={{ fontSize: 12 }} />
                                        <YAxis tick={{ fontSize: 12 }} />
                                        <Tooltip cursor={{ fill: 'transparent' }} />
                                        <Legend verticalAlign="bottom" height={36} />
                                        <Bar dataKey="count" fill="#0D9488" name="Patients" radius={[4, 4, 0, 0]} barSize={30} />
                                    </BarChart>
                                </ResponsiveContainer>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default LandingPage;
