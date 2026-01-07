// VERIFIED DATABASE - Only approved translations (used by users)
const verifiedDatabase = {
    "en": {
        "kn": {
            "Nanage pencil bekagide, can you give it to me?": "I want pencil, can you give it to me?",
            "Avaru office-ige hodaru, but he forgot his tiffin box.": "He went to office, but he forgot his tiffin box.",
            "Eega time estu?": "What is the time now?",
            "ninge ehtu Age?": "how old you are"
        },
        "hi": {
            "Hello": "नमस्ते",
            "How are you?": "आप कैसे हैं?",
            "Thank you": "धन्यवाद",
            "Good morning": "सुप्रभात"
        },
        "te": {
            "Hello": "హలో",
            "How are you?": "మీరు ఎలా ఉన్నారు?",
            "Thank you": "ధన్యవాదాలు",
            "Good morning": "శుభోదయం"
        },
        "ta": {
            "Hello": "வணக்கம்",
            "How are you?": "நீங்கள் எப்படி இருக்கிறீர்கள்?",
            "Thank you": "நன்றி",
            "Good morning": "காலை வணக்கம்"
        },
        "ml": {
            "Hello": "ഹലോ",
            "How are you?": "സുഖമാണോ?",
            "Thank you": "നന്ദി",
            "Good morning": "സുപ്രഭാതം"
        }
    },
    "kn": {
        "en": {
            "ನನಗೆ ಪೆನ್ಸಿಲ್ ಬೇಕಾಗಿದೆ, ನೀನು ಅದನ್ನು ನನಗೆ ಕೊಡಬಹುದಾ?": "I want pencil, can you give it to me?",
            "ಅವರು ಆಫೀಸ್‌ಗೆ ಹೋದರು, ಆದರೆ ಅವರು ತಮ್ಮ ಟಿಫಿನ್ ಬಾಕ್ಸ್ ಅನ್ನು ಮರೆತರು.": "He went to office, but he forgot his tiffin box.",
            "ಈಗ ಟೈಮ್ ಎಷ್ಟು?": "What is the time now?",
            "ನಿಮಗೆ ಎಷ್ಟು ವಯಸ್ಸು?": "How old are you?"
        }
    },
    "hi": {
        "en": {
            "नमस्ते": "Hello",
            "आप कैसे हैं?": "How are you?",
            "धन्यवाद": "Thank you",
            "सुप्रभात": "Good morning"
        }
    },
    "te": {
        "en": {
            "హలో": "Hello",
            "మీరు ఎలా ఉన్నారు?": "How are you?",
            "ధన్యవాదాలు": "Thank you",
            "శుభోదయం": "Good morning"
        }
    },
    "ta": {
        "en": {
            "வணக்கம்": "Hello",
            "நீங்கள் எப்படி இருக்கிறீர்கள்?": "How are you?",
            "நன்றி": "Thank you",
            "காலை வணக்கம்": "Good morning"
        }
    },
    "ml": {
        "en": {
            "ഹലോ": "Hello",
            "സുഖമാണോ?": "How are you?",
            "നന്ദി": "Thank you",
            "സുപ്രഭാതം": "Good morning"
        }
    }
};

// PENDING DATABASE - Translations waiting for admin approval
let pendingDatabase = [];

// USER POINTS SYSTEM - Track contributor rewards
let userPoints = {
    "user123": 25, // Example user
    "contributor1": 15,
    "translator": 8
};

// CURRENT USER (placeholder - in real app this would come from authentication)
let currentUser = "user123";

// TRANSLATION HISTORY
let translationHistory = [];

// DARK MODE STATE
let isDarkMode = false;

// Language names mapping
const languageNames = {
    "en": "English",
    "kn": "Kannada",
    "hi": "Hindi",
    "te": "Telugu",
    "ta": "Tamil",
    "ml": "Malayalam"
};

// DOM elements
const inputText = document.getElementById('input-text');
const outputText = document.getElementById('output-text');
const sourceLang = document.getElementById('source-lang');
const targetLang = document.getElementById('target-lang');
const examplesGrid = document.getElementById('examples-grid');
const userPointsDisplay = document.getElementById('user-points-display');
const darkModeToggle = document.getElementById('dark-mode-toggle');
const fileInput = document.getElementById('file-input');
const fileUploadBtn = document.getElementById('file-upload-btn');
const phoneticDisplay = document.getElementById('phonetic-display');

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    populateExamples();
    setupEventListeners();
    updateUserPointsDisplay();
    loadFromLocalStorage();
});

