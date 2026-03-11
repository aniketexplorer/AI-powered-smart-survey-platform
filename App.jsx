import React, { useState, useEffect, useMemo, useRef } from 'react';
// --- CORRECTED IMPORTS ---
// We get the initialized auth and db services from our firebase.js file
import { auth, db } from './firebase'; 

// We get the specific FUNCTIONS we need from the Firebase SDK
import { signInAnonymously, onAuthStateChanged, signInWithCustomToken } from 'firebase/auth';
import { 
    collection, addDoc, doc, getDoc, 
    setDoc, onSnapshot, query, serverTimestamp, 
    updateDoc, deleteDoc, where, getDocs
} from 'firebase/firestore';
// --- End of corrected imports ---


// --- Helper Components & Icons ---

const IconPlus = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2"><path d="M5 12h14" /><path d="M12 5v14" /></svg>
);

const IconSparkles = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z" /><path d="M18 10h.01" /><path d="M12 21a6 6 0 0 0-9-9 9 9 0 0 1 9 9Z" /><path d="M6 14h.01" /><path d="M21 12a6 6 0 0 0-9-9 9 9 0 0 1 9 9Z" /></svg>
);

const IconClock = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6 mr-2 text-slate-500"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
);


const IconBarChart = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2"><line x1="12" y1="20" x2="12" y2="10" /><line x1="18" y1="20" x2="18" y2="4" /><line x1="6" y1="20" x2="6" y2="16" /></svg>
);

const IconClipboardList = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2"><rect x="8" y="2" width="8" height="4" rx="1" ry="1" /><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" /><path d="M12 11h4" /><path d="M12 16h4" /><path d="M8 11h.01" /><path d="M8 16h.01" /></svg>
);

const IconArrowLeft = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2"><path d="m12 19-7-7 7-7" /><path d="M19 12H5" /></svg>
);

const IconShare = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4 mr-2"><path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" /><polyline points="16 6 12 2 8 6" /><line x1="12" y1="2" x2="12" y2="15" /></svg>
);

const IconCopy = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect><path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path></svg>
);

const IconMail = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path><polyline points="22,6 12,13 2,6"></polyline></svg>
);

const IconMessageSquare = () => (
     <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5 mr-2"><path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path></svg>
);

const IconX = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-6 w-6"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
);

const IconTrash = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-5 w-5"><path d="M3 6h18" /><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6" /><path d="M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" /></svg>
);

const Spinner = () => (
    <div className="flex justify-center items-center h-full">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
    </div>
);

const Notification = ({ message, type, onDismiss }) => {
    if (!message) return null;

    const baseClasses = "fixed bottom-5 right-5 p-4 rounded-lg shadow-lg text-white transition-opacity duration-300 z-50";
    const typeClasses = {
        success: "bg-green-500",
        error: "bg-red-500",
        info: "bg-blue-500"
    };

    return (
        <div className={`${baseClasses} ${typeClasses[type] || 'bg-gray-800'}`}>
            <span>{message}</span>
            <button onClick={onDismiss} className="ml-4 font-bold">X</button>
        </div>
    );
};


// --- Main App Component ---

