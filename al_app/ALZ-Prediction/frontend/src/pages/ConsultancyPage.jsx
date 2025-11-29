import React, { useState } from 'react';
import { useLocation } from 'react-router-dom';
import { User, Calendar, MapPin, Star, Phone, Mail, Search, Activity, Heart, Brain } from 'lucide-react';

const doctors = [
    {
        id: 1,
        name: "Dr. Rajesh Sharma",
        specialty: "Neurologist",
        experience: "18 years",
        rating: 4.9,
        location: "Mumbai",
        hospital: "Apollo Hospitals",
        image: "https://images.unsplash.com/photo-1612349317150-e413f6a5b16d?auto=format&fit=crop&q=80&w=300&h=300"
    },
    {
        id: 2,
        name: "Dr. Priya Patel",
        specialty: "Geriatric Psychiatrist",
        experience: "14 years",
        rating: 4.8,
        location: "Delhi",
        hospital: "AIIMS",
        image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?auto=format&fit=crop&q=80&w=300&h=300"
    },
    {
        id: 3,
        name: "Dr. Amit Verma",
        specialty: "Neuropsychologist",
        experience: "12 years",
        rating: 4.7,
        location: "Bangalore",
        hospital: "Manipal Hospital",
        image: "https://images.unsplash.com/photo-1537368910025-700350fe46c7?auto=format&fit=crop&q=80&w=300&h=300"
    },
    {
        id: 4,
        name: "Dr. Sneha Gupta",
        specialty: "Neurologist",
        experience: "10 years",
        rating: 4.6,
        location: "Mumbai",
        hospital: "Fortis Hospital",
        image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?auto=format&fit=crop&q=80&w=300&h=300"
    },
    {
        id: 5,
        name: "Dr. Vikram Singh",
        specialty: "Psychiatrist",
        experience: "20 years",
        rating: 4.9,
        location: "Delhi",
        hospital: "Max Super Speciality",
        image: "https://images.unsplash.com/photo-1622253692010-333f2da6031d?auto=format&fit=crop&q=80&w=300&h=300"
    },
    {
        id: 6,
        name: "Dr. Anjali Desai",
        specialty: "Neurologist",
        experience: "16 years",
        rating: 4.8,
        location: "Bangalore",
        hospital: "NIMHANS",
        image: "https://images.unsplash.com/photo-1614608682850-e0d6ed316d47?auto=format&fit=crop&q=80&w=300&h=300"
    },
    {
        id: 7,
        name: "Dr. Arjun Reddy",
        specialty: "Neurosurgeon",
        experience: "15 years",
        rating: 4.9,
        location: "Hyderabad",
        hospital: "Yashoda Hospitals",
        image: "https://images.unsplash.com/photo-1582750433449-d22b1274be50?auto=format&fit=crop&q=80&w=300&h=300"
    },
    {
        id: 8,
        name: "Dr. Meera Iyer",
        specialty: "Geriatrician",
        experience: "13 years",
        rating: 4.7,
        location: "Chennai",
        hospital: "Apollo Chennai",
        image: "https://images.unsplash.com/photo-1527613426441-4da17471b66d?auto=format&fit=crop&q=80&w=300&h=300"
    }
];

const cities = ["All Cities", ...new Set(doctors.map(d => d.location))];

const BasicTreatments = () => (
    <div className="bg-white rounded-lg shadow-md p-6 mb-12 border border-teal-100">
        <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
            <Activity className="h-6 w-6 text-teal-600 mr-2" />
            Basic Treatments & Management
        </h2>
        <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-teal-50 p-4 rounded-lg">
                <h3 className="font-semibold text-teal-800 mb-2 flex items-center">
                    <Brain className="h-5 w-5 mr-2" /> Cognitive Stimulation
                </h3>
                <p className="text-sm text-gray-700">Engage in puzzles, reading, and memory exercises to maintain cognitive function.</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg">
                <h3 className="font-semibold text-blue-800 mb-2 flex items-center">
                    <Heart className="h-5 w-5 mr-2" /> Lifestyle Changes
                </h3>
                <p className="text-sm text-gray-700">Regular physical exercise, a heart-healthy diet, and social engagement are crucial.</p>
            </div>
            <div className="bg-purple-50 p-4 rounded-lg">
                <h3 className="font-semibold text-purple-800 mb-2 flex items-center">
                    <Activity className="h-5 w-5 mr-2" /> Routine Management
                </h3>
                <p className="text-sm text-gray-700">Establish a predictable daily routine to reduce confusion and anxiety.</p>
            </div>
        </div>
    </div>
);