// Setup event listeners
function setupEventListeners() {
    // Auto-translate when input changes
    inputText.addEventListener('input', function() {
        if (inputText.value.trim()) {
            translateText();
        } else {
            outputText.textContent = 'Translation will appear here...';
            phoneticDisplay.textContent = '';
        }
    });

    // Translate when language selection changes
    sourceLang.addEventListener('change', translateText);
    targetLang.addEventListener('change', translateText);

    // Dark mode toggle
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', toggleDarkMode);
    }

    // File upload
    if (fileUploadBtn) {
        fileUploadBtn.addEventListener('click', () => fileInput.click());
    }
    if (fileInput) {
        fileInput.addEventListener('change', handleFileUpload);
    }
}

// Main translation function
function translateText() {
    const text = inputText.value.trim();
    const source = sourceLang.value;
    const target = targetLang.value;

    // ✅ Always pull the latest admin-approved translations
    refreshVerifiedFromStorage();

    if (!text) {
        outputText.textContent = 'Translation will appear here...';
        phoneticDisplay.textContent = '';
        return;
    }

    let translation = '';

    // (rest of the logic stays the same)

    // Check if translation exists in VERIFIED database only
    if (verifiedDatabase[source] && verifiedDatabase[source][target] && verifiedDatabase[source][target][text]) {
        translation = verifiedDatabase[source][target][text];
    } else {
        // Try reverse lookup (if target to source exists)
        if (verifiedDatabase[target] && verifiedDatabase[target][source] && verifiedDatabase[target][source][text]) {
            translation = verifiedDatabase[target][source][text];
        } else {
            translation = 'Translation not found. Try adding it to the database.';
        }
    }

    outputText.textContent = translation;

    // Add phonetic transliteration for certain languages
    updatePhoneticDisplay(text, source, target);

    // Add to history
    addToHistory(text, translation, source, target);

    // Save to localStorage
    saveToLocalStorage();
}

// Swap languages function
function swapLanguages() {
    const source = sourceLang.value;
    const target = targetLang.value;

    sourceLang.value = target;
    targetLang.value = source;

    // Swap text content
    const input = inputText.value;
    const output = outputText.textContent;

    inputText.value = output === 'Translation will appear here...' ? '' : output;
    outputText.textContent = input === 'Translation will appear here...' ? '' : input;

    translateText();
}

// Clear input function
function clearInput() {
    inputText.value = '';
    outputText.textContent = 'Translation will appear here...';
}

// Copy output to clipboard
function copyOutput() {
    const text = outputText.textContent;
    if (text && text !== 'Translation will appear here...') {
        navigator.clipboard.writeText(text).then(function() {
            showNotification('Text copied to clipboard!');
        }).catch(function(err) {
            console.error('Failed to copy: ', err);
        });
    }
}

// Text-to-speech for output
function speakOutput() {
    const text = outputText.textContent;
    if (text && text !== 'Translation will appear here...' && 'speechSynthesis' in window) {
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.lang = targetLang.value === 'en' ? 'en-US' :
                        targetLang.value === 'hi' ? 'hi-IN' :
                        targetLang.value === 'kn' ? 'kn-IN' :
                        targetLang.value === 'te' ? 'te-IN' :
                        targetLang.value === 'ta' ? 'ta-IN' :
                        targetLang.value === 'ml' ? 'ml-IN' : 'en-US';
        speechSynthesis.speak(utterance);
    }
}

// Voice input function
function startVoiceInput() {
    if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRecognition();

        recognition.continuous = false;
        recognition.interimResults = false;
        recognition.lang = sourceLang.value === 'en' ? 'en-US' :
                          sourceLang.value === 'hi' ? 'hi-IN' :
                          sourceLang.value === 'kn' ? 'kn-IN' :
                          sourceLang.value === 'te' ? 'te-IN' :
                          sourceLang.value === 'ta' ? 'ta-IN' :
                          sourceLang.value === 'ml' ? 'ml-IN' : 'en-US';

        recognition.onstart = function() {
            inputText.placeholder = 'Listening...';
        };

        recognition.onresult = function(event) {
            const transcript = event.results[0][0].transcript;
            inputText.value = transcript;
            translateText();
        };

        recognition.onerror = function(event) {
            console.error('Speech recognition error:', event.error);
            inputText.placeholder = 'Enter text to translate...';
        };

        recognition.onend = function() {
            inputText.placeholder = 'Enter text to translate...';
        };

        recognition.start();
    } else {
        alert('Speech recognition is not supported in this browser.');
    }
}