function App() {
    const [view, setView] = useState('list'); // 'list', 'create', 'take', 'results'
    const [selectedSurveyId, setSelectedSurveyId] = useState(null);
    const [surveys, setSurveys] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [notification, setNotification] = useState({ message: '', type: '' });
    
    // Firebase state
    // We NO LONGER need state for db or auth, since we import them directly
    const [userId, setUserId] = useState(null);
    const [isAuthReady, setIsAuthReady] = useState(false);

    // Use a stable, sanitized app ID for Firestore paths
    const appId = useMemo(() => {
        const rawAppId = typeof __app_id !== 'undefined' ? __app_id : 'default-app-id';
        return rawAppId.replace(/[\/.]/g, '_');
    }, []);


    // --- Authentication Effect ---
    // Runs once on mount to handle auth state
    useEffect(() => {
        const urlParams = new URLSearchParams(window.location.search);
        const viewParam = urlParams.get('view');
        const surveyIdParam = urlParams.get('surveyId');

        if (viewParam === 'take' && surveyIdParam) {
            setView('take');
            setSelectedSurveyId(surveyIdParam);
        } 

        // 'auth' is imported directly from './firebase.js'
        // This listener handles sign-in, sign-out, and initial auth state
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
            if (user) {
                // User is signed in
                setUserId(user.uid);
            } else {
                // User is signed out or not yet signed in
                try {
                    // Check for a custom token provided by the environment
                    if (typeof __initial_auth_token !== 'undefined' && __initial_auth_token) {
                        await signInWithCustomToken(auth, __initial_auth_token);
                    } else {
                        // Fallback to anonymous sign-in
                        await signInAnonymously(auth);
                    }
                } catch (error) {
                    console.error("Authentication error:", error);
                    showNotification("Could not authenticate.", "error");
                }
            }
            // Signal that auth check is complete
            setIsAuthReady(true);
        });
        
        // Clean up the subscription on unmount
        return () => unsubscribe();
    }, []); // Empty dependency array ensures this runs only once

    // --- Data Fetching Effect ---
    // Runs when auth is ready or appId changes
    useEffect(() => {
        // We use 'db' imported directly from './firebase.js'
        // Wait until auth is ready before trying to fetch data
        if (!isAuthReady) return; 
        
        setIsLoading(true);
        // Define the path to the surveys collection
        const surveysCollectionPath = `/artifacts/${appId}/public/data/surveys`;
        const q = query(collection(db, surveysCollectionPath)); // 'db' is the import

        // Set up a real-time listener
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const surveysData = [];
            querySnapshot.forEach((doc) => {
                surveysData.push({ id: doc.id, ...doc.data() });
            });
            // Sort surveys by creation date, newest first
            surveysData.sort((a, b) => b.createdAt?.seconds - a.createdAt?.seconds);
            setSurveys(surveysData);
            setIsLoading(false);
        }, (error) => {
            // Handle errors (e.g., missing Firestore rules)
            console.error("Error fetching surveys:", error);
            showNotification("Could not load surveys. Check Firestore rules.", "error");
            setIsLoading(false);
        });

        // Clean up the listener on unmount
        return () => unsubscribe();
    }, [isAuthReady, appId]); // Re-run if auth state or appId changes

    // --- Helper Functions ---

    const showNotification = (message, type = 'info') => {
        setNotification({ message, type });
        setTimeout(() => setNotification({ message: '', type: '' }), 4000);
    };

    const handleViewChange = (newView, surveyId = null) => {
        setView(newView);
        setSelectedSurveyId(surveyId);
    };

    // --- Content Rendering ---

    const renderContent = () => {
        // Show a spinner while loading or waiting for auth
        if (isLoading || !isAuthReady) {
            return <div className="flex justify-center items-center h-[calc(100vh-200px)]"><Spinner /></div>;
        }

        // Switch based on the current view state
        switch (view) {
            case 'create':
                return <SurveyCreator db={db} userId={userId} appId={appId} setView={handleViewChange} showNotification={showNotification} />;
            case 'take':
                return <SurveyTaker db={db} surveyId={selectedSurveyId} appId={appId} setView={handleViewChange} showNotification={showNotification} />;
            case 'results':
                return <SurveyResults db={db} surveyId={selectedSurveyId} appId={appId} setView={handleViewChange} />;
            default:
                return <SurveyList surveys={surveys} userId={userId} setView={handleViewChange} />;
        }
    };
    
    // --- Main JSX Output ---
    
    return (
        <div className="bg-slate-50 min-h-screen font-sans text-slate-800">
            <header className="bg-white shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between items-center py-4">
                        <h1 onClick={() => handleViewChange('list')} className="text-2xl font-bold text-indigo-600 cursor-pointer flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-7 w-7 mr-2" viewBox="0 0 20 20" fill="currentColor"><path d="M17.414 2.586a2 2 0 00-2.828 0L7 10.172V13h2.828l7.586-7.586a2 2 0 000-2.828z" /><path fillRule="evenodd" d="M2 6a2 2 0 012-2h4a1 1 0 010 2H4v10h10v-4a1 1 0 112 0v4a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" clipRule="evenodd" /></svg>
                            Indian Survey Platform
                        </h1>
                         {/* Display User ID for reference in multi-user apps */}
                        {userId && <div className="text-xs text-slate-500 bg-slate-100 px-2 py-1 rounded-md" title="Your User ID">User: {userId}</div>}
                    </div>
                </div>
            </header>
            <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {renderContent()}
            </main>
            <Notification message={notification.message} type={notification.type} onDismiss={() => setNotification({ message: '', type: '' })} />
        </div>
    );
}


// --- Child Components ---

