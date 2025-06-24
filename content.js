// PromptTune Chrome Extension - Content Script

// Content script to enhance web page interaction with PromptTune

class PromptTuneContentScript {
    constructor() {
        this.isActive = false;
        this.lastFocusedElement = null;
        this.promptTuneIndicator = null;
        this.init();
    }

    init() {
        this.setupEventListeners();
        this.setupMessageListener();
        this.injectStyles();
        console.log('PromptTune content script loaded');
    }

    setupEventListeners() {
        // Track focus on text inputs
        document.addEventListener('focusin', (e) => {
            if (this.isTextInput(e.target)) {
                this.lastFocusedElement = e.target;
                this.showPromptTuneIndicator(e.target);
            }
        });

        // Hide indicator when focus leaves text inputs
        document.addEventListener('focusout', (e) => {
            if (this.isTextInput(e.target)) {
                setTimeout(() => {
                    if (!this.isTextInput(document.activeElement)) {
                        this.hidePromptTuneIndicator();
                    }
                }, 100);
            }
        });

        // Keyboard shortcut to open PromptTune (Ctrl+Shift+P)
        document.addEventListener('keydown', (e) => {
            if (e.ctrlKey && e.shiftKey && e.key === 'P') {
                e.preventDefault();
                this.openPromptTune();
            }
        });

        // Right-click context menu enhancement
        document.addEventListener('contextmenu', (e) => {
            if (this.isTextInput(e.target)) {
                this.lastFocusedElement = e.target;
            }
        });
    }

