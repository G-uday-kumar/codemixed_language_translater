# Language Translator UI

A modern, interactive web-based language translator application that supports multiple Indian languages including English, Kannada, Hindi, Telugu, Tamil, and Malayalam.

## Features

### 🌐 Multi-Language Support
- **English** (en)
- **Kannada** (kn)
- **Hindi** (hi)
- **Telugu** (te)
- **Tamil** (ta)
- **Malayalam** (ml)

### 🎯 Core Functionality
- **Real-time Translation**: Instant translation as you type
- **Bidirectional Translation**: Translate in both directions
- **Language Swapping**: Quick swap between source and target languages
- **Custom Translations**: Add your own translation pairs

### 🎤 Voice Features
- **Voice Input**: Speak to input text (if supported by browser)
- **Voice Output**: Listen to translated text (Text-to-Speech)

### 📋 Additional Features
- **Copy to Clipboard**: Copy translated text easily
- **Clear Input**: Quick clear functionality
- **Example Translations**: Pre-loaded examples for quick testing
- **Responsive Design**: Works on desktop and mobile devices

## How to Use

### Basic Translation
1. Select source language from the "From" dropdown
2. Select target language from the "To" dropdown
3. Type or paste text in the input area
4. Translation appears automatically in the output area

### Quick Actions
- **Swap Languages**: Click the ⇄ button to swap source and target languages
- **Voice Input**: Click the 🎤 button to use voice input
- **Voice Output**: Click the 🔊 button to hear the translation
- **Copy Text**: Click the "Copy" button to copy translation to clipboard
- **Clear**: Click the "Clear" button to clear input text

### Adding Custom Translations
1. Click the "Add Translation" button
2. Fill in the source text and translated text
3. Select the appropriate languages
4. Click "Add Translation" to save

### Using Examples
- Click on any example card in the "Example Translations" section
- It will automatically populate the input field and set the correct languages
- The translation will be displayed immediately

## File Structure

```
language-translator-ui/
├── index.html          # Main HTML structure
├── styles.css          # CSS styling and responsive design
├── script.js           # JavaScript functionality and translation logic
└── README.md           # This documentation file
```

## Technical Implementation

### Translation Database
The application uses a nested JavaScript object structure to store translations:
```javascript
translationDatabase = {
    [sourceLang]: {
        [targetLang]: {
            [sourceText]: translatedText
        }
    }
}
```

### Key Features Implementation
- **Real-time Translation**: Event listeners on input and language selection
- **Voice Recognition**: Uses Web Speech API for voice input
- **Text-to-Speech**: Uses Speech Synthesis API for voice output
- **Responsive Design**: CSS Grid and Flexbox for mobile compatibility

### Browser Compatibility
- Modern browsers with ES6+ support
- Speech Recognition: Chrome, Edge (requires HTTPS in production)
- Text-to-Speech: Most modern browsers

## Sample Translations

The application comes pre-loaded with sample translations including:

**Kannada to English:**
- "Nanage pencil bekagide, can you give it to me?" → "I want pencil, can you give it to me?"
- "Avaru office-ige hodaru, but he forgot his tiffin box." → "He went to office, but he forgot his tiffin box."
- "Eega time estu?" → "What is the time now?"

**English to Hindi:**
- "Hello" → "नमस्ते"
- "Thank you" → "धन्यवाद"
- "Good morning" → "सुप्रभात"

## Running the Application

1. Open `index.html` in any modern web browser
2. No server required - runs entirely in the browser
3. For full voice functionality, serve over HTTPS in production

## Customization

### Adding New Languages
1. Add language code to `languageNames` object
2. Add language options to HTML select elements
3. Add translation data to `translationDatabase`

### Styling
- Modify `styles.css` for custom appearance
- Responsive design adapts to different screen sizes
- Modern gradient design with smooth animations

## Integration with Java Backend

This UI can be easily integrated with the provided Java `LanguageTranslationApp` class:

1. Set up a web server to serve the HTML files
2. Create API endpoints that call the Java translation methods
3. Replace the JavaScript translation database with API calls
4. The UI structure and functionality remain the same

## License

This project is open source and available for educational and personal use.
