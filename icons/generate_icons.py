#!/usr/bin/env python3
"""
Simple script to generate placeholder icons for PromptTune Chrome Extension
Run: python3 generate_icons.py
"""

from PIL import Image, ImageDraw, ImageFont
import os

def create_icon(size, filename):
    """Create a simple icon with the PromptTune logo"""
    # Create image with gradient background
    img = Image.new('RGBA', (size, size), (0, 0, 0, 0))
    draw = ImageDraw.Draw(img)
    
    # Draw gradient background circle
    margin = size // 8
    circle_size = size - (margin * 2)
    
    # Create gradient effect
    for i in range(circle_size // 2):
        alpha = int(255 * (1 - i / (circle_size // 2)))
        color = (102, 126, 234, alpha)  # #667eea with varying alpha
        draw.ellipse([
            margin + i, margin + i,
            size - margin - i, size - margin - i
        ], fill=color)
    
    # Draw main circle
    draw.ellipse([margin, margin, size - margin, size - margin], 
                fill=(102, 126, 234, 255), outline=(118, 138, 186, 255), width=2)
    
    # Draw inner circle for depth
    inner_margin = margin + size // 12
    draw.ellipse([inner_margin, inner_margin, size - inner_margin, size - inner_margin], 
                fill=(118, 138, 186, 200))
    
    # Add text/symbol
    try:
        # Try to use a nice font, fallback to default
        font_size = size // 3
        font = ImageFont.truetype("/System/Library/Fonts/Arial.ttf", font_size)
    except:
        try:
            font = ImageFont.truetype("arial.ttf", size // 3)
        except:
            font = ImageFont.load_default()
    
    # Draw the "P" symbol or gear emoji
    text = "🎯" if size >= 32 else "P"
    
    # Get text bounding box
    bbox = draw.textbbox((0, 0), text, font=font)
    text_width = bbox[2] - bbox[0]
    text_height = bbox[3] - bbox[1]
    
    # Center the text
    text_x = (size - text_width) // 2
    text_y = (size - text_height) // 2 - bbox[1]
    
    draw.text((text_x, text_y), text, fill='white', font=font)
    
    # Save the image
    img.save(filename, 'PNG')
    print(f"Created {filename} ({size}x{size})")

def main():
    """Generate all required icon sizes"""
    sizes = [16, 32, 48, 128]
    
    # Create icons directory if it doesn't exist
    os.makedirs('icons', exist_ok=True)
    
    for size in sizes:
        filename = f"icons/icon{size}.png"
        create_icon(size, filename)
    
    print("\nAll icons generated successfully!")
    print("If you want custom icons, replace the generated PNG files with your own designs.")

if __name__ == "__main__":
    main() 