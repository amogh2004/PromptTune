const { optimizePrompt } = require('./promptOptimizer');

// Test prompts
const testPrompts = [
    "Write me a story about a magical forest with talking animals",
    "Create a function in Python that calculates fibonacci numbers but make it really fast",
    "Explain quantum computing to a 5 year old"
];

async function runTests() {
    console.log('Starting prompt optimization tests...\n');
    
    for (const prompt of testPrompts) {
        console.log('----------------------------------------');
        try {
            const optimizedPrompt = await optimizePrompt(prompt);
            console.log('\nTest successful! ✅\n');
        } catch (error) {
            console.log('\nTest failed! ❌');
            console.error('Error:', error.message, '\n');
        }
    }
    
    console.log('----------------------------------------');
    console.log('All tests completed!');
}

// Run the tests
runTests(); 