// Populate examples
function populateExamples() {
    const examples = [
        {
            source: "Nanage pencil bekagide, can you give it to me?",
            translation: "I want pencil, can you give it to me?",
            sourceLang: "kn",
            targetLang: "en"
        },
        {
            source: "Avaru office-ige hodaru, but he forgot his tiffin box.",
            translation: "He went to office, but he forgot his tiffin box.",
            sourceLang: "kn",
            targetLang: "en"
        },
        {
            source: "Eega time estu?",
            translation: "What is the time now?",
            sourceLang: "kn",
            targetLang: "en"
        },
        {
            source: "Hello",
            translation: "नमस्ते",
            sourceLang: "en",
            targetLang: "hi"
        },
        {
            source: "Thank you",
            translation: "धन्यवाद",
            sourceLang: "en",
            targetLang: "hi"
        }
    ];

    examples.forEach(example => {
        const exampleCard = document.createElement('div');
        exampleCard.className = 'example-card';
        exampleCard.innerHTML = `
            <h4>${languageNames[example.sourceLang]} → ${languageNames[example.targetLang]}</h4>
            <div class="example-text">${example.source}</div>
            <div class="example-translation">${example.translation}</div>
        `;
        exampleCard.addEventListener('click', function() {
            inputText.value = example.source;
            sourceLang.value = example.sourceLang;
            targetLang.value = example.targetLang;
            translateText();
        });
        examplesGrid.appendChild(exampleCard);
    });
}

