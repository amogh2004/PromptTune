# PromptTune Chrome Extension - Installation Guide

This guide will help you install and set up the PromptTune Chrome extension.

## 📋 Prerequisites Checklist

Before installing the extension, make sure you have:

- [ ] **Google Chrome** (version 88 or later)
- [ ] **Ollama** installed on your computer
- [ ] **LLaMA 2 model** downloaded in Ollama
- [ ] **Ollama service** running

## 🔧 Step 1: Install Ollama and LLaMA 2

### Install Ollama

1. **Visit** [https://ollama.ai/](https://ollama.ai/)
2. **Download** the installer for your operating system:
   - **macOS**: Download the `.dmg` file
   - **Windows**: Download the `.exe` file  
   - **Linux**: Use the install script
3. **Run** the installer and follow the setup instructions

### Download LLaMA 2 Model

1. **Open Terminal** (macOS/Linux) or **Command Prompt** (Windows)
2. **Run** the following command:
   ```bash
   ollama pull llama2
   ```
3. **Wait** for the download to complete (this may take several minutes)

### Start Ollama Service

1. **Run** the following command:
   ```bash
   ollama serve
   ```
2. **Keep this terminal open** - Ollama needs to stay running
3. **Verify** it's working by visiting `http://localhost:11434` in your browser

## 🚀 Step 2: Install the Chrome Extension

### Method 1: Load Unpacked Extension (Recommended for now)

1. **Download** or clone this repository to your computer
2. **Open Google Chrome**
3. **Navigate** to `chrome://extensions/`
4. **Enable "Developer mode"** (toggle switch in the top right)
5. **Click "Load unpacked"** button
6. **Select** the folder containing the extension files
7. **Pin the extension** by clicking the puzzle piece icon and then the pin icon

### Method 2: Chrome Web Store (Coming Soon)
*The extension will be available on the Chrome Web Store after review*

## ⚙️ Step 3: Configure the Extension

1. **Click** the PromptTune icon in your Chrome toolbar
2. **Click "Settings"** in the popup
3. **Verify** the settings:
   - **Ollama Endpoint**: Should be `http://localhost:11434`
   - **Model Name**: Should be `llama2`
   - **Temperature**: Default `0.3` is recommended
4. **Click "Save"** if you made any changes

## ✅ Step 4: Test the Extension

### Test Connection

1. **Click** the PromptTune icon
2. **Check** the status indicator in the top right:
   - 🟢 **Green**: Connected and ready
   - 🔴 **Red**: Connection failed
   - 🟡 **Yellow**: Checking connection

### Test Optimization

1. **Go** to any website with a text input (e.g., Google, Gmail, ChatGPT)
2. **Click** in a text field
3. **Look** for the 🎯 indicator that appears
4. **Click** the PromptTune extension icon
5. **Type** a simple prompt like "write story"
6. **Click "Optimize Prompt"**
7. **Click "Insert"** to put the optimized prompt in the webpage

## 🐛 Troubleshooting

### Extension Not Loading

**Problem**: Extension doesn't appear or shows errors
**Solutions**:
- Refresh the `chrome://extensions/` page
- Check that all files are in the correct folder
- Look for error messages in the developer console

### Connection Failed

**Problem**: Red status indicator showing "Connection failed"
**Solutions**:
- Make sure Ollama is running: `ollama serve`
- Check if the port 11434 is available
- Restart Ollama service
- Verify LLaMA 2 model is installed: `ollama list`

### Model Not Found

**Problem**: Status shows "Model 'llama2' not found"
**Solutions**:
- Download the model: `ollama pull llama2`
- Wait for download to complete
- Restart Ollama service
- Check available models: `ollama list`

### Text Insertion Not Working

**Problem**: Optimized prompt doesn't insert into webpage
**Solutions**:
- Make sure the text field is focused (clicked)
- Try the keyboard shortcut: Ctrl+Shift+P
- Refresh the webpage and try again
- Some websites may block script injection (rare)

## 🎯 Testing Websites

Try the extension on these popular websites:

### AI Chat Platforms
- [ChatGPT](https://chat.openai.com/)
- [Claude](https://claude.ai/)
- [Perplexity](https://perplexity.ai/)

### Social Media
- [Twitter/X](https://twitter.com/)
- [LinkedIn](https://linkedin.com/)
- [Reddit](https://reddit.com/)

### Productivity Tools
- [Google Docs](https://docs.google.com/)
- [Gmail](https://gmail.com/)
- [Notion](https://notion.so/)

### Development Platforms
- [GitHub](https://github.com/)
- [Stack Overflow](https://stackoverflow.com/)

## 📱 Usage Tips

### Keyboard Shortcuts
- **Ctrl+Shift+P**: Quick access to PromptTune
- **Ctrl+Enter**: Optimize prompt (in extension popup)

### Best Practices
1. **Be Specific**: The more context you provide, the better the optimization
2. **Iterate**: Try optimizing the same prompt multiple times for variations
3. **Save Good Results**: Copy optimized prompts you like for future use
4. **Experiment**: Try different temperature settings for creativity vs consistency

### Performance Tips
- Keep Ollama running in the background for faster response
- Use a lower temperature (0.1-0.3) for consistent results
- Use a higher temperature (0.7-0.9) for more creative variations

## 🔄 Updating the Extension

### For Development Version
1. **Pull latest changes** from the repository
2. **Go to** `chrome://extensions/`
3. **Click the refresh icon** on the PromptTune extension card
4. **Test** that everything still works

### For Chrome Web Store Version (Future)
Updates will be automatic when available on the Chrome Web Store.

## 🆘 Getting Help

If you encounter issues not covered in this guide:

1. **Check the console**: Press F12 → Console tab for error messages
2. **Restart everything**: Close Chrome, restart Ollama, reload extension
3. **Check requirements**: Ensure all prerequisites are met
4. **Report issues**: Create an issue on GitHub with details

## 🎉 Success!

If you can see the green status indicator and successfully optimize a prompt, you're all set! 

**Next Steps:**
- Try the extension on your favorite websites
- Experiment with different prompts and settings
- Share your experience and feedback

---

**Enjoy optimizing your AI prompts with PromptTune! 🚀** 