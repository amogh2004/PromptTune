// PromptTune Chrome Extension - Popup Script

class PromptTuneExtension {
    constructor() {
        this.settings = {
            ollamaEndpoint: 'http://localhost:11434',
            modelName: 'llama2',
            temperature: 0.3
        };
        
        this.elements = {};
        this.init();
    }

    async init() {
        this.initElements();
        this.bindEvents();
        await this.loadSettings();
        await this.checkConnection();
        this.loadFromStorage();
    }

    initElements() {
        this.elements = {
            // Main elements
            originalPrompt: document.getElementById('originalPrompt'),
            optimizedPrompt: document.getElementById('optimizedPrompt'),
            optimizeBtn: document.getElementById('optimizeBtn'),
            clearBtn: document.getElementById('clearBtn'),
            copyBtn: document.getElementById('copyBtn'),
            insertBtn: document.getElementById('insertBtn'),
            
            // Status elements
            connectionStatus: document.getElementById('connectionStatus'),
            statusText: document.getElementById('statusText'),
            
            // Sections
            outputSection: document.getElementById('outputSection'),
            errorSection: document.getElementById('errorSection'),
            errorText: document.getElementById('errorText'),
            
            // Modal elements
            settingsModal: document.getElementById('settingsModal'),
            helpModal: document.getElementById('helpModal'),
            settingsBtn: document.getElementById('settingsBtn'),
            helpBtn: document.getElementById('helpBtn'),
            closeModal: document.getElementById('closeModal'),
            closeHelpModal: document.getElementById('closeHelpModal'),
            
            // Settings elements
            ollamaEndpoint: document.getElementById('ollamaEndpoint'),
            modelName: document.getElementById('modelName'),
            temperature: document.getElementById('temperature'),
            tempValue: document.getElementById('tempValue'),
            saveSettings: document.getElementById('saveSettings'),
            resetSettings: document.getElementById('resetSettings'),
            
            // Button text and spinner
            btnText: document.querySelector('.btn-text'),
            loadingSpinner: document.querySelector('.loading-spinner')
        };
    }

    bindEvents() {
        // Main functionality
        this.elements.optimizeBtn.addEventListener('click', () => this.optimizePrompt());
        this.elements.clearBtn.addEventListener('click', () => this.clearPrompts());
        this.elements.copyBtn.addEventListener('click', () => this.copyToClipboard());
        this.elements.insertBtn.addEventListener('click', () => this.insertIntoPage());
        
        // Modal controls
        this.elements.settingsBtn.addEventListener('click', () => this.openModal('settings'));
        this.elements.helpBtn.addEventListener('click', () => this.openModal('help'));
        this.elements.closeModal.addEventListener('click', () => this.closeModal('settings'));
        this.elements.closeHelpModal.addEventListener('click', () => this.closeModal('help'));
        
        // Settings
        this.elements.temperature.addEventListener('input', (e) => {
            this.elements.tempValue.textContent = e.target.value;
        });
        this.elements.saveSettings.addEventListener('click', () => this.saveSettings());
        this.elements.resetSettings.addEventListener('click', () => this.resetSettings());
        
        // Keyboard shortcuts
        this.elements.originalPrompt.addEventListener('keydown', (e) => {
            if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
                this.optimizePrompt();
            }
        });
        
        // Auto-save input
        this.elements.originalPrompt.addEventListener('input', () => {
            this.saveToStorage();
        });
        