function SurveyList({ surveys, setView, userId }) {
    const [isShareModalOpen, setIsShareModalOpen] = useState(false);
    const [sharingSurvey, setSharingSurvey] = useState(null);

    const handleOpenShareModal = (survey) => {
        setSharingSurvey(survey);
        setIsShareModalOpen(true);
    };

    const handleCloseShareModal = () => {
        setIsShareModalOpen(false);
        setSharingSurvey(null);
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h2 className="text-3xl font-bold text-slate-700">All Surveys</h2>
                <button onClick={() => setView('create')} className="flex items-center justify-center bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors">
                    <IconPlus /> Create Survey
                </button>
            </div>
            {surveys.length === 0 ? (
                <div className="text-center py-16 bg-white rounded-lg shadow">
                    <h3 className="text-xl font-semibold text-slate-600">No surveys yet!</h3>
                    <p className="text-slate-500 mt-2">Be the first one to create a survey.</p>
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {surveys.map(survey => (
                        <div key={survey.id} className="bg-white p-6 rounded-lg shadow-md hover:shadow-xl transition-shadow flex flex-col">
                            <h3 className="text-xl font-bold text-slate-800 mb-2 truncate">{survey.title}</h3>
                            <p className="text-slate-500 mb-4 flex-grow">{survey.description}</p>
                            <div className="border-t pt-4 mt-auto flex flex-col space-y-2">
                                <div className="flex space-x-2">
                                    <button onClick={() => setView('take', survey.id)} className="w-full flex items-center justify-center bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors">
                                        <IconClipboardList /> Take
                                    </button>
                                    <button onClick={() => setView('results', survey.id)} className="w-full flex items-center justify-center bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                                        <IconBarChart /> Results
                                    </button>
                                </div>
                                <button onClick={() => handleOpenShareModal(survey)} className="w-full flex items-center justify-center bg-gray-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-colors">
                                    <IconShare /> Share
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
            {isShareModalOpen && sharingSurvey && (
                <ShareModal survey={sharingSurvey} onClose={handleCloseShareModal} />
            )}
        </div>
    );
}

function ShareModal({ survey, onClose }) {
    const [copied, setCopied] = useState(false);
    // Construct the share URL based on the current window location
    const shareUrl = `${window.location.origin}${window.location.pathname}?view=take&surveyId=${survey.id}`;
    const modalRef = useRef();

    // Effect to close modal on outside click
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (modalRef.current && !modalRef.current.contains(event.target)) {
                onClose();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [onClose]);

    const copyToClipboard = () => {
        // Use document.execCommand for compatibility within iframes
        const textField = document.createElement('textarea');
        textField.innerText = shareUrl;
        document.body.appendChild(textField);
        textField.select();
        document.execCommand('copy');
        textField.remove();
        
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    // Pre-populate links for email and SMS
    const mailToLink = `mailto:?subject=${encodeURIComponent(`Please take this survey: ${survey.title}`)}&body=${encodeURIComponent(`You've been invited to take a survey. Please click the link to respond:\n\n${shareUrl}`)}`;
    const smsLink = `sms:?&body=${encodeURIComponent(`Survey: ${survey.title}\n${shareUrl}`)}`;

    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div ref={modalRef} className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg relative animate-fade-in-up">
                <button onClick={onClose} className="absolute top-4 right-4 text-gray-400 hover:text-gray-600">
                    <IconX />
                </button>
                <h3 className="text-2xl font-bold text-slate-800 mb-2">Share Survey</h3>
                <p className="text-slate-500 mb-4">Anyone with the link can respond.</p>
                
                <div className="flex items-center space-x-2 mb-4">
                    <input type="text" readOnly value={shareUrl} className="w-full px-3 py-2 border border-slate-300 rounded-md bg-slate-50 focus:outline-none" />
                    <button onClick={copyToClipboard} className="bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 w-28 text-center">
                        {copied ? 'Copied!' : 'Copy'}
                    </button>
                </div>

                <div className="flex flex-col sm:flex-row gap-3">
                    <a href={mailToLink} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center bg-blue-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors">
                        <IconMail /> Email
                    </a>
                    <a href={smsLink} target="_blank" rel="noopener noreferrer" className="w-full flex items-center justify-center bg-green-500 text-white font-semibold py-2 px-4 rounded-lg hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors">
                        <IconMessageSquare /> SMS
                    </a>
                </div>
            </div>
            {/* Simple fade-in-up animation for the modal */}
            <style>{`
                @keyframes fade-in-up {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
                .animate-fade-in-up { animation: fade-in-up 0.3s ease-out forwards; }
            `}</style>
        </div>
    );
}

function SurveyCreator({ db, userId, appId, setView, showNotification }) {
    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [questions, setQuestions] = useState([]);
    const [isSaving, setIsSaving] = useState(false);
    const [aiPrompt, setAiPrompt] = useState('');
    const [isGenerating, setIsGenerating] = useState(false);

    const addQuestion = () => {
        // Add a new blank multiple-choice question
        setQuestions([...questions, { text: '', type: 'multiple-choice', options: ['', ''] }]);
    };
    
    // --- Gemini API Call for AI Survey Generation ---
    const generateWithAI = async () => {
        if (!aiPrompt.trim()) {
            showNotification("Please enter a prompt to generate the survey.", "error");
            return;
        }
        setIsGenerating(true);
        try {
            // *** THIS IS THE FIX ***
            // Get the Gemini API key from environment variables
            const apiKey = import.meta.env.VITE_GEMINI_API_KEY || ""; 
            if (!apiKey) {
                throw new Error("VITE_GEMINI_API_KEY is not set in .env.local file.");
            }
            
            // Using a specific Gemini model version
            const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-09-2025:generateContent?key=${apiKey}`;
            
            // Define the JSON schema we want the AI to return
            const surveySchema = {
                type: "OBJECT",
                properties: {
                    title: { type: "STRING" },
                    description: { type: "STRING" },
                    questions: {
                        type: "ARRAY",
                        items: {
                            type: "OBJECT",
                            properties: {
                                text: { type: "STRING" },
                                type: { type: "STRING", enum: ["multiple-choice", "text"] },
                                options: { type: "ARRAY", items: { type: "STRING" } }
                            },
                            required: ["text", "type"]
                        }
                    }
                },
                required: ["title", "description", "questions"]
            };

            // Define the prompt for the AI
            const systemPrompt = `You are a helpful survey creation assistant. Generate a survey based on the user's prompt. The survey should have a concise title, a brief description, and between 3 to 7 questions. Each question must be either 'multiple-choice' or 'text'. For 'multiple-choice' questions, provide between 2 and 5 relevant options. Ensure your output strictly follows the provided JSON schema.`;
            const userQuery = `PROMPT: "${aiPrompt}"`;
            
            const payload = {
                contents: [{ parts: [{ text: userQuery }] }],
                systemInstruction: { parts: [{ text: systemPrompt }] },
                generationConfig: {
                    responseMimeType: "application/json",
                    responseSchema: surveySchema
                }
            };

            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                 const errorBody = await response.json(); // Read the error body as JSON
                console.error("API Error Response:", errorBody);
                // Display the specific error from Google AI
                const errorMessage = errorBody.error?.message || `API call failed with status: ${response.status}`;
                throw new Error(errorMessage);
            }

            const result = await response.json();
            
            // Process the AI response
             if (result.candidates && result.candidates[0].content && result.candidates[0].content.parts[0]) {
                const jsonText = result.candidates[0].content.parts[0].text;
                const surveyData = JSON.parse(jsonText);
                
                // Populate the form fields with the AI-generated data
                setTitle(surveyData.title || '');
                setDescription(surveyData.description || '');
                setQuestions(surveyData.questions.map(q => ({
                    text: q.text,
                    type: q.type,
                    // Ensure options array exists and has at least two empty strings if it's multiple-choice
                    options: q.type === 'multiple-choice' ? (q.options || ['','']) : []
                })) || []);
            } else {
                 console.warn("Invalid response structure from AI:", result);
                 throw new Error("Invalid response structure from AI.");
            }

        } catch (error) {
            console.error("Error generating survey with AI:", error);
            // Show the specific error message to the user
            showNotification(`AI Error: ${error.message}`, "error");
        } finally {
            setIsGenerating(false);
        }
    };

    // --- Form Handlers ---

    const handleQuestionChange = (index, field, value) => {
        const newQuestions = [...questions];
        newQuestions[index][field] = value;
        // If changing to 'text', clear options
        if (field === 'type' && value === 'text') {
            newQuestions[index].options = [];
        }
        // If changing to 'multiple-choice', add default options
        if (field === 'type' && value === 'multiple-choice' && newQuestions[index].options.length === 0) {
             newQuestions[index].options = ['', ''];
        }
        setQuestions(newQuestions);
    };

    const handleOptionChange = (qIndex, oIndex, value) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options[oIndex] = value;
        setQuestions(newQuestions);
    };

    const addOption = (qIndex) => {
        const newQuestions = [...questions];
        newQuestions[qIndex].options.push('');
        setQuestions(newQuestions);
    };
    
    const removeOption = (qIndex, oIndex) => {
        const newQuestions = [...questions];
        // Don't allow removing below 2 options
        if (newQuestions[qIndex].options.length <= 2) {
            showNotification("Multiple choice questions must have at least 2 options.", "error");
            return;
        }
        newQuestions[qIndex].options.splice(oIndex, 1);
        setQuestions(newQuestions);
    };

    const removeQuestion = (qIndex) => {
        const newQuestions = [...questions];
        newQuestions.splice(qIndex, 1);
        setQuestions(newQuestions);
    }

    // --- Save Survey to Firestore ---

    const saveSurvey = async () => {
        // Validation
        if (!title.trim()) {
            showNotification('Please provide a title.', 'error');
            return;
        }
         if (questions.length === 0) {
            showNotification('Please add at least one question.', 'error');
            return;
        }
        // Check for empty questions or options
        for (const q of questions) {
            if (!q.text.trim()) {
                showNotification('Please fill out all question text.', 'error');
                return;
            }
            if (q.type === 'multiple-choice') {
                for (const opt of q.options) {
                    if (!opt.trim()) {
                        showNotification('Please fill out all option text.', 'error');
                        return;
                    }
                }
            }
        }
        
        setIsSaving(true);
        try {
            // 1. Save the main survey document
            const surveysCollectionPath = `/artifacts/${appId}/public/data/surveys`;
            const surveyDocRef = await addDoc(collection(db, surveysCollectionPath), {
                title,
                description,
                creatorId: userId,
                createdAt: serverTimestamp()
            });

            // 2. Save each question as a sub-document
            const questionsCollectionPath = `/artifacts/${appId}/public/data/surveys/${surveyDocRef.id}/questions`;
            for (const question of questions) {
                await addDoc(collection(db, questionsCollectionPath), question);
            }
            
            showNotification('Survey saved successfully!', 'success');
            setView('list');
        } catch (error) {
            console.error("Error saving survey: ", error);
            showNotification('Failed to save survey. Please try again.', 'error');
        } finally {
            setIsSaving(false);
        }
    };
    
    // --- JSX Output for Creator ---
    
    return (
        <div className="max-w-4xl mx-auto">
            <button onClick={() => setView('list')} className="flex items-center text-indigo-600 font-semibold mb-6 hover:underline">
                <IconArrowLeft /> Back to Surveys
            </button>

            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-slate-800 mb-6 border-b pb-4">Create New Survey</h2>
                
                {/* AI Generation Section */}
                <div className="bg-indigo-50 border-2 border-dashed border-indigo-200 p-6 rounded-lg mb-8">
                     <h3 className="text-xl font-bold text-indigo-700 mb-3 flex items-center"><IconSparkles/>Create with AI</h3>
                     <p className="text-indigo-600 mb-4 text-sm">Describe the survey you want to create, and let AI do the heavy lifting.</p>
                     {/* *** THIS IS THE FIX *** */}
                     <textarea value={aiPrompt} onChange={e => setAiPrompt(e.target.value)} rows="3" placeholder="e.g., A weekly employee pulse survey about workload and team morale." className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 mb-3"></textarea>
                     <button onClick={generateWithAI} disabled={isGenerating} className="w-full flex items-center justify-center bg-indigo-600 text-white font-semibold py-2 px-4 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300">
                         {isGenerating ? 
                             <span className="flex items-center justify-center">
                                 <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                                 Generating...
                             </span> 
                             : 'Generate Survey'
                         }
                     </button>
                </div>

                {/* Manual Form Section */}
                <div className="mb-6">
                    <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">Survey Title</label>
                    <input type="text" id="title" value={title} onChange={e => setTitle(e.target.value)} placeholder="e.g., Customer Satisfaction Survey" className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                </div>

                <div className="mb-8">
                    <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">Description (Optional)</label>
                    <textarea id="description" value={description} onChange={e => setDescription(e.target.value)} rows="3" placeholder="A short description of your survey" className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"></textarea>
                </div>

                <h3 className="text-2xl font-bold text-slate-700 mb-4">Questions</h3>

                {questions.map((q, qIndex) => (
                    <div key={qIndex} className="bg-slate-50 p-6 rounded-lg mb-6 border border-slate-200 relative">
                        <button onClick={() => removeQuestion(qIndex)} className="absolute top-4 right-4 text-red-500 hover:text-red-700" title="Delete Question">
                           <IconTrash />
                        </button>
                        <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 mb-4">
                            <span className="font-bold text-slate-600 mb-2 sm:mb-0">Q{qIndex + 1}</span>
                            <input type="text" value={q.text} onChange={e => handleQuestionChange(qIndex, 'text', e.target.value)} placeholder="Enter your question" className="flex-grow px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                            <select value={q.type} onChange={e => handleQuestionChange(qIndex, 'type', e.target.value)} className="mt-2 sm:mt-0 px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 bg-white">
                                <option value="multiple-choice">Multiple Choice</option>
                                <option value="text">Short Answer</option>
                            </select>
                        </div>
                        {q.type === 'multiple-choice' && (
                            <div className="pl-8">
                                {q.options.map((opt, oIndex) => (
                                    <div key={oIndex} className="flex items-center mb-2">
                                        <input type="text" value={opt} onChange={e => handleOptionChange(qIndex, oIndex, e.target.value)} placeholder={`Option ${oIndex + 1}`} className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" />
                                        <button onClick={() => removeOption(qIndex, oIndex)} className="ml-2 text-red-500 hover:text-red-700 p-1 rounded-full" title="Remove Option">
                                            <IconTrash />
                                        </button>
                                    </div>
                                ))}
                                <button onClick={() => addOption(qIndex)} className="text-sm text-indigo-600 font-semibold mt-2 hover:underline">Add Option</button>
                            </div>
                        )}
                    </div>
                ))}
                
                <button onClick={addQuestion} className="w-full flex items-center justify-center bg-slate-200 text-slate-700 font-semibold py-2 px-4 rounded-lg hover:bg-slate-300 focus:outline-none focus:ring-2 focus:ring-slate-400 focus:ring-offset-2 transition-colors mb-6">
                    <IconPlus /> Add Question
                </button>

                <div className="flex justify-end space-x-4">
                    <button onClick={() => setView('list')} className="bg-slate-100 text-slate-700 font-semibold py-2 px-6 rounded-lg hover:bg-slate-200">Cancel</button>
                    <button onClick={saveSurvey} disabled={isSaving} className="bg-indigo-600 text-white font-semibold py-2 px-6 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300 disabled:cursor-not-allowed">
                        {isSaving ? 'Saving...' : 'Save Survey'}
                    </button>
                </div>
            </div>
        </div>
    );
}

function SurveyTaker({ db, surveyId, appId, setView, showNotification }) {
    const [survey, setSurvey] = useState(null);
    const [questions, setQuestions] = useState([]);
    const [answers, setAnswers] = useState({});
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [startTime, setStartTime] = useState(null);
    
    // Fetch survey data when component mounts
    useEffect(() => {
        setStartTime(Date.now());
        if (!db || !surveyId) return;
        setIsLoading(true);

        let qUnsubscribe = null;

        const fetchSurvey = async () => {
            try {
                // 1. Fetch the main survey document
                const surveyDocPath = `/artifacts/${appId}/public/data/surveys/${surveyId}`;
                const surveyDoc = await getDoc(doc(db, surveyDocPath));
                if (surveyDoc.exists()) {
                    setSurvey({ id: surveyDoc.id, ...surveyDoc.data() });
                } else {
                    showNotification("Survey not found.", "error");
                    setIsLoading(false);
                    return;
                }

                // 2. Listen for changes to questions sub-collection
                const questionsCollectionPath = `/artifacts/${appId}/public/data/surveys/${surveyId}/questions`;
                qUnsubscribe = onSnapshot(collection(db, questionsCollectionPath), (snapshot) => {
                    const fetchedQuestions = [];
                    snapshot.forEach(doc => fetchedQuestions.push({ id: doc.id, ...doc.data() }));
                    setQuestions(fetchedQuestions);
                    setIsLoading(false);
                }, (error) => {
                     console.error("Error fetching questions:", error);
                     showNotification("Could not load questions.", "error");
                     setIsLoading(false);
                });
            } catch (error) {
                 console.error("Error fetching survey:", error);
                 showNotification("Failed to load survey.", "error");
                 setIsLoading(false);
            }
        };

        fetchSurvey();

        // Clean up the listener
        return () => {
             if (qUnsubscribe) qUnsubscribe();
        };
    }, [db, surveyId, appId, showNotification]);

    const handleAnswerChange = (questionId, value) => {
        setAnswers(prev => ({ ...prev, [questionId]: value }));
    };

    const handleSubmit = async () => {
        // Validate that all questions are answered
        if (Object.keys(answers).length !== questions.length) {
            showNotification('Please answer all questions before submitting.', 'error');
            return;
        }
        setIsSubmitting(true);
        const endTime = Date.now();
        const duration = endTime - startTime; // duration in milliseconds

        try {
            // Save the response to a sub-collection
            const responsesCollectionPath = `/artifacts/${appId}/public/data/surveys/${surveyId}/responses`;
            await addDoc(collection(db, responsesCollectionPath), {
                submittedAt: serverTimestamp(),
                answers: answers,
                paradata: { // Store metadata about the submission
                    duration: duration
                }
            });
            showNotification('Thank you for your response!', 'success');
            setView('list');
        } catch (error) {
            console.error('Error submitting response:', error);
            showNotification('Failed to submit. Please try again.', 'error');
        } finally {
            setIsSubmitting(false);
        }
    };

    if (isLoading) return <div className="flex justify-center items-center h-64"><Spinner /></div>;
    if (!survey) return <p className="text-center text-red-500">Survey not found.</p>;

    return (
        <div className="max-w-2xl mx-auto">
            <button onClick={() => setView('list')} className="flex items-center text-indigo-600 font-semibold mb-6 hover:underline">
                <IconArrowLeft /> Back to Surveys
            </button>
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-slate-800">{survey.title}</h2>
                <p className="text-slate-600 mt-2 mb-8 border-b pb-4">{survey.description}</p>
                
                <div className="space-y-6">
                    {questions.map((q, index) => (
                        <div key={q.id}>
                            <p className="font-semibold text-slate-700 mb-2">{index + 1}. {q.text}</p>
                            {q.type === 'multiple-choice' && (
                                <div className="space-y-2">
                                    {q.options.map((option, oIndex) => (
                                        <label key={oIndex} className="flex items-center p-3 rounded-md bg-slate-50 border border-slate-200 hover:bg-slate-100 cursor-pointer">
                                            <input 
                                                type="radio" 
                                                name={q.id} 
                                                value={option} 
                                                checked={answers[q.id] === option}
                                                onChange={(e) => handleAnswerChange(q.id, e.target.value)} 
                                                className="h-4 w-4 text-indigo-600 border-slate-300 focus:ring-indigo-500" 
                                            />
                                            <span className="ml-3 text-slate-800">{option}</span>
                                        </label>
                                    ))}
                                </div>
                            )}
                            {q.type === 'text' && (
                                <input 
                                    type="text" 
                                    value={answers[q.id] || ''}
                                    onChange={(e) => handleAnswerChange(q.id, e.target.value)} 
                                    className="w-full px-3 py-2 border border-slate-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500" 
                                />
                            )}
                        </div>
                    ))}
                </div>

                <button onClick={handleSubmit} disabled={isSubmitting} className="w-full mt-8 bg-indigo-600 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:bg-indigo-300">
                    {isSubmitting ? 'Submitting...' : 'Submit Response'}
                </button>
            </div>
        </div>
    );
}

function SurveyResults({ db, surveyId, appId, setView }) {
    const [survey, setSurvey] = useState(null);
    const [questions, setQuestions] =useState([]);
    const [responses, setResponses] = useState([]);
    const [isLoading, setIsLoading] = useState(true);

    // Fetch survey, questions, and responses
    useEffect(() => {
        if (!db || !surveyId) return;
        setIsLoading(true);
        let qUnsub = null;
        let rUnsub = null;

        const fetchSurveyData = async () => {
            try {
                const surveyDocPath = `/artifacts/${appId}/public/data/surveys/${surveyId}`;
                const surveyDoc = await getDoc(doc(db, surveyDocPath));
                if (surveyDoc.exists()) {
                    setSurvey({ id: surveyDoc.id, ...surveyDoc.data() });
                }

                const questionsCollectionPath = `/artifacts/${appId}/public/data/surveys/${surveyId}/questions`;
                qUnsub = onSnapshot(collection(db, questionsCollectionPath), (snapshot) => {
                    const fetchedQuestions = [];
                    snapshot.forEach(doc => fetchedQuestions.push({ id: doc.id, ...doc.data() }));
                    setQuestions(fetchedQuestions);
                });

                const responsesCollectionPath = `/artifacts/${appId}/public/data/surveys/${surveyId}/responses`;
                rUnsub = onSnapshot(collection(db, responsesCollectionPath), (snapshot) => {
                    const fetchedResponses = [];
                    snapshot.forEach(doc => fetchedResponses.push({ id: doc.id, ...doc.data() }));
                    setResponses(fetchedResponses);
                    setIsLoading(false);
                });
            } catch (error) {
                console.error("Error fetching results:", error);
                setIsLoading(false);
            }
        };

        fetchSurveyData();
        
        // Clean up listeners
        return () => {
            if (qUnsub) qUnsub();
            if (rUnsub) rUnsub();
        };
    }, [db, surveyId, appId]);
    
    // Calculate average completion time
    const averageDuration = useMemo(() => {
        if (responses.length === 0) return null;
        const totalDuration = responses.reduce((acc, res) => acc + (res.paradata?.duration || 0), 0);
        const avg = totalDuration / responses.length;
        const minutes = Math.floor(avg / 60000);
        const seconds = ((avg % 60000) / 1000).toFixed(0);
        return `${minutes}m ${seconds}s`;
    }, [responses]);

    // Process responses into aggregated data
    const resultsData = useMemo(() => {
        if (!questions.length) return {};
        const data = {};
        // Initialize data structure based on questions
        questions.forEach(q => {
            data[q.id] = { text: q.text, type: q.type, answers: [] };
            if (q.type === 'multiple-choice') {
                data[q.id].options = {};
                q.options.forEach(opt => data[q.id].options[opt] = 0);
            }
        });

        // Populate data with responses
        responses.forEach(res => {
            for (const [qid, answer] of Object.entries(res.answers)) {
                if (data[qid]) {
                    if (data[qid].type === 'multiple-choice') {
                        if (data[qid].options.hasOwnProperty(answer)) {
                            data[qid].options[answer]++;
                        }
                    } else {
                        data[qid].answers.push(answer);
                    }
                }
            }
        });

        return data;
    }, [questions, responses]);

    if (isLoading) return <div className="flex justify-center items-center h-64"><Spinner /></div>;
    if (!survey) return <p>Survey not found.</p>;
    
    return (
        <div className="max-w-4xl mx-auto">
            <button onClick={() => setView('list')} className="flex items-center text-indigo-600 font-semibold mb-6 hover:underline">
                <IconArrowLeft /> Back to Surveys
            </button>
            <div className="bg-white p-8 rounded-lg shadow-lg">
                <h2 className="text-3xl font-bold text-slate-800">{survey.title}</h2>
                <p className="text-slate-600 mt-2 mb-4">{survey.description}</p>
                 
                 {/* Summary Stats */}
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 border border-slate-200 p-4 rounded-lg mb-8">
                     <div className="flex items-center">
                         <IconClipboardList />
                         <div>
                             <p className="font-bold text-2xl text-slate-700">{responses.length}</p>
                             <p className="text-sm text-slate-500">Total Responses</p>
                         </div>
                     </div>
                      <div className="flex items-center">
                           <IconClock />
                           <div>
                             <p className="font-bold text-2xl text-slate-700">{averageDuration || 'N/A'}</p>
                             <p className="text-sm text-slate-500">Avg. Completion Time</p>
                           </div>
                      </div>
                 </div>

                {/* Individual Question Results */}
                <div className="space-y-8">
                    {Object.entries(resultsData).map(([qid, data], index) => (
                        <div key={qid} className="border-t pt-6">
                            <p className="font-bold text-lg text-slate-700 mb-4">{index + 1}. {data.text}</p>
                            
                            {/* Multiple Choice Chart */}
                            {data.type === 'multiple-choice' && (
                                <div className="space-y-3">
                                    {Object.entries(data.options).map(([option, count]) => {
                                        const totalVotes = Object.values(data.options).reduce((sum, val) => sum + val, 0);
                                        const percentage = totalVotes > 0 ? (count / totalVotes) * 100 : 0;
                                        return (
                                            <div key={option}>
                                                <div className="flex justify-between items-center mb-1 text-sm text-slate-600">
                                                    <span>{option}</span>
                                                    <span>{count} ({percentage.toFixed(1)}%)</span>
                                                </div>
                                                <div className="w-full bg-slate-200 rounded-full h-4">
                                                    <div className="bg-indigo-500 h-4 rounded-full" style={{ width: `${percentage}%` }}></div>
                                                </div>
                                            </div>
                                        );
                                    })}
                                </div>
                            )}
                            
                            {/* Short Answer List */}
                            {data.type === 'text' && (
                                <ul className="list-disc pl-5 space-y-2 max-h-60 overflow-y-auto bg-slate-50 p-4 rounded-md">
                                    {data.answers.length > 0 ? (
                                        data.answers.map((answer, i) => <li key={i} className="text-slate-700 italic">"{answer}"</li>)
                                    ) : (
                                        <p className="text-slate-500">No text responses yet.</p>
                                    )}
                                </ul>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}

export default App;

