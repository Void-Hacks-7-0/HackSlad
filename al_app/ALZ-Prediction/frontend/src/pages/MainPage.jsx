import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const MainPage = () => {
    const navigate = useNavigate();
    const [activeTab, setActiveTab] = useState('health');

    // Health Insights State (Daily Metrics)
    const [healthData, setHealthData] = useState({
        heart_rate: '',
        systolic_bp: '',
        diastolic_bp: '',
        steps_count: '',
        hydration: '',
        sleep_hours: ''
    });
    const [healthResult, setHealthResult] = useState(null);

    // General Symptom Checker State
    const [generalSymptoms, setGeneralSymptoms] = useState({
        fever: false,
        cough: false,
        headache: false,
        sneeze: false,
        runny_nose: false,
        muscle_pain: false,
        joint_pain: false,
        nausea: false,
        chills: false,
        rash: false,
        fatigue: false,
        sore_throat: false
    });
    const [generalResult, setGeneralResult] = useState(null);

    // Alzheimer's Prediction State
    const [symptomData, setSymptomData] = useState({});
    const [predictionResult, setPredictionResult] = useState(null);

    // --- Handlers ---

    const handleTabSwitch = (tab) => {
        setActiveTab(tab);
        // Reset detailed symptoms when switching tabs
        setSymptomData(prev => {
            const newState = { ...prev };
            Object.keys(newState).forEach(key => {
                if (key.includes('_')) { // Detailed symptoms have underscores (e.g., Memory_0)
                    delete newState[key];
                }
            });
            return newState;
        });
    };

    const handleHealthSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/predict/health-insights', healthData);
            setHealthResult(response.data);
        } catch (error) {
            console.error("Error fetching health insights:", error);
        }
    };

    const handleSymptomChange = (e) => {
        const { name, value, type, checked } = e.target;
        setSymptomData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (checked ? 1 : 0) : value
        }));
    };

    // Sync BP fields between Health and Symptom data
    const handleBPChange = (e) => {
        const { name, value } = e.target;
        // Update Health Data
        setHealthData(prev => ({
            ...prev,
            [name.toLowerCase()]: value
        }));
        // Update Symptom Data (Risk Factors)
        setSymptomData(prev => ({
            ...prev,
            [name === 'systolic_bp' ? 'SystolicBP' : 'DiastolicBP']: value
        }));
    };

    const handleSymptomSubmit = async (e) => {
        e.preventDefault();
        try {
            // Aggregation Logic for Detailed Symptoms
            const aggregatedData = { ...symptomData };

            // Helper to count checked items in a category
            const countChecked = (prefix) => {
                let count = 0;
                Object.keys(symptomData).forEach(key => {
                    if (key.startsWith(prefix) && symptomData[key] === 1) count++;
                });
                return count;
            };

            // 1. Memory (6 items) -> MemoryComplaints, Forgetfulness
            const memoryCount = countChecked('Memory_');
            aggregatedData.MemoryComplaints = memoryCount > 0 ? 1 : 0;
            aggregatedData.Forgetfulness = memoryCount > 3 ? 1 : 0;

            // 2. Disorientation (6 items) -> Disorientation, Confusion
            const disorientationCount = countChecked('Disorientation_');
            aggregatedData.Disorientation = disorientationCount > 0 ? 1 : 0;
            aggregatedData.Confusion = disorientationCount > 2 ? 1 : 0;

            // 3. Activities (7 items) -> DifficultyCompletingTasks, ADL (score)
            const activitiesCount = countChecked('Activities_');
            aggregatedData.DifficultyCompletingTasks = activitiesCount > 0 ? 1 : 0;
            aggregatedData.ADL = Math.max(0, 10 - (activitiesCount * 1.5));

            // 4. Behaviour (4 items) -> BehavioralProblems, PersonalityChanges
            const behaviourCount = countChecked('Behaviour_');
            aggregatedData.BehavioralProblems = behaviourCount > 0 ? 1 : 0;
            aggregatedData.PersonalityChanges = behaviourCount > 1 ? 1 : 0;

            // 5. Language (2 items) -> (Contributes to Confusion/Disorientation if not already set)
            const languageCount = countChecked('Language_');
            if (languageCount > 0) aggregatedData.Confusion = 1;

            // 6. Awareness (1 item) -> (Contributes to Confusion)
            const awarenessCount = countChecked('Awareness_');
            if (awarenessCount > 0) aggregatedData.Confusion = 1;

            // Clean up temporary keys
            Object.keys(aggregatedData).forEach(key => {
                if (key.includes('_')) delete aggregatedData[key];
            });

            // Ensure all required fields are present (defaults)
            const requiredFields = [
                'Age', 'Gender', 'Ethnicity', 'EducationLevel', 'BMI', 'Smoking', 'AlcoholConsumption',
                'PhysicalActivity', 'DietQuality', 'SleepQuality', 'FamilyHistoryAlzheimers',
                'CardiovascularDisease', 'Diabetes', 'Depression', 'HeadInjury', 'Hypertension',
                'SystolicBP', 'DiastolicBP', 'CholesterolTotal', 'CholesterolLDL', 'CholesterolHDL',
                'CholesterolTriglycerides', 'MMSE', 'FunctionalAssessment', 'MemoryComplaints',
                'BehavioralProblems', 'ADL', 'Confusion', 'Disorientation', 'PersonalityChanges',
                'DifficultyCompletingTasks', 'Forgetfulness'
            ];

            requiredFields.forEach(field => {
                if (aggregatedData[field] === undefined) {
                    aggregatedData[field] = 0; // Default value
                }
            });

            // Convert string values to numbers
            const formattedData = {};
            for (const key in aggregatedData) {
                formattedData[key] = isNaN(aggregatedData[key]) ? aggregatedData[key] : Number(aggregatedData[key]);
            }

            const response = await axios.post('http://localhost:8000/predict/', formattedData);
            setPredictionResult(response.data);
        } catch (error) {
            console.error("Error fetching alzheimer prediction:", error);
        }
    };

    const handleGeneralSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:8000/predict/general', generalSymptoms);
            setGeneralResult(response.data);
        } catch (error) {
            console.error("Error fetching general prediction:", error);
        }
    };

    const toggleGeneralSymptom = (symptom) => {
        setGeneralSymptoms(prev => ({
            ...prev,
            [symptom]: !prev[symptom]
        }));
    };

    const symptomsList = [
        { key: 'fever', label: 'Fever', icon: '🌡️' },
        { key: 'cough', label: 'Cough', icon: '🤧' },
        { key: 'headache', label: 'Headache', icon: '🤕' },
        { key: 'sneeze', label: 'Sneezing', icon: '🌬️' },
        { key: 'runny_nose', label: 'Runny Nose', icon: '💧' },
        { key: 'muscle_pain', label: 'Muscle Pain', icon: '💪' },
        { key: 'joint_pain', label: 'Joint Pain', icon: '🦴' },
        { key: 'nausea', label: 'Nausea', icon: '🤢' },
        { key: 'chills', label: 'Chills', icon: '🥶' },
        { key: 'rash', label: 'Rash', icon: '🔴' },
        { key: 'fatigue', label: 'Fatigue', icon: '😫' },
        { key: 'sore_throat', label: 'Sore Throat', icon: '🗣️' },
    ];

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
            <div className="bg-white rounded-lg shadow-lg overflow-hidden">
                <div className="flex border-b overflow-x-auto">
                    <button
                        className={`flex-1 py-4 px-6 text-center font-medium whitespace-nowrap ${activeTab === 'health' ? 'bg-teal-50 text-teal-600 border-b-2 border-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => handleTabSwitch('health')}
                    >
                        Health Insights
                    </button>
                    <button
                        className={`flex-1 py-4 px-6 text-center font-medium whitespace-nowrap ${activeTab === 'symptom' ? 'bg-teal-50 text-teal-600 border-b-2 border-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => handleTabSwitch('symptom')}
                    >
                        Alzheimer's Checker
                    </button>
                    <button
                        className={`flex-1 py-4 px-6 text-center font-medium whitespace-nowrap ${activeTab === 'general' ? 'bg-teal-50 text-teal-600 border-b-2 border-teal-600' : 'text-gray-500 hover:text-gray-700'}`}
                        onClick={() => handleTabSwitch('general')}
                    >
                        General Checker
                    </button>
                </div>

                <div className="p-6">
                    {activeTab === 'health' && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Personal Health Profile</h2>

                            <div className="space-y-8">
                                {/* Section 1: Daily Vitals & Metrics */}
                                <div className="bg-gray-50 p-6 rounded-lg border border-gray-200">
                                    <h3 className="text-lg font-semibold mb-4 text-teal-800">Daily Vitals & Metrics</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Heart Rate (bpm)</label>
                                            <input type="number" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                                value={healthData.heart_rate} onChange={(e) => setHealthData({ ...healthData, heart_rate: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Systolic BP</label>
                                            <input type="number" name="systolic_bp" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                                value={healthData.systolic_bp} onChange={handleBPChange} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Diastolic BP</label>
                                            <input type="number" name="diastolic_bp" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                                value={healthData.diastolic_bp} onChange={handleBPChange} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Steps Count</label>
                                            <input type="number" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                                value={healthData.steps_count} onChange={(e) => setHealthData({ ...healthData, steps_count: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Hydration (Liters)</label>
                                            <input type="number" step="0.1" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                                value={healthData.hydration} onChange={(e) => setHealthData({ ...healthData, hydration: e.target.value })} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Sleep Hours</label>
                                            <input type="number" step="0.1" required className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
                                                value={healthData.sleep_hours} onChange={(e) => setHealthData({ ...healthData, sleep_hours: e.target.value })} />
                                        </div>
                                    </div>

                                    <div className="mt-4">
                                        <button onClick={handleHealthSubmit} className="bg-teal-600 text-white py-2 px-6 rounded-md hover:bg-teal-700 transition shadow-sm">
                                            Analyze Daily Health
                                        </button>
                                    </div>

                                    {healthResult && (
                                        <div className="mt-4 p-4 bg-white rounded-md border border-teal-100 shadow-sm">
                                            <div className="flex items-center mb-2">
                                                <span className="text-gray-700 mr-2 font-medium">Health Score:</span>
                                                <span className={`text-xl font-bold ${healthResult.health_score > 80 ? 'text-green-600' : 'text-yellow-600'}`}>
                                                    {healthResult.health_score}/100
                                                </span>
                                            </div>
                                            {healthResult.precautions.length > 0 && (
                                                <ul className="list-disc list-inside text-sm text-red-600">
                                                    {healthResult.precautions.map((p, i) => <li key={i}>{p}</li>)}
                                                </ul>
                                            )}
                                        </div>
                                    )}
                                </div>

                                {/* Section 2: Demographics & Lifestyle */}
                                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                                    <h3 className="text-lg font-semibold mb-4 text-indigo-800">Demographics & Lifestyle</h3>
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Age</label>
                                            <input type="number" name="Age" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" onChange={handleSymptomChange} value={symptomData.Age || ''} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Gender</label>
                                            <select name="Gender" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" onChange={handleSymptomChange} value={symptomData.Gender || 0}>
                                                <option value="0">Male</option>
                                                <option value="1">Female</option>
                                            </select>
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Ethnicity (0-3)</label>
                                            <input type="number" name="Ethnicity" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" onChange={handleSymptomChange} value={symptomData.Ethnicity || ''} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Education Level (0-3)</label>
                                            <input type="number" name="EducationLevel" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" onChange={handleSymptomChange} value={symptomData.EducationLevel || ''} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">BMI</label>
                                            <input type="number" step="0.1" name="BMI" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" onChange={handleSymptomChange} value={symptomData.BMI || ''} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Alcohol (0-20)</label>
                                            <input type="number" step="0.1" name="AlcoholConsumption" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" onChange={handleSymptomChange} value={symptomData.AlcoholConsumption || ''} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Physical Activity (0-10)</label>
                                            <input type="number" step="0.1" name="PhysicalActivity" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" onChange={handleSymptomChange} value={symptomData.PhysicalActivity || ''} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Diet Quality (0-10)</label>
                                            <input type="number" step="0.1" name="DietQuality" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" onChange={handleSymptomChange} value={symptomData.DietQuality || ''} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Sleep Quality (4-10)</label>
                                            <input type="number" step="0.1" name="SleepQuality" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" onChange={handleSymptomChange} value={symptomData.SleepQuality || ''} />
                                        </div>
                                    </div>
                                </div>

                                {/* Section 3: Medical History & Clinical */}
                                <div className="bg-white p-6 rounded-lg border border-gray-200 shadow-sm">
                                    <h3 className="text-lg font-semibold mb-4 text-indigo-800">Medical History & Clinical Values</h3>

                                    <div className="mb-6">
                                        <h4 className="font-medium text-gray-700 mb-3">Medical Conditions</h4>
                                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                            {['FamilyHistoryAlzheimers', 'CardiovascularDisease', 'Diabetes', 'Depression', 'HeadInjury', 'Hypertension', 'Smoking'].map(item => (
                                                <label key={item} className="flex items-center space-x-2">
                                                    <input type="checkbox" name={item} onChange={handleSymptomChange} checked={symptomData[item] === 1} className="rounded text-indigo-600 focus:ring-indigo-500" />
                                                    <span className="text-sm text-gray-700">{item.replace(/([A-Z])/g, ' $1').trim()}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 border-t pt-6">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Cholesterol Total</label>
                                            <input type="number" step="0.1" name="CholesterolTotal" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" onChange={handleSymptomChange} value={symptomData.CholesterolTotal || ''} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Cholesterol LDL</label>
                                            <input type="number" step="0.1" name="CholesterolLDL" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" onChange={handleSymptomChange} value={symptomData.CholesterolLDL || ''} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Cholesterol HDL</label>
                                            <input type="number" step="0.1" name="CholesterolHDL" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" onChange={handleSymptomChange} value={symptomData.CholesterolHDL || ''} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Triglycerides</label>
                                            <input type="number" step="0.1" name="CholesterolTriglycerides" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" onChange={handleSymptomChange} value={symptomData.CholesterolTriglycerides || ''} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">MMSE</label>
                                            <input type="number" step="0.1" name="MMSE" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" onChange={handleSymptomChange} value={symptomData.MMSE || ''} />
                                        </div>
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700">Functional Assessment</label>
                                            <input type="number" step="0.1" name="FunctionalAssessment" className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2" onChange={handleSymptomChange} value={symptomData.FunctionalAssessment || ''} />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {activeTab === 'symptom' && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6">Alzheimer's Symptom Checker</h2>
                            <p className="mb-6 text-gray-600">
                                Select any symptoms you are experiencing to assess potential risks.
                            </p>

                            <form onSubmit={handleSymptomSubmit} className="space-y-6">
                                {/* Detailed Symptom Tracker */}
                                <div className="space-y-6">
                                    {/* Memory */}
                                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                                        <h4 className="font-semibold text-blue-800 mb-3 flex items-center">
                                            <span className="text-2xl mr-2">🧠</span> Memory
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {['Memory loss', 'Memory worse than before', 'Repeats questions/statements', 'Misplaces items frequently', 'Gets lost in familiar places', 'Decreased sense of direction'].map((s, i) => (
                                                <label key={i} className="flex items-center space-x-2 cursor-pointer hover:bg-blue-100 p-2 rounded transition">
                                                    <input type="checkbox" name={`Memory_${i}`} className="form-checkbox h-5 w-5 text-blue-600" onChange={handleSymptomChange} checked={!!symptomData[`Memory_${i}`]} />
                                                    <span className="text-gray-700">{s}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Disorientation & Cognitive Decline */}
                                    <div className="bg-purple-50 p-4 rounded-lg border border-purple-100">
                                        <h4 className="font-semibold text-purple-800 mb-3 flex items-center">
                                            <span className="text-2xl mr-2">😵</span> Disorientation & Cognitive Decline
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {['Trouble knowing date/day/month', 'Disoriented in unfamiliar places', 'Confused outside home/travel', 'Trouble finding common words', 'Confuses names', 'Difficulty recognizing familiar people'].map((s, i) => (
                                                <label key={i} className="flex items-center space-x-2 cursor-pointer hover:bg-purple-100 p-2 rounded transition">
                                                    <input type="checkbox" name={`Disorientation_${i}`} className="form-checkbox h-5 w-5 text-purple-600" onChange={handleSymptomChange} checked={!!symptomData[`Disorientation_${i}`]} />
                                                    <span className="text-gray-700">{s}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Daily Activities & Executive Function */}
                                    <div className="bg-green-50 p-4 rounded-lg border border-green-100">
                                        <h4 className="font-semibold text-green-800 mb-3 flex items-center">
                                            <span className="text-2xl mr-2">📝</span> Daily Activities & Executive Function
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {['Trouble tracking events/appointments', 'Trouble handling money', 'Trouble paying bills/do finances', 'Trouble with medications', 'Trouble using appliances', 'Stops/reduces usual activities', 'Difficulty organizing complex tasks'].map((s, i) => (
                                                <label key={i} className="flex items-center space-x-2 cursor-pointer hover:bg-green-100 p-2 rounded transition">
                                                    <input type="checkbox" name={`Activities_${i}`} className="form-checkbox h-5 w-5 text-green-600" onChange={handleSymptomChange} checked={!!symptomData[`Activities_${i}`]} />
                                                    <span className="text-gray-700">{s}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Behaviour & Safety */}
                                    <div className="bg-red-50 p-4 rounded-lg border border-red-100">
                                        <h4 className="font-semibold text-red-800 mb-3 flex items-center">
                                            <span className="text-2xl mr-2">⚠️</span> Behaviour & Safety
                                        </h4>
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                            {['Irritability', 'Agitation', 'Breaks social rules / childish behavior', 'Poor judgment'].map((s, i) => (
                                                <label key={i} className="flex items-center space-x-2 cursor-pointer hover:bg-red-100 p-2 rounded transition">
                                                    <input type="checkbox" name={`Behaviour_${i}`} className="form-checkbox h-5 w-5 text-red-600" onChange={handleSymptomChange} checked={!!symptomData[`Behaviour_${i}`]} />
                                                    <span className="text-gray-700">{s}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Language & Awareness */}
                                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                        <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-100">
                                            <h4 className="font-semibold text-yellow-800 mb-3 flex items-center">
                                                <span className="text-2xl mr-2">🗣️</span> Language
                                            </h4>
                                            <div className="space-y-2">
                                                {['Language/pronunciation errors', 'Trouble understanding meaning of words'].map((s, i) => (
                                                    <label key={i} className="flex items-center space-x-2 cursor-pointer hover:bg-yellow-100 p-2 rounded transition">
                                                        <input type="checkbox" name={`Language_${i}`} className="form-checkbox h-5 w-5 text-yellow-600" onChange={handleSymptomChange} checked={!!symptomData[`Language_${i}`]} />
                                                        <span className="text-gray-700">{s}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>

                                        <div className="bg-indigo-50 p-4 rounded-lg border border-indigo-100">
                                            <h4 className="font-semibold text-indigo-800 mb-3 flex items-center">
                                                <span className="text-2xl mr-2">👁️</span> Awareness
                                            </h4>
                                            <div className="space-y-2">
                                                {['Awareness of problems'].map((s, i) => (
                                                    <label key={i} className="flex items-center space-x-2 cursor-pointer hover:bg-indigo-100 p-2 rounded transition">
                                                        <input type="checkbox" name={`Awareness_${i}`} className="form-checkbox h-5 w-5 text-indigo-600" onChange={handleSymptomChange} checked={!!symptomData[`Awareness_${i}`]} />
                                                        <span className="text-gray-700">{s}</span>
                                                    </label>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="flex justify-end">
                                    <button type="submit" className="bg-indigo-600 text-white py-3 px-8 rounded-md hover:bg-indigo-700 text-lg font-semibold shadow-md">
                                        Check Symptoms
                                    </button>
                                </div>
                            </form>

                            {predictionResult && (
                                <div className={`mt-8 p-6 rounded-lg border-l-4 shadow-md ${predictionResult.stage_code === 0 ? 'bg-green-50 border-green-500' :
                                        predictionResult.stage_code === 1 ? 'bg-yellow-50 border-yellow-500' :
                                            predictionResult.stage_code === 2 ? 'bg-orange-50 border-orange-500' :
                                                'bg-red-50 border-red-500'
                                    }`}>
                                    <h3 className="text-2xl font-bold mb-2 text-gray-800">Result: {predictionResult.prediction}</h3>
                                    <p className="text-gray-600 mb-4">Confidence: {(predictionResult.probability * 100).toFixed(1)}%</p>

                                    <div className="bg-white p-4 rounded border border-gray-100">
                                        <h4 className="font-semibold text-gray-900 mb-2">Suggestions:</h4>
                                        <ul className="list-disc list-inside space-y-1 text-gray-700">
                                            {predictionResult.suggestions.map((s, i) => <li key={i}>{s}</li>)}
                                        </ul>
                                    </div>

                                    {/* Dynamic Response based on Stage */}
                                    {predictionResult.stage_code === 0 ? (
                                        <div className="mt-6 bg-teal-50 p-4 rounded border border-teal-100">
                                            <h4 className="font-semibold text-teal-800 mb-2">💡 Healthy Living Tips</h4>
                                            <ul className="list-disc list-inside space-y-1 text-teal-700 text-sm">
                                                <li>Maintain a balanced diet rich in antioxidants and omega-3 fatty acids.</li>
                                                <li>Engage in regular physical exercise (at least 150 mins/week).</li>
                                                <li>Keep your mind active with puzzles, reading, or learning new skills.</li>
                                                <li>Ensure quality sleep and manage stress levels.</li>
                                            </ul>
                                        </div>
                                    ) : (
                                        <div className="mt-6 flex justify-center">
                                            <button
                                                onClick={() => navigate('/consultancy', { state: { stage_code: predictionResult.stage_code } })}
                                                className="bg-teal-600 text-white px-6 py-2 rounded-md hover:bg-teal-700 transition-colors duration-200 font-medium flex items-center"
                                            >
                                                Consultancy and Treatment
                                            </button>
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    )}

                    {activeTab === 'general' && (
                        <div>
                            <h2 className="text-2xl font-bold mb-6">General Symptom Checker</h2>
                            <p className="mb-6 text-gray-600">Select symptoms to check for common illnesses (Flu, Cold, etc.).</p>

                            <form onSubmit={handleGeneralSubmit} className="space-y-6">
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                                    {symptomsList.map((symptom) => (
                                        <div
                                            key={symptom.key}
                                            onClick={() => toggleGeneralSymptom(symptom.key)}
                                            className={`cursor-pointer p-4 rounded-lg border transition flex flex-col items-center justify-center text-center space-y-2
                                                ${generalSymptoms[symptom.key]
                                                    ? 'bg-teal-50 border-teal-500 ring-2 ring-teal-200'
                                                    : 'bg-white border-gray-200 hover:border-teal-300 hover:shadow-sm'}`}
                                        >
                                            <span className="text-3xl">{symptom.icon}</span>
                                            <span className={`font-medium ${generalSymptoms[symptom.key] ? 'text-teal-700' : 'text-gray-700'}`}>
                                                {symptom.label}
                                            </span>
                                            {generalSymptoms[symptom.key] && (
                                                <div className="absolute top-2 right-2 text-teal-600">
                                                    <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20"><path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" /></svg>
                                                </div>
                                            )}
                                        </div>
                                    ))}
                                </div>

                                <div className="flex justify-end">
                                    <button type="submit" className="bg-teal-600 text-white py-3 px-8 rounded-md hover:bg-teal-700 text-lg font-semibold shadow-md">
                                        Check General Symptoms
                                    </button>
                                </div>
                            </form>

                            {generalResult && (
                                <div className="mt-8 p-6 bg-white rounded-lg border border-gray-200 shadow-md">
                                    <h3 className="text-2xl font-bold mb-2 text-gray-800">Prediction: {generalResult.prediction}</h3>
                                    <p className="text-gray-600 mb-4 italic">{generalResult.details}</p>

                                    {generalResult.matches && generalResult.matches.length > 1 && (
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <h4 className="font-semibold text-gray-700 mb-2">Other possibilities:</h4>
                                            <ul className="space-y-1">
                                                {generalResult.matches.slice(1).map((m, i) => (
                                                    <li key={i} className="text-sm text-gray-600 flex justify-between max-w-xs">
                                                        <span>{m.disease}</span>
                                                        <span className="font-mono text-gray-400">{(m.probability * 100).toFixed(0)}%</span>
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    )}
                                    <div className="mt-4 p-3 bg-yellow-50 text-yellow-800 text-sm rounded border border-yellow-200">
                                        <strong>Disclaimer:</strong> This is an AI-based estimation and not a medical diagnosis. Please consult a doctor.
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default MainPage;