const ConsultancyPage = () => {
    const location = useLocation();
    const stageCode = location.state?.stage_code; // 1: Low, 2: Mild, 3: High

    const [selectedDoctor, setSelectedDoctor] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const [selectedCity, setSelectedCity] = useState("All Cities");
    const [searchTerm, setSearchTerm] = useState("");

    const handleBook = (doctor) => {
        setSelectedDoctor(doctor);
        setShowModal(true);
    };

    const handleCloseModal = () => {
        setShowModal(false);
        setSelectedDoctor(null);
    };

    const filteredDoctors = doctors.filter(doctor => {
        const matchesCity = selectedCity === "All Cities" || doctor.location === selectedCity;
        const matchesSearch = doctor.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.specialty.toLowerCase().includes(searchTerm.toLowerCase()) ||
            doctor.hospital.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesCity && matchesSearch;
    });

    const DoctorsList = () => (
        <div>
            <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-gray-900">Find a Specialist</h2>
            </div>

            {/* Filters */}
            <div className="mb-8 bg-white p-4 rounded-lg shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
                <div className="relative flex-1 w-full">
                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                        <Search className="h-5 w-5 text-gray-400" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-1 focus:ring-teal-500 focus:border-teal-500 sm:text-sm"
                        placeholder="Search doctors, specialties, or hospitals..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
                <div className="w-full md:w-64">
                    <select
                        value={selectedCity}
                        onChange={(e) => setSelectedCity(e.target.value)}
                        className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md border"
                    >
                        {cities.map(city => (
                            <option key={city} value={city}>{city}</option>
                        ))}
                    </select>
                </div>
            </div>

            <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
                {filteredDoctors.length > 0 ? (
                    filteredDoctors.map((doctor) => (
                        <div key={doctor.id} className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300">
                            <img className="w-full h-48 object-cover" src={doctor.image} alt={doctor.name} />
                            <div className="p-6">
                                <div className="flex items-center justify-between mb-2">
                                    <h3 className="text-xl font-bold text-gray-900">{doctor.name}</h3>
                                    <div className="flex items-center bg-yellow-100 px-2 py-1 rounded">
                                        <Star className="h-4 w-4 text-yellow-500 mr-1" />
                                        <span className="text-sm font-medium text-yellow-700">{doctor.rating}</span>
                                    </div>
                                </div>
                                <p className="text-teal-600 font-medium mb-1">{doctor.specialty}</p>
                                <p className="text-gray-500 text-sm mb-4">{doctor.hospital}</p>

                                <div className="space-y-2 text-sm text-gray-600 mb-6">
                                    <div className="flex items-center">
                                        <Calendar className="h-4 w-4 mr-2" />
                                        <span>{doctor.experience} Experience</span>
                                    </div>
                                    <div className="flex items-center">
                                        <MapPin className="h-4 w-4 mr-2" />
                                        <span>{doctor.location}</span>
                                    </div>
                                </div>

                                <button
                                    onClick={() => handleBook(doctor)}
                                    className="w-full bg-teal-600 text-white py-2 px-4 rounded-md hover:bg-teal-700 transition-colors duration-200"
                                >
                                    Book Consultation
                                </button>
                            </div>
                        </div>
                    ))
                ) : (
                    <div className="col-span-full text-center py-12">
                        <p className="text-gray-500 text-lg">No doctors found matching your criteria.</p>
                    </div>
                )}
            </div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-7xl mx-auto">
                <div className="text-center mb-12">
                    <h1 className="text-3xl font-extrabold text-gray-900 sm:text-4xl">
                        Consultancy and Treatment
                    </h1>
                    <p className="mt-4 text-xl text-gray-500">
                        Connect with top Indian neurologists and specialists for personalized care.
                    </p>
                </div>

                {/* Dynamic Content Ordering */}
                {stageCode === 1 ? (
                    // Low Risk: Treatments First
                    <>
                        <BasicTreatments />
                        <DoctorsList />
                    </>
                ) : (
                    // Mild/High Risk or Default: Doctors First
                    <>
                        <DoctorsList />
                        <div className="mt-12">
                            <BasicTreatments />
                        </div>
                    </>
                )}

                {/* Booking Modal */}
                {showModal && selectedDoctor && (
                    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center z-50">
                        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
                            <div className="p-6">
                                <h3 className="text-lg font-medium text-gray-900 mb-4">
                                    Book with {selectedDoctor.name}
                                </h3>
                                <form className="space-y-4" onSubmit={(e) => { e.preventDefault(); alert('Booking request sent!'); handleCloseModal(); }}>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Preferred Date</label>
                                        <input type="date" required className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 border p-2" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700">Reason for Visit</label>
                                        <textarea required rows="3" className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-teal-500 focus:ring-teal-500 border p-2"></textarea>
                                    </div>
                                    <div className="flex justify-end space-x-3 mt-6">
                                        <button
                                            type="button"
                                            onClick={handleCloseModal}
                                            className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            type="submit"
                                            className="px-4 py-2 text-sm font-medium text-white bg-teal-600 rounded-md hover:bg-teal-700"
                                        >
                                            Confirm Booking
                                        </button>
                                    </div>
                                </form>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default ConsultancyPage;
