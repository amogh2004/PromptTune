const axios = require('axios');

const OLLAMA_ENDPOINT = 'http://localhost:11434/api/chat';

async function optimizePrompt(userInput) {
    try {
        const response = await axios.post(OLLAMA_ENDPOINT, {
            model: 'llama2',
            messages: [
                {
                    role: 'system',
                    content: 'You are a prompt optimization expert. Rewrite the user\'s prompt to be clearer, more specific, and more effective. Output only the improved prompt, no explanations. You can give 2-3 options for the user to choose from.'
                },
                {
                    role: 'user',
                    content: `Optimize this prompt: "${userInput}"`
                }
            ],
            stream: false,
            options: {
                temperature: 0.3,
                top_p: 0.8,
                num_predict: 250
            }
        });

        // Clean up the response to remove any extra text
        let optimizedPrompt = response.data.message.content.trim();
        
        // Remove common unwanted prefixes/suffixes
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
    } catch (error) {
        console.error('Error optimizing prompt:', error.message);
        if (error.response) {
            console.error('Response data:', error.response.data);
            console.error('Response status:', error.response.status);
        }
        throw error;
    }
}

// If running directly from command line
if (require.main === module) {
    const prompt = process.argv.slice(2).join(' ');
    
    if (!prompt) {
        console.error('Please provide a prompt as a command line argument.');
        console.error('Usage: node promptOptimizer.js "your prompt here"');
        process.exit(1);
    }

    console.log('Original prompt:', prompt);
    console.log('\nOptimizing...\n');
    
    optimizePrompt(prompt)
        .then(optimizedPrompt => {
            console.log('Optimized prompt:', optimizedPrompt);
        })
        .catch(error => {
            console.error('Failed to optimize prompt:', error.message);
            process.exit(1);
        });
} else {
    // When used as a module
    module.exports = { optimizePrompt };
} 