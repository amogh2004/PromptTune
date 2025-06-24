# Chrome Web Store Compatibility Note

## 🚨 Important Limitation

**Chrome Web Store extensions cannot access localhost URLs** for security reasons. This means:

- ✅ **Unpacked Extension**: Works perfectly with localhost Ollama
- ❌ **Web Store Version**: Cannot connect to localhost:11434

## 🔧 Solutions

### Option 1: Use Unpacked Extension (Recommended)
This is the best option for localhost Ollama usage:

1. **Download** the extension source code
2. **Chrome** → `chrome://extensions/`
3. **Enable Developer Mode**
4. **Load Unpacked** → Select extension folder
5. **Works perfectly** with `localhost:11434`

### Option 2: Expose Ollama on Network (Advanced Users)
Make Ollama accessible from a public domain:

```bash
# Start Ollama on all interfaces (SECURITY RISK!)
OLLAMA_HOST=0.0.0.0:11434 ollama serve

# Or use a reverse proxy like ngrok
ngrok http 11434
```

⚠️ **Security Warning**: Only do this temporarily and behind a firewall!

### Option 3: Dual Distribution
We maintain two versions:

#### **Development Version** (GitHub)
- Full localhost support
- Load as unpacked extension
- All features work perfectly

#### **Web Store Version** (Public)
- No localhost permissions
- Shows helpful error messages
- Guides users to development version

## 📋 Current Status

The manifest has been updated to remove localhost permissions so it can be uploaded to Chrome Web Store. The extension will:

1. ✅ **Upload successfully** to Chrome Web Store
2. 🔄 **Show CORS error** when trying to connect to localhost
3. 📝 **Display helpful message** directing users to unpacked version

## 🎯 User Experience

### Web Store Version
```
Status: 🔴 CORS blocked - Use unpacked extension for localhost
```

### Unpacked Version  
```
Status: 🟢 Connected
```

Users who need localhost support can easily use the unpacked version, while others can discover and install from the Web Store. 
