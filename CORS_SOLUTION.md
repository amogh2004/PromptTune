# 🚨 CORS/403 Forbidden Error - Solution Guide

## 🔍 **What's Happening?**

You're getting a **"403 Forbidden"** error because:

1. **Chrome Web Store Extensions** can't access localhost URLs for security
2. **CORS (Cross-Origin Resource Sharing)** blocks the request to `localhost:11434`
3. **Extension lacks localhost permissions** (removed for Web Store compatibility)

## ✅ **Quick Fix: Use Unpacked Extension**

### **Step 1: Get the Source Code**
- Download this project folder to your computer
- Make sure you have all the files (manifest.json, popup.html, etc.)

### **Step 2: Load as Unpacked Extension**
1. **Open Chrome** and go to `chrome://extensions/`
2. **Enable "Developer mode"** (toggle in top right)
3. **Click "Load unpacked"**
4. **Select the project folder** containing the extension files
5. **Pin the extension** for easy access

### **Step 3: Test Connection**
- Click the extension icon
- Should show 🟢 **Connected** status
- Try optimizing a prompt

## 🔧 **Alternative Solutions**

### **Option 1: Restore Localhost Permissions (Unpacked Only)**
If you're only using the unpacked version, you can restore full localhost support:

Add this to `manifest.json`:
```json
{
  "host_permissions": [
    "http://localhost:*/*"
  ]
}
```

### **Option 2: Configure Ollama CORS (Advanced)**
Enable CORS in Ollama by setting environment variables:

```bash
# macOS/Linux
export OLLAMA_ORIGINS="chrome-extension://*"
ollama serve

# Windows
set OLLAMA_ORIGINS=chrome-extension://*
ollama serve
```

### **Option 3: Use Remote Ollama (Not Recommended)**
Expose Ollama on a public URL (security risk):

```bash
# Use with extreme caution!
OLLAMA_HOST=0.0.0.0:11434 ollama serve
```

## 🎯 **Recommended Approach**

### **For Most Users:**
1. ✅ **Use unpacked extension** for localhost Ollama
2. ✅ **Keep Web Store version** for discovery/sharing
3. ✅ **Follow security best practices**

### **Dual Distribution Strategy:**
- **GitHub Version**: Full localhost support (unpacked)
- **Web Store Version**: Shows helpful error + instructions

## 📋 **Technical Details**

### **Why Chrome Blocks Localhost:**
- **Security**: Prevents malicious extensions from accessing local services
- **Privacy**: Protects local development environments
- **Consistency**: Same-origin policy enforcement

### **Extension Types:**
| Type | Localhost Access | Installation |
|------|------------------|--------------|
| **Unpacked** | ✅ Full access | Manual (Developer Mode) |
| **Web Store** | ❌ Blocked | Automatic |

## 🛠️ **Troubleshooting**

### **Still Getting 403 Error?**
1. **Check Ollama is running**: `ollama serve`
2. **Verify model exists**: `ollama list` 
3. **Test manually**: Visit `http://localhost:11434/api/tags`
4. **Check firewall**: Ensure port 11434 is open

### **Extension Not Loading?**
1. **Reload extension**: Chrome Extensions → Refresh icon
2. **Check Developer Console**: F12 → Console tab
3. **Verify file structure**: All files in same folder
4. **Check permissions**: Extension should have activeTab, storage

### **Other Issues?**
- **Restart Ollama**: `ollama serve`
- **Restart Chrome**: Close all windows, reopen
- **Clear extension data**: Chrome Settings → Privacy → Clear browsing data

## 📖 **User Instructions**

### **For Extension Users:**
When you see the "403 Forbidden" error:

1. **Don't panic!** This is a security feature, not a bug
2. **Download the GitHub version** for localhost access
3. **Follow the unpacked installation guide**
4. **Enjoy full functionality** with local Ollama

### **For Developers:**
```javascript
// Error handling in popup.js
if (response.status === 403) {
    throw new Error(`CORS Error: Cannot access localhost from Chrome Web Store extension. Please use the unpacked extension version for localhost Ollama.`);
}
```

## 🚀 **Next Steps**

1. **✅ Use unpacked version** for immediate solution
2. **📝 Update documentation** to clarify the difference
3. **🔗 Link to GitHub** from Web Store description
4. **📊 Track usage** to see user preferences

---

## 🎉 **Summary**

The **403 Forbidden error is expected behavior** for Chrome Web Store extensions accessing localhost. The **unpacked extension version works perfectly** and is the recommended solution for localhost Ollama users.

**Your extension works great - it just needs to be loaded as an unpacked extension for localhost access!** 🚀 