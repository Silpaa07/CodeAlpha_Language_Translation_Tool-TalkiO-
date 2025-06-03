document.addEventListener('DOMContentLoaded', () => {
    const sourceTextarea = document.getElementById('sourceText');
    const sourceLanguageSelect = document.getElementById('sourceLanguage');
    const targetLanguageSelect = document.getElementById('targetLanguage');
    const translateButton = document.getElementById('translateButton');
    const translatedTextarea = document.getElementById('translatedText');
    const copyButton = document.getElementById('copyButton');
    const textToSpeechButton = document.getElementById('textToSpeechButton');

    // --- Language Population ---
    const languages = [
        { code: 'en', name: 'English' },
        { code: 'es', name: 'Spanish' },
        { code: 'fr', name: 'French' },
        { code: 'de', name: 'German' },
        { code: 'hi', name: 'Hindi' },
        { code: 'ja', name: 'Japanese' },
        { code: 'ko', name: 'Korean' },
        { code: 'zh-CN', name: 'Chinese (Simplified)' },
        // Add more languages as needed based on your chosen API's supported list
    ];

    function populateLanguages(selectElement) {
        languages.forEach(lang => {
            const option = document.createElement('option');
            option.value = lang.code;
            option.textContent = lang.name;
            selectElement.appendChild(option);
        });
    }

    populateLanguages(sourceLanguageSelect);
    populateLanguages(targetLanguageSelect);

    // Set default selections
    sourceLanguageSelect.value = 'en'; // Default source to English
    targetLanguageSelect.value = 'es'; // Default target to Spanish

    // --- Translation Logic ---
    translateButton.addEventListener('click', async () => {
        const textToTranslate = sourceTextarea.value.trim();
        const sourceLang = sourceLanguageSelect.value;
        const targetLang = targetLanguageSelect.value;

        if (!textToTranslate) {
            alert('Please enter text to translate.');
            return;
        }

        translatedTextarea.value = 'Translating...';

        try {
            // Make a request to your backend server
            const response = await fetch('/translate', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    text: textToTranslate,
                    sourceLang: sourceLang,
                    targetLang: targetLang
                }),
            });

            const data = await response.json();

            if (response.ok) {
                translatedTextarea.value = data.translatedText;
            } else {
                translatedTextarea.value = Error: ${data.error || 'Translation failed'};
                console.error('Translation error:', data.error);
            }
        } catch (error) {
            console.error('Network or server error:', error);
            translatedTextarea.value = 'Error: Could not connect to translation service.';
        }
    });

    // --- Copy Button Logic ---
    copyButton.addEventListener('click', () => {
        translatedTextarea.select();
        translatedTextarea.setSelectionRange(0, 99999); // For mobile devices
        document.execCommand('copy');
        alert('Translated text copied to clipboard!');
    });

    // --- Text-to-Speech Logic ---
    textToSpeechButton.addEventListener('click', () => {
        const textToSpeak = translatedTextarea.value;
        if (!textToSpeak) {
            alert('No text to speak.');
            return;
        }

        if ('speechSynthesis' in window) {
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            utterance.lang = targetLanguageSelect.value; // Use the target language for speech
            window.speechSynthesis.speak(utterance);
        } else {
            alert('Text-to-speech not supported in this browser.');
        }
    });
});
