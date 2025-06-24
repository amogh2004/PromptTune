#!/bin/bash

# Create simple placeholder icons for PromptTune Chrome Extension
# This script creates basic colored squares with text as placeholders

create_icon() {
    local size=$1
    local filename=$2
    
    # Create a simple colored square using printf and convert to create an image
    # For now, we'll create placeholder files - you can replace these with actual PNG icons
    
    echo "Creating placeholder icon: $filename (${size}x${size})"
    
    # Create a simple text file as placeholder (user should replace with actual PNG)
    cat > "$filename.txt" << EOF
PromptTune Icon Placeholder
Size: ${size}x${size}
Replace this file with an actual PNG icon named: $filename

Icon should be:
- ${size}x${size} pixels
- PNG format
- Transparent background
- Blue/purple gradient theme (#667eea to #764ba2)
- Contains "P" or target emoji 🎯
EOF
}

echo "Creating placeholder icon files..."
echo "Note: Replace these .txt files with actual PNG icons of the same names"

mkdir -p icons

create_icon 16 "icons/icon16.png"
create_icon 32 "icons/icon32.png" 
create_icon 48 "icons/icon48.png"
create_icon 128 "icons/icon128.png"

echo ""
echo "Placeholder files created!"
echo "To complete the extension, replace the .txt files with actual PNG icons:"
echo "- icons/icon16.png (16x16 pixels)"
echo "- icons/icon32.png (32x32 pixels)" 
echo "- icons/icon48.png (48x48 pixels)"
echo "- icons/icon128.png (128x128 pixels)"
echo ""
echo "You can create these icons using any image editor or online icon generator."
echo "Recommended colors: Blue gradient from #667eea to #764ba2"
echo "Symbol: Letter 'P' or target emoji 🎯" 