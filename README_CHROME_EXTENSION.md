# PromptTune - Chrome Extension

A powerful Chrome extension that optimizes your AI prompts using local Ollama LLaMA 2 7B instance. Transform vague prompts into clear, specific, and effective instructions directly in your browser.

## 🚀 Features

- **Browser Integration**: Optimize prompts directly on any webpage
- **Local Processing**: Uses local Ollama LLaMA 2 7B (no external API calls)
- **Smart Text Detection**: Automatically detects text input fields
- **One-Click Insertion**: Insert optimized prompts directly into web forms
- **Visual Indicators**: Shows when text fields are optimizable
- **Keyboard Shortcuts**: Quick access with Ctrl+Shift+P
- **Settings Customization**: Configure Ollama endpoint, model, and parameters
- **Cross-Site Compatibility**: Works on all websites with text inputs

## 📋 Prerequisites

Before using this extension, you need:

1. **Google Chrome** (or Chromium-based browser)
2. **Ollama** installed and running
3. **LLaMA 2 model** downloaded in Ollama

### Installing Ollama and LLaMA 2

1. Install Ollama from [https://ollama.ai/](https://ollama.ai/)
2. Pull the LLaMA 2 model:
   ```bash
   ollama pull llama2
   ```
3. Start Ollama service:
   ```bash
   ollama serve
   ```

## 🛠️ Installation

### Option 1: Load Unpacked Extension (Development)

1. **Download/Clone** this repository
2. **Open Chrome** and navigate to `chrome://extensions/`
3. **Enable Developer Mode** (toggle in top right)
4. **Click "Load unpacked"** and select the extension folder
5. **Pin the extension** to your toolbar for easy access

### Option 2: Chrome Web Store (Future)
*Extension will be available on Chrome Web Store after review*

## 🎯 Usage

### Basic Usage

1. **Navigate** to any website with text inputs (e.g., ChatGPT, Claude, forms)
2. **Click** in a text field - you'll see a 🎯 indicator appear
3. **Type** your prompt or click the PromptTune extension icon
4. **Enter** your prompt in the popup
5. **Click "Optimize Prompt"** to get an improved version
6. **Click "Insert"** to put it directly in the webpage

### Keyboard Shortcuts

- **Ctrl+Shift+P**: Open PromptTune popup
- **Ctrl+Enter**: Optimize prompt (when in extension popup)

### Visual Features

- **🎯 Indicator**: Appears near text fields when focused
- **Highlight Animation**: Shows all text inputs when activated
- **Success Feedback**: Confirms when text is inserted
- **Connection Status**: Shows Ollama connection status

## ⚙️ Settings

Access settings by clicking the extension icon and then "Settings":

- **Ollama Endpoint**: Default `http://localhost:11434`
- **Model Name**: Default `llama2` (can change to other models)
- **Temperature**: Controls creativity (0.0-1.0, default 0.3)

## 📊 Examples

### Before and After Optimization

| Original Prompt | Optimized Prompt |
|----------------|------------------|
| "write story" | "Write a compelling short story with a clear beginning, middle, and end, focusing on character development and vivid descriptions. Include dialogue and aim for 500-1000 words." |
| "help me code" | "Act as an expert programmer. Write clean, well-commented Python code that accomplishes [specific task]. Include error handling, follow PEP 8 standards, and provide usage examples." |
| "explain AI" | "Provide a comprehensive yet accessible explanation of artificial intelligence, covering its definition, key applications in daily life, benefits and limitations, and future implications for society." |

## 🔧 Extension Architecture

```
PromptTune Extension/
├── manifest.json          # Extension configuration
├── popup.html             # Main UI interface
├── popup.css              # Styling
├── popup.js               # Main application logic
├── background.js          # Service worker
├── content.js             # Page interaction script
├── icons/                 # Extension icons
│   ├── icon16.png
│   ├── icon32.png
│   ├── icon48.png
│   └── icon128.png
└── README_CHROME_EXTENSION.md
```

## 🔐 Permissions

The extension requires these permissions:

- **activeTab**: Insert optimized prompts into current page
- **storage**: Save settings and prompt history
- **host_permissions**: Connect to local Ollama instance

## 🛡️ Privacy & Security

- **Local Processing**: All optimization happens on your machine
- **No Data Collection**: Extension doesn't collect or transmit personal data
- **Offline Capable**: Works without internet connection
- **Open Source**: Full code available for review

## 🐛 Troubleshooting

### Common Issues

**Extension not working:**
- Ensure Ollama is running (`ollama serve`)
- Check that LLaMA 2 model is installed (`ollama list`)
- Verify extension has permissions enabled

**Connection failed:**
- Check Ollama endpoint in settings (default: `http://localhost:11434`)
- Ensure firewall isn't blocking local connections
- Try restarting Ollama service

**Text insertion not working:**
- Make sure text field is focused
- Try using keyboard shortcut Ctrl+Shift+P
- Check if website blocks script injection (rare)

### Status Indicators

- 🟢 **Green dot**: Connected to Ollama
- 🔴 **Red dot**: Connection failed
- 🟡 **Yellow dot**: Checking connection

## 🔗 Integration Examples

### Popular Websites Tested

- ✅ **ChatGPT** (chat.openai.com)
- ✅ **Claude** (claude.ai)
- ✅ **Google Docs** (docs.google.com)
- ✅ **Gmail** (gmail.com)
- ✅ **GitHub** (github.com)
- ✅ **Twitter/X** (twitter.com)
- ✅ **LinkedIn** (linkedin.com)
- ✅ **Reddit** (reddit.com)

## 📱 Browser Compatibility

- ✅ **Google Chrome** (v88+)
- ✅ **Microsoft Edge** (v88+)
- ✅ **Brave Browser**
- ✅ **Opera** (v74+)
- ❌ **Firefox** (Manifest V3 support limited)
- ❌ **Safari** (Different extension system)

## 🚀 Development

### Setup for Development

1. **Clone** the repository
2. **Install Ollama** and pull LLaMA 2 model
3. **Load extension** in Chrome developer mode
4. **Make changes** to code
5. **Reload extension** in Chrome

### File Structure

- `popup.js`: Main application logic and UI interactions
- `background.js`: Service worker for extension lifecycle
- `content.js`: Injected script for webpage interaction
- `manifest.json`: Extension configuration and permissions

### Adding Features

The extension is modular and easy to extend:

- **New Models**: Add support in settings
- **New Websites**: Usually works automatically
- **Custom Shortcuts**: Modify keyboard event handlers
- **UI Improvements**: Update popup.html and popup.css

## 🤝 Contributing

1. **Fork** the repository
2. **Create** a feature branch: `git checkout -b feature-name`
3. **Test** your changes thoroughly
4. **Commit** changes: `git commit -am 'Add feature'`
5. **Push** to branch: `git push origin feature-name`
6. **Submit** a pull request

## 📝 License

This project is licensed under the ISC License - see the original project for details.

## 🆘 Support

- **Issues**: Report bugs on GitHub
- **Discussions**: Ask questions in GitHub Discussions
- **Email**: Contact the maintainer for urgent issues

## 🔮 Roadmap

- [ ] **Context Menu**: Right-click to optimize text
- [ ] **History**: Save and reuse optimized prompts
- [ ] **Templates**: Pre-made prompt templates
- [ ] **Batch Processing**: Optimize multiple prompts
- [ ] **Export/Import**: Share prompt collections
- [ ] **Analytics**: Track optimization effectiveness
- [ ] **More Models**: Support for other LLMs

## 🙏 Acknowledgments

- **Ollama Team**: For the excellent local LLM platform
- **Meta**: For the LLaMA 2 model
- **Chrome Extensions Team**: For the robust extension API

---

**Made with ❤️ for better AI prompting**

*Transform your vague prompts into powerful instructions with PromptTune!* 