// Show notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #28a745;
        color: white;
        padding: 10px 20px;
        border-radius: 6px;
        z-index: 1001;
        box-shadow: 0 4px 15px rgba(0,0,0,0.2);
    `;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Modal functions
function showAddTranslationModal() {
    document.getElementById('add-translation-modal').style.display = 'block';
    document.getElementById('new-source-text').focus();
}

function closeAddTranslationModal() {
    document.getElementById('add-translation-modal').style.display = 'none';
    document.getElementById('new-source-text').value = '';
    document.getElementById('new-target-text').value = '';
}

function addNewTranslation() {
    const sourceText = document.getElementById('new-source-text').value.trim();
    const targetText = document.getElementById('new-target-text').value.trim();
    const sourceLang = document.getElementById('new-source-lang').value;
    const targetLang = document.getElementById('new-target-lang').value;

    if (!sourceText || !targetText) {
        alert('Please fill in both source and target text.');
        return;
    }

    // Create pending translation object
    const pendingTranslation = {
        id: Date.now().toString(),
        sourceText: sourceText,
        targetText: targetText,
        sourceLang: sourceLang,
        targetLang: targetLang,
        submittedBy: currentUser,
        submittedAt: new Date().toISOString(),
        status: 'pending'
    };

    // Add to PENDING database (not verified yet)
    pendingDatabase.push(pendingTranslation);

    showNotification('Thank you! Your contribution is pending Admin review and rewards.');
    closeAddTranslationModal();

    // Save to localStorage
    saveToLocalStorage();

    // Refresh examples (only from verified database)
    examplesGrid.innerHTML = '';
    populateExamples();
}

// Close modal when clicking outside
window.addEventListener('click', function(event) {
    const modal = document.getElementById('add-translation-modal');
    if (event.target === modal) {
        closeAddTranslationModal();
    }
});

// NEW FUNCTIONS FOR ENHANCED FEATURES

// Update user points display
function updateUserPointsDisplay() {
    if (userPointsDisplay) {
        userPointsDisplay.textContent = `Points: ${userPoints[currentUser] || 0}`;
    }
}

// Toggle dark mode
function toggleDarkMode() {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle('dark-mode', isDarkMode);
    localStorage.setItem('darkMode', isDarkMode);
    showNotification(`Dark mode ${isDarkMode ? 'enabled' : 'disabled'}`);
}

// Handle file upload and bulk translation
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = function(e) {
        const content = e.target.result;
        const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 0);

        let translatedContent = '';
        sentences.forEach(sentence => {
            const trimmedSentence = sentence.trim();
            if (trimmedSentence) {
                const translation = translateSentence(trimmedSentence, sourceLang.value, targetLang.value);
                translatedContent += `${trimmedSentence}\n${translation}\n\n`;
            }
        });

        outputText.textContent = translatedContent;
        showNotification(`Translated ${sentences.length} sentences from file`);
    };
    reader.readAsText(file);
}

// Helper function for translating individual sentences
function translateSentence(text, source, target) {
    if (verifiedDatabase[source] && verifiedDatabase[source][target] && verifiedDatabase[source][target][text]) {
        return verifiedDatabase[source][target][text];
    } else if (verifiedDatabase[target] && verifiedDatabase[target][source] && verifiedDatabase[target][source][text]) {
        return verifiedDatabase[target][source][text];
    }
    return '[Translation not found]';
}

// Update phonetic display
function updatePhoneticDisplay(text, source, target) {
    if (!phoneticDisplay) return;

    // Simple phonetic transliteration for demonstration
    let phonetic = '';
    if (source === 'kn' && target === 'en') {
        phonetic = text.replace(/ನ/g, 'na').replace(/ಗೆ/g, 'ge').replace(/ಬೇಕು/g, 'beku');
    } else if (source === 'hi' && target === 'en') {
        phonetic = text.replace(/नमस्ते/g, 'namaste').replace(/आप/g, 'aap');
    }

    phoneticDisplay.textContent = phonetic ? `Phonetic: ${phonetic}` : '';
}

// Add to translation history
function addToHistory(sourceText, translatedText, sourceLang, targetLang) {
    const historyItem = {
        id: Date.now().toString(),
        sourceText,
        translatedText,
        sourceLang,
        targetLang,
        timestamp: new Date().toISOString()
    };

    translationHistory.unshift(historyItem);
    if (translationHistory.length > 50) {
        translationHistory = translationHistory.slice(0, 50); // Keep only last 50
    }
}

// Save data to localStorage
function saveToLocalStorage() {
    try {
        localStorage.setItem('pendingDatabase', JSON.stringify(pendingDatabase));
        localStorage.setItem('userPoints', JSON.stringify(userPoints));
        localStorage.setItem('translationHistory', JSON.stringify(translationHistory));
    } catch (e) {
        console.warn('Failed to save to localStorage:', e);
    }
}

// ✅ Helper: refresh verified database from localStorage
function refreshVerifiedFromStorage() {
    const savedVerified = localStorage.getItem('verifiedDatabase');
    if (!savedVerified) return;

    try {
        const parsedVerified = JSON.parse(savedVerified);

        Object.keys(parsedVerified).forEach(sourceLang => {
            if (!verifiedDatabase[sourceLang]) {
                verifiedDatabase[sourceLang] = {};
            }
            Object.keys(parsedVerified[sourceLang]).forEach(targetLang => {
                if (!verifiedDatabase[sourceLang][targetLang]) {
                    verifiedDatabase[sourceLang][targetLang] = {};
                }
                Object.assign(
                    verifiedDatabase[sourceLang][targetLang],
                    parsedVerified[sourceLang][targetLang]
                );
            });
        });
    } catch (err) {
        console.warn('Failed to refresh verified translations from storage:', err);
    }
}

// L
// oad data from localStorage
function loadFromLocalStorage() {
    try {
        const savedPending = localStorage.getItem('pendingDatabase');
        if (savedPending) {
            pendingDatabase = JSON.parse(savedPending);
        }

        const savedPoints = localStorage.getItem('userPoints');
        if (savedPoints) {
            userPoints = { ...userPoints, ...JSON.parse(savedPoints) };
        }

        // ✅ NEW: merge admin-approved translations into verifiedDatabase
        const savedVerified = localStorage.getItem('verifiedDatabase');
        if (savedVerified) {
            const parsedVerified = JSON.parse(savedVerified);

            Object.keys(parsedVerified).forEach(sourceLang => {
                if (!verifiedDatabase[sourceLang]) {
                    verifiedDatabase[sourceLang] = {};
                }
                Object.keys(parsedVerified[sourceLang]).forEach(targetLang => {
                    if (!verifiedDatabase[sourceLang][targetLang]) {
                        verifiedDatabase[sourceLang][targetLang] = {};
                    }
                    // Add/override translations from admin
                    Object.assign(
                        verifiedDatabase[sourceLang][targetLang],
                        parsedVerified[sourceLang][targetLang]
                    );
                });
            });
        }

        const savedHistory = localStorage.getItem('translationHistory');
        if (savedHistory) {
            translationHistory = JSON.parse(savedHistory);
        }

        const savedDarkMode = localStorage.getItem('darkMode');
        if (savedDarkMode) {
            isDarkMode = JSON.parse(savedDarkMode);
            document.body.classList.toggle('dark-mode', isDarkMode);
        }
    } catch (e) {
        console.warn('Failed to load from localStorage:', e);
    }
}
