# PromptTune - Local LLaMA 2 7B

A powerful JavaScript tool and REST API that optimizes prompts using a local Ollama LLaMA 2 7B instance. Transform vague prompts into clear, specific, and effective instructions for better AI outputs.

## 🚀 Features

- **Local Processing**: Uses local Ollama LLaMA 2 7B (no external API calls)
- **Command Line Interface**: Simple CLI for quick prompt optimization
- **REST API**: Full-featured API for integration with other applications
- **Smart Optimization**: Makes prompts clearer, more specific, and context-aware
- **Input Validation**: Comprehensive error handling and validation
- **CORS Enabled**: Ready for web application integration

## 📋 Prerequisites

Before using this tool, you need:

1. **Node.js** (v14 or higher)
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

1. Clone the repository:
   ```bash
   git clone https://github.com/amogh2004/PromptTune.git
   cd PromptTune/"Local LLaMA 2 7B"
   ```

2. Install dependencies:
   ```bash
   npm install
   ```

## 🎯 Usage

### Command Line Interface

Optimize a single prompt:
```bash
node promptOptimizer.js "your prompt here"
```

Or use the npm script:
```bash
npm start "your prompt here"
```

**Example:**
```bash
$ node promptOptimizer.js "write story"
Original prompt: write story

Optimizing...

Optimized prompt: Write a compelling short story with a clear beginning, middle, and end, focusing on character development and vivid descriptions.
```

### REST API

Start the API server:
```bash
npm run api
```

The API will be available at `http://localhost:3000`

#### API Endpoints

- **GET /** - API documentation
- **GET /health** - Health check
- **POST /optimize** - Optimize a prompt

#### Example API Usage

```bash
# Optimize a prompt
curl -X POST http://localhost:3000/optimize \
  -H "Content-Type: application/json" \
  -d '{"prompt": "help me code python"}'
```

**Response:**
```json
{
  "success": true,
  "original": "help me code python",
  "optimized": "Write a Python function that takes in a list of numbers and returns their sum. Please use clear syntax and provide examples for input and output.",
  "timestamp": "2025-06-20T05:18:54.059Z"
}
```

### Test Suite

Run the test examples:
```bash
npm test
```

## 📁 Project Structure

```
Local LLaMA 2 7B/
├── api.js              # REST API server
├── promptOptimizer.js  # Core optimization logic
├── test.js            # Test examples
├── package.json       # Project configuration
├── package-lock.json  # Dependency lock file
├── .gitignore        # Git ignore rules
└── README.md         # This file
```

## 🔧 Configuration

The tool uses these default settings:

- **Ollama Endpoint**: `http://localhost:11434`
- **Model**: `llama2`
- **API Port**: `3000`
- **Temperature**: `0.3` (for consistent outputs)

You can modify these settings in the respective files or by setting environment variables:

```bash
export PORT=8080  # Change API port
```

## 📊 Examples

### Before and After Optimization

| Original Prompt | Optimized Prompt |
|----------------|------------------|
| "write story" | "Write a compelling short story with a clear beginning, middle, and end, focusing on character development and vivid descriptions." |
| "help me code" | "Write a Python function that accomplishes [specific task]. Include clear variable names, comments, and example usage." |
| "explain AI" | "Provide a comprehensive explanation of artificial intelligence, covering its definition, key applications, and impact on modern technology." |

## 🛡️ Error Handling

The tool includes comprehensive error handling for:

- Missing Ollama connection
- Invalid input types
- Empty prompts
- Network timeouts
- Malformed API requests

## 🔗 Integration Examples

### JavaScript/Node.js
```javascript
const axios = require('axios');

async function optimizePrompt(prompt) {
  const response = await axios.post('http://localhost:3000/optimize', {
    prompt: prompt
  });
  return response.data.optimized;
}
```

### Python
```python
import requests

def optimize_prompt(prompt):
    response = requests.post('http://localhost:3000/optimize', 
                           json={'prompt': prompt})
    return response.json()['optimized']
```

### cURL
```bash
curl -X POST http://localhost:3000/optimize \
  -H "Content-Type: application/json" \
  -d '{"prompt": "your prompt here"}'
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Commit your changes: `git commit -am 'Add some feature'`
4. Push to the branch: `git push origin feature-name`
5. Submit a pull request

## 📝 License

This project is licensed under the ISC License.

## 🙏 Acknowledgments

- Built with [Ollama](https://ollama.ai/) for local LLM hosting
- Uses [LLaMA 2 7B](https://ai.meta.com/llama/) for prompt optimization
- Express.js for the REST API framework

## 📞 Support

If you encounter any issues:

1. Ensure Ollama is running: `ollama serve`
2. Check if LLaMA 2 is installed: `ollama list`
3. Verify the API is accessible: `curl http://localhost:3000/health`

For more help, please open an issue on GitHub. 