        // Close modals on outside click
        [this.elements.settingsModal, this.elements.helpModal].forEach(modal => {
            modal.addEventListener('click', (e) => {
                if (e.target === modal) {
                    modal.style.display = 'none';
                }
            });
        });
    }

    async loadSettings() {
        try {
            const result = await chrome.storage.sync.get(['promptTuneSettings']);
            if (result.promptTuneSettings) {
                this.settings = { ...this.settings, ...result.promptTuneSettings };
                this.updateSettingsUI();
            }
        } catch (error) {
            console.error('Error loading settings:', error);
        }
    }

    async saveSettings() {
        this.settings.ollamaEndpoint = this.elements.ollamaEndpoint.value.trim();
        this.settings.modelName = this.elements.modelName.value.trim();
        this.settings.temperature = parseFloat(this.elements.temperature.value);
        
        try {
            await chrome.storage.sync.set({ promptTuneSettings: this.settings });
            await this.checkConnection();
            this.closeModal('settings');
            this.showNotification('Settings saved successfully!', 'success');
        } catch (error) {
            console.error('Error saving settings:', error);
            this.showNotification('Error saving settings', 'error');
        }
    }

    resetSettings() {
        this.settings = {
            ollamaEndpoint: 'http://localhost:11434',
            modelName: 'llama2',
            temperature: 0.3
        };
        this.updateSettingsUI();
    }

    updateSettingsUI() {
        this.elements.ollamaEndpoint.value = this.settings.ollamaEndpoint;
        this.elements.modelName.value = this.settings.modelName;
        this.elements.temperature.value = this.settings.temperature;
        this.elements.tempValue.textContent = this.settings.temperature;
    }

    async checkConnection() {
        this.updateStatus('checking', 'Checking connection...');
        
        try {
            // For Chrome Web Store version, we need to handle CORS differently
            const response = await fetch(`${this.settings.ollamaEndpoint}/api/tags`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                mode: 'cors'
            });
            
            if (response.ok) {
                const data = await response.json();
                const hasModel = data.models?.some(model => model.name.includes(this.settings.modelName));
                
                if (hasModel) {
                    this.updateStatus('online', 'Connected');
                } else {
                    this.updateStatus('offline', `Model '${this.settings.modelName}' not found`);
                }
            } else {
                this.updateStatus('offline', 'Ollama not responding');
            }
        } catch (error) {
            // Check if it's a CORS error (common when accessing localhost from web store extensions)
            if (error.name === 'TypeError' && error.message.includes('Failed to fetch')) {
                this.updateStatus('offline', 'CORS blocked - Use unpacked extension for localhost');
            } else {
                this.updateStatus('offline', 'Connection failed');
            }
        }
    }

    updateStatus(status, text) {
        this.elements.connectionStatus.className = `status-dot ${status}`;
        this.elements.statusText.textContent = text;
    }

    async optimizePrompt() {
        const originalText = this.elements.originalPrompt.value.trim();
        
        if (!originalText) {
            this.showError('Please enter a prompt to optimize');
            return;
        }
        
        this.setLoading(true);
        this.hideError();
        
        try {
            const optimizedText = await this.callOllamaAPI(originalText);
            this.displayResult(optimizedText);
            this.saveToStorage();
        } catch (error) {
            this.showError(error.message);
        } finally {
            this.setLoading(false);
        }
    }

    async callOllamaAPI(prompt) {
        const response = await fetch(`${this.settings.ollamaEndpoint}/api/chat`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            mode: 'cors',
            body: JSON.stringify({
                model: this.settings.modelName,
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
                    temperature: this.settings.temperature,
                    top_p: 0.8,
                    num_predict: 250
                }
            })
        });

        if (!response.ok) {
            if (response.status === 403) {
                throw new Error(`CORS Error: Cannot access localhost from Chrome Web Store extension. Please use the unpacked extension version for localhost Ollama. Visit chrome://extensions, enable Developer Mode, and load the unpacked extension.`);
            } else {
                throw new Error(`Ollama API error: ${response.status} ${response.statusText}`);
            }
        }

        const data = await response.json();
        let optimizedPrompt = data.message.content.trim();
        
        // Clean up the response
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

        return optimizedPrompt;
    }

    displayResult(optimizedText) {
        this.elements.optimizedPrompt.value = optimizedText;
        this.elements.outputSection.style.display = 'block';
    }

    setLoading(loading) {
        this.elements.optimizeBtn.disabled = loading;
        if (loading) {
            this.elements.btnText.style.display = 'none';
            this.elements.loadingSpinner.style.display = 'block';
        } else {
            this.elements.btnText.style.display = 'block';
            this.elements.loadingSpinner.style.display = 'none';
        }
    }

    clearPrompts() {
        this.elements.originalPrompt.value = '';
        this.elements.optimizedPrompt.value = '';
        this.elements.outputSection.style.display = 'none';
        this.hideError();
        this.saveToStorage();
        this.elements.originalPrompt.focus();
    }

    async copyToClipboard() {
        try {
            await navigator.clipboard.writeText(this.elements.optimizedPrompt.value);
            this.showNotification('Copied to clipboard!', 'success');
        } catch (error) {
            console.error('Copy failed:', error);
            this.showNotification('Copy failed', 'error');
        }
    }

    async insertIntoPage() {
        try {
            const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
            
            await chrome.scripting.executeScript({
                target: { tabId: tab.id },
                function: (text) => {
                    const activeElement = document.activeElement;
                    if (activeElement && (activeElement.tagName === 'INPUT' || activeElement.tagName === 'TEXTAREA' || activeElement.isContentEditable)) {
                        if (activeElement.isContentEditable) {
                            activeElement.innerText = text;
                        } else {
                            activeElement.value = text;
                            activeElement.dispatchEvent(new Event('input', { bubbles: true }));
                        }
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
                                targetElement.innerText = text;
                            } else {
                                targetElement.value = text;
                                targetElement.dispatchEvent(new Event('input', { bubbles: true }));
                            }
                            targetElement.focus();
                        } else {
                            // Fallback: copy to clipboard
                            navigator.clipboard.writeText(text);
                            alert('No text field found. Text copied to clipboard instead.');
                        }
                    }
                },
                args: [this.elements.optimizedPrompt.value]
            });
            
            this.showNotification('Text inserted into page!', 'success');
        } catch (error) {
            console.error('Insert failed:', error);
            this.showNotification('Insert failed, copied to clipboard instead', 'warning');
            this.copyToClipboard();
        }
    }

    showError(message) {
        this.elements.errorText.textContent = message;
        this.elements.errorSection.style.display = 'block';
        
        // If it's a CORS error, show additional help
        if (message.includes('CORS Error') || message.includes('403')) {
            this.showCORSHelp();
        }
    }

    showCORSHelp() {
        const helpDiv = document.createElement('div');
        helpDiv.className = 'cors-help';
        helpDiv.innerHTML = `
            <h4>🔧 Quick Fix for Localhost Access:</h4>
            <ol>
                <li><strong>Download unpacked version</strong> from GitHub</li>
                <li><strong>Chrome → Extensions</strong> (chrome://extensions/)</li>
                <li><strong>Enable "Developer mode"</strong></li>
                <li><strong>Click "Load unpacked"</strong></li>
                <li><strong>Select extension folder</strong></li>
            </ol>
            <p><strong>Why?</strong> Chrome Web Store extensions can't access localhost for security.</p>
        `;
        
        // Insert after error section
        this.elements.errorSection.appendChild(helpDiv);
    }

    hideError() {
        this.elements.errorSection.style.display = 'none';
        // Remove any CORS help sections
        const corsHelp = this.elements.errorSection.querySelector('.cors-help');
        if (corsHelp) {
            corsHelp.remove();
        }
    }

    showNotification(message, type = 'info') {
        // Simple notification system
        const notification = document.createElement('div');
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#4CAF50' : type === 'error' ? '#f44336' : '#2196F3'};
            color: white;
            padding: 12px 20px;
            border-radius: 6px;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            z-index: 10000;
            font-size: 14px;
            animation: slideInRight 0.3s ease-out;
        `;
        notification.textContent = message;
        
        document.body.appendChild(notification);
        
        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease-in';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }

    openModal(type) {
        if (type === 'settings') {
            this.elements.settingsModal.style.display = 'flex';
        } else if (type === 'help') {
            this.elements.helpModal.style.display = 'flex';
        }
    }

    closeModal(type) {
        if (type === 'settings') {
            this.elements.settingsModal.style.display = 'none';
        } else if (type === 'help') {
            this.elements.helpModal.style.display = 'none';
        }
    }

    async saveToStorage() {
        const data = {
            originalPrompt: this.elements.originalPrompt.value,
            optimizedPrompt: this.elements.optimizedPrompt.value,
            showOutput: this.elements.outputSection.style.display !== 'none'
        };
        
        try {
            await chrome.storage.local.set({ promptTuneData: data });
        } catch (error) {
            console.error('Error saving to storage:', error);
        }
    }

    async loadFromStorage() {
        try {
            const result = await chrome.storage.local.get(['promptTuneData']);
            if (result.promptTuneData) {
                const data = result.promptTuneData;
                this.elements.originalPrompt.value = data.originalPrompt || '';
                this.elements.optimizedPrompt.value = data.optimizedPrompt || '';
                if (data.showOutput && data.optimizedPrompt) {
                    this.elements.outputSection.style.display = 'block';
                }
            }
        } catch (error) {
            console.error('Error loading from storage:', error);
        }
    }
}

// Initialize the extension when the popup loads
document.addEventListener('DOMContentLoaded', () => {
    new PromptTuneExtension();
});

// Add CSS animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOutRight {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style); 