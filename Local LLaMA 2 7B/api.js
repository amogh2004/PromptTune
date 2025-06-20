const express = require('express');
const { optimizePrompt } = require('./promptOptimizer');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware to parse JSON bodies
app.use(express.json());

// CORS middleware to allow requests from any origin
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Origin, X-Requested-With, Content-Type, Accept, Authorization');
    
    if (req.method === 'OPTIONS') {
        res.sendStatus(200);
    } else {
        next();
    }
});

// Health check endpoint
app.get('/health', (req, res) => {
    res.json({ 
        status: 'healthy', 
        service: 'Prompt Optimizer API',
        timestamp: new Date().toISOString()
    });
});

// Main optimization endpoint
app.post('/optimize', async (req, res) => {
    try {
        const { prompt } = req.body;
        
        // Validate input
        if (!prompt) {
            return res.status(400).json({
                error: 'Missing required field: prompt',
                message: 'Please provide a prompt to optimize'
            });
        }
        
        if (typeof prompt !== 'string') {
            return res.status(400).json({
                error: 'Invalid input type',
                message: 'Prompt must be a string'
            });
        }
        
        if (prompt.trim().length === 0) {
            return res.status(400).json({
                error: 'Empty prompt',
                message: 'Prompt cannot be empty'
            });
        }
        
        // Log the request
        console.log(`[${new Date().toISOString()}] Optimizing prompt: "${prompt}"`);
        
        // Optimize the prompt
        const optimizedPrompt = await optimizePrompt(prompt);
        
        // Return the result
        res.json({
            success: true,
            original: prompt,
            optimized: optimizedPrompt,
            timestamp: new Date().toISOString()
        });
        
    } catch (error) {
        console.error('Error optimizing prompt:', error.message);
        
        // Return error response
        res.status(500).json({
            success: false,
            error: 'Internal server error',
            message: 'Failed to optimize prompt. Please check if Ollama is running.',
            timestamp: new Date().toISOString()
        });
    }
});

// Get API documentation
app.get('/', (req, res) => {
    res.json({
        name: 'Prompt Optimizer API',
        version: '1.0.0',
        description: 'API to optimize prompts using local Ollama LLaMA 2 7B instance',
        endpoints: {
            'GET /': 'API documentation',
            'GET /health': 'Health check',
            'POST /optimize': 'Optimize a prompt'
        },
        usage: {
            endpoint: 'POST /optimize',
            body: {
                prompt: 'string (required) - The prompt to optimize'
            },
            example: {
                request: {
                    prompt: 'write story'
                },
                response: {
                    success: true,
                    original: 'write story',
                    optimized: 'Write a compelling short story with a clear beginning, middle, and end, focusing on character development and vivid descriptions.',
                    timestamp: '2024-01-01T12:00:00.000Z'
                }
            }
        }
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        error: 'Not found',
        message: `Route ${req.method} ${req.path} not found`,
        availableRoutes: ['GET /', 'GET /health', 'POST /optimize']
    });
});

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Prompt Optimizer API is running!`);
    console.log(`📍 Local: http://localhost:${PORT}`);
    console.log(`📋 Documentation: http://localhost:${PORT}`);
    console.log(`❤️  Health Check: http://localhost:${PORT}/health`);
    console.log(`🔧 Optimize Endpoint: POST http://localhost:${PORT}/optimize`);
    console.log(`\n📝 Example curl command:`);
    console.log(`curl -X POST http://localhost:${PORT}/optimize \\`);
    console.log(`  -H "Content-Type: application/json" \\`);
    console.log(`  -d '{"prompt": "write story"}'`);
    console.log(`\n⚡ Ready to optimize prompts!`);
});

module.exports = app; 