    setupMessageListener() {
        // Listen for messages from popup or background
        chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
            switch (request.action) {
                case 'insertOptimizedPrompt':
                    this.insertText(request.text);
                    sendResponse({ success: true });
                    break;
                    
                case 'getSelectedText':
                    const selectedText = this.getSelectedText();
                    sendResponse({ selectedText });
                    break;
                    
                case 'getFocusedElementText':
                    const focusedText = this.getFocusedElementText();
                    sendResponse({ focusedText });
                    break;
                    
                case 'highlightTextInputs':
                    this.highlightTextInputs();
                    sendResponse({ success: true });
                    break;
                    
                default:
                    sendResponse({ success: false, error: 'Unknown action' });
            }
        });
    }

    isTextInput(element) {
        if (!element) return false;
        
        const tagName = element.tagName.toLowerCase();
        const inputType = element.type?.toLowerCase();
        
        return (
            tagName === 'textarea' ||
            (tagName === 'input' && (
                inputType === 'text' ||
                inputType === 'email' ||
                inputType === 'search' ||
                inputType === 'url' ||
                inputType === 'password' ||
                !inputType
            )) ||
            element.isContentEditable ||
            element.hasAttribute('contenteditable')
        );
    }

    insertText(text) {
        const targetElement = this.lastFocusedElement || document.activeElement;
        
        if (!targetElement || !this.isTextInput(targetElement)) {
            // Try to find a suitable text input
            const textInputs = this.findTextInputs();
            if (textInputs.length > 0) {
                const target = textInputs[0];
                target.focus();
                this.performTextInsertion(target, text);
                return true;
            }
            return false;
        }
        
        this.performTextInsertion(targetElement, text);
        return true;
    }

    performTextInsertion(element, text) {
        if (element.isContentEditable) {
            // For contenteditable elements
            element.focus();
            
            // Try to preserve cursor position and replace selected text
            const selection = window.getSelection();
            if (selection.rangeCount > 0) {
                const range = selection.getRangeAt(0);
                range.deleteContents();
                range.insertNode(document.createTextNode(text));
                range.setStartAfter(range.endContainer);
                range.collapse(true);
                selection.removeAllRanges();
                selection.addRange(range);
            } else {
                element.innerText = text;
            }
            
            // Trigger events
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
        } else {
            // For input and textarea elements
            element.focus();
            
            const start = element.selectionStart || 0;
            const end = element.selectionEnd || 0;
            const currentValue = element.value;
            
            // Replace selected text or insert at cursor position
            const newValue = currentValue.substring(0, start) + text + currentValue.substring(end);
            element.value = newValue;
            
            // Set cursor position after inserted text
            const newCursorPos = start + text.length;
            element.setSelectionRange(newCursorPos, newCursorPos);
            
            // Trigger events
            element.dispatchEvent(new Event('input', { bubbles: true }));
            element.dispatchEvent(new Event('change', { bubbles: true }));
        }
        
        this.showInsertionFeedback(element);
    }

    getSelectedText() {
        const selection = window.getSelection();
        return selection.toString().trim();
    }

    getFocusedElementText() {
        const element = document.activeElement;
        if (this.isTextInput(element)) {
            if (element.isContentEditable) {
                return element.innerText || element.textContent || '';
            } else {
                return element.value || '';
            }
        }
        return '';
    }

    findTextInputs() {
        const selectors = [
            'input[type="text"]',
            'input[type="email"]',
            'input[type="search"]',
            'input[type="url"]',
            'input:not([type])',
            'textarea',
            '[contenteditable="true"]',
            '[contenteditable=""]'
        ];
        
        const elements = [];
        selectors.forEach(selector => {
            elements.push(...document.querySelectorAll(selector));
        });
        
        return elements.filter(el => 
            el.offsetWidth > 0 && 
            el.offsetHeight > 0 && 
            !el.disabled && 
            !el.readOnly
        );
    }

    showPromptTuneIndicator(element) {
        this.hidePromptTuneIndicator();
        
        const rect = element.getBoundingClientRect();
        const indicator = document.createElement('div');
        indicator.className = 'prompttune-indicator';
        indicator.innerHTML = '🎯';
        indicator.title = 'Press Ctrl+Shift+P to optimize with PromptTune';
        
        indicator.style.cssText = `
            position: fixed;
            top: ${rect.top - 30}px;
            right: ${window.innerWidth - rect.right}px;
            width: 24px;
            height: 24px;
            background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
            border: 2px solid white;
            border-radius: 50%;
            display: flex;
            align-items: center;
            justify-content: center;
            font-size: 12px;
            z-index: 10000;
            box-shadow: 0 2px 8px rgba(0,0,0,0.2);
            cursor: pointer;
            animation: prompttune-pulse 2s infinite;
            user-select: none;
        `;
        
        indicator.addEventListener('click', () => {
            this.openPromptTune();
        });
        
        document.body.appendChild(indicator);
        this.promptTuneIndicator = indicator;
        
        // Auto-hide after 5 seconds
        setTimeout(() => {
            if (this.promptTuneIndicator === indicator) {
                this.hidePromptTuneIndicator();
            }
        }, 5000);
    }

    hidePromptTuneIndicator() {
        if (this.promptTuneIndicator) {
            this.promptTuneIndicator.remove();
            this.promptTuneIndicator = null;
        }
    }

    showInsertionFeedback(element) {
        const rect = element.getBoundingClientRect();
        const feedback = document.createElement('div');
        feedback.className = 'prompttune-feedback';
        feedback.innerHTML = '✅ Optimized prompt inserted!';
        
        feedback.style.cssText = `
            position: fixed;
            top: ${rect.bottom + 10}px;
            left: ${rect.left}px;
            background: #4CAF50;
            color: white;
            padding: 8px 16px;
            border-radius: 6px;
            font-size: 14px;
            z-index: 10001;
            box-shadow: 0 4px 12px rgba(0,0,0,0.2);
            animation: prompttune-slideInUp 0.3s ease-out;
            user-select: none;
        `;
        
        document.body.appendChild(feedback);
        
        setTimeout(() => {
            feedback.style.animation = 'prompttune-slideOutUp 0.3s ease-in';
            setTimeout(() => feedback.remove(), 300);
        }, 2000);
    }

    highlightTextInputs() {
        const inputs = this.findTextInputs();
        
        inputs.forEach((input, index) => {
            const highlight = document.createElement('div');
            highlight.className = 'prompttune-highlight';
            
            const rect = input.getBoundingClientRect();
            highlight.style.cssText = `
                position: fixed;
                top: ${rect.top - 2}px;
                left: ${rect.left - 2}px;
                width: ${rect.width + 4}px;
                height: ${rect.height + 4}px;
                border: 2px solid #667eea;
                border-radius: 4px;
                z-index: 9999;
                pointer-events: none;
                animation: prompttune-highlight 1s ease-in-out;
                background: rgba(102, 126, 234, 0.1);
            `;
            
            document.body.appendChild(highlight);
            
            setTimeout(() => {
                highlight.remove();
            }, 1000);
        });
    }

    openPromptTune() {
        // Send message to background to open popup
        chrome.runtime.sendMessage({ action: 'openPopup' });
    }

    injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            @keyframes prompttune-pulse {
                0%, 100% { transform: scale(1); opacity: 0.8; }
                50% { transform: scale(1.1); opacity: 1; }
            }
            
            @keyframes prompttune-slideInUp {
                from {
                    transform: translateY(20px);
                    opacity: 0;
                }
                to {
                    transform: translateY(0);
                    opacity: 1;
                }
            }
            
            @keyframes prompttune-slideOutUp {
                from {
                    transform: translateY(0);
                    opacity: 1;
                }
                to {
                    transform: translateY(-20px);
                    opacity: 0;
                }
            }
            
            @keyframes prompttune-highlight {
                0%, 100% { opacity: 0; transform: scale(1); }
                50% { opacity: 1; transform: scale(1.02); }
            }
            
            .prompttune-indicator:hover {
                transform: scale(1.1);
                box-shadow: 0 4px 16px rgba(0,0,0,0.3);
            }
        `;
        document.head.appendChild(style);
    }
}

// Initialize content script
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new PromptTuneContentScript();
    });
} else {
    new PromptTuneContentScript();
}

// Export for testing
if (typeof module !== 'undefined' && module.exports) {
    module.exports = PromptTuneContentScript;
} 