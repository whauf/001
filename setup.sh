#!/bin/bash

# Sports Card Tracker Setup Script

echo "Sports Card Tracker - Setup Script"
echo "==================================="

# Function to check if command exists
command_exists() {
    command -v "$1" >/dev/null 2>&1
}

# Check for Python 3
if command_exists python3; then
    echo "✓ Python 3 is installed: $(python3 --version)"
else
    echo "✗ Python 3 is not installed. Please install Python 3 first."
    exit 1
fi

# Check for pip
if command_exists pip3; then
    echo "✓ pip is available: $(pip3 --version)"
else
    echo "✗ pip is not available. Installing..."
    sudo apt update
    sudo apt install -y python3-pip
fi

# Install system dependencies for virtual environment
echo "Installing system dependencies..."
sudo apt update
sudo apt install -y python3.13-venv python3-dev

# Create virtual environment if it doesn't exist
if [ ! -d "venv" ]; then
    echo "Creating Python virtual environment..."
    python3 -m venv venv
    echo "✓ Virtual environment created"
else
    echo "✓ Virtual environment already exists"
fi

# Activate virtual environment and install dependencies
echo "Installing Python dependencies..."
source venv/bin/activate
pip install -r requirements.txt

echo ""
echo "Setup completed successfully!"
echo "============================="
echo ""
echo "To start the application:"
echo "  ./run.sh"
echo ""
echo "Or manually:"
echo "  source venv/bin/activate"
echo "  python app.py"
echo ""
echo "The website will be available at: http://localhost:5000"