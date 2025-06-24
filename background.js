// PromptTune Chrome Extension - Background Service Worker

// Extension installation handler
chrome.runtime.onInstalled.addListener((details) => {
    console.log('PromptTune extension installed/updated:', details.reason);
    
    if (details.reason === 'install') {
        // Set default settings on first install
        chrome.storage.sync.set({
            promptTuneSettings: {
                ollamaEndpoint: 'http://localhost:11434',
                modelName: 'llama2',
                temperature: 0.3
            }
        });
        
        // Open welcome page or show notification
        showWelcomeNotification();
    }
});

// Show welcome notification (requires notifications permission)
function showWelcomeNotification() {
    // Note: Notifications removed for Chrome Web Store compatibility
    // If you need notifications, add "notifications" permission to manifest.json
    console.log('PromptTune Installed! Make sure Ollama is running with LLaMA 2 model.');
}

// Handle extension icon click
chrome.action.onClicked.addListener((tab) => {
    // This will open the popup automatically due to manifest configuration
    console.log('Extension icon clicked on tab:', tab.url);
});

// Handle messages from popup or content scripts
chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    console.log('Background received message:', request);
    
    switch (request.action) {
        case 'checkOllamaConnection':
            checkOllamaConnection(request.endpoint)
                .then(result => sendResponse(result))
                .catch(error => sendResponse({ success: false, error: error.message }));
            return true; // Keep message channel open for async response
            
        case 'optimizePrompt':
            optimizePromptViaOllama(request.prompt, request.settings)
                .then(result => sendResponse(result))
                .catch(error => sendResponse({ success: false, error: error.message }));
            return true;
            
        case 'insertTextIntoPage':
            insertTextIntoActivePage(request.text, sender.tab)
                .then(result => sendResponse(result))
                .catch(error => sendResponse({ success: false, error: error.message }));
            return true;
            
        default:
            console.log('Unknown action:', request.action);
            sendResponse({ success: false, error: 'Unknown action' });
    }
});

// Check Ollama connection
async function checkOllamaConnection(endpoint) {
    try {
        const response = await fetch(`${endpoint}/api/tags`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json'
            }
        });
        
        if (response.ok) {
            const data = await response.json();
            return {
                success: true,
                models: data.models || [],
                endpoint: endpoint
            };
        } else {
            return {
                success: false,
                error: `HTTP ${response.status}: ${response.statusText}`
            };
        }
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

// Optimize prompt via Ollama
async function optimizePromptViaOllama(prompt, settings) {
    try {
        const response = await fetch(`${settings.ollamaEndpoint}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                model: settings.modelName,
                messages: [
                    {
                        role: 'system',
                        content: 'You are a prompt optimization expert. Rewrite the user\'s prompt to be clearer, more specific, and more effective. Output only the improved prompt, no explanations. Read the user\'s prompt and catch the tone. Role, Context, Task, Output Format and Tone should be mentioned. Try to be as neutral as possible.'
                    },
                    {
                        role: 'user',
                        content: `Optimize this prompt: "${prompt}"`
                    }
                ],
                stream: false,
                options: {
                    temperature: settings.temperature,
                    top_p: 0.8,
                    num_predict: 250
                }
            })
        });

        if (!response.ok) {
            throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
        }

        const data = await response.json();
        let optimizedPrompt = data.message.content.trim();
        
        // Clean up the response (same logic as in popup.js)
        const unwantedPhrases = [
            'Here is an optimized prompt',
            'Here\'s an optimized prompt',
            'The optimized prompt is',
            'Optimized prompt:',
            'Improved prompt:',
            'Sure! Here is',
            'Here is your optimized prompt:',
            'Here\'s the improved prompt:',
            'Rewritten prompt:'
        ];
        
        for (const phrase of unwantedPhrases) {
            if (optimizedPrompt.toLowerCase().startsWith(phrase.toLowerCase())) {
                optimizedPrompt = optimizedPrompt.substring(phrase.length).trim();
                if (optimizedPrompt.startsWith(':')) {
                    optimizedPrompt = optimizedPrompt.substring(1).trim();
                }
            }
        }
        
        // Remove quotes if the entire response is wrapped in them
        if (optimizedPrompt.startsWith('"') && optimizedPrompt.endsWith('"')) {
            optimizedPrompt = optimizedPrompt.slice(1, -1).trim();
        }

        return {
            success: true,
            original: prompt,
            optimized: optimizedPrompt,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

// Insert text into active page
async function insertTextIntoActivePage(text, tab) {
    try {
        const results = await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            function: (textToInsert) => {
                const activeElement = document.activeElement;
                
                if (activeElement && (
                    activeElement.tagName === 'INPUT' || 
                    activeElement.tagName === 'TEXTAREA' || 
                    activeElement.isContentEditable
                )) {
                    if (activeElement.isContentEditable) {
                        activeElement.innerText = textToInsert;
                    } else {
                        activeElement.value = textToInsert;
                        activeElement.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                    return { success: true, target: 'active element' };
                } else {
                    // Try to find common text input selectors
                    const selectors = [
                        'input[type="text"]:focus',
                        'textarea:focus',
                        '[contenteditable="true"]:focus',
                        'input[type="text"]',
                        'textarea',
                        '[contenteditable="true"]'
                    ];
                    
                    let targetElement = null;
                    for (const selector of selectors) {
                        targetElement = document.querySelector(selector);
                        if (targetElement) break;
                    }
                    
                    if (targetElement) {
                        if (targetElement.isContentEditable) {
                            targetElement.innerText = textToInsert;
                        } else {
                            targetElement.value = textToInsert;
                            targetElement.dispatchEvent(new Event('input', { bubbles: true }));
                        }
                        targetElement.focus();
                        return { success: true, target: 'found element' };
                    } else {
                        return { success: false, error: 'No suitable text field found' };
                    }
                }
            },
            args: [text]
        });
        
        return results[0].result;
    } catch (error) {
        return {
            success: false,
            error: error.message
        };
    }
}

// Handle context menu creation (optional future feature)
chrome.runtime.onStartup.addListener(() => {
    console.log('PromptTune extension started');
});

// Cleanup on extension suspension
chrome.runtime.onSuspend.addListener(() => {
    console.log('PromptTune extension suspending');
});

// Note: Alarm functionality removed for Chrome Web Store compatibility
// If you need periodic health checks, you can add "alarms" permission to manifest.json

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        checkOllamaConnection,
        optimizePromptViaOllama,
        insertTextIntoActivePage
    };
} 