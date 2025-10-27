#!/bin/bash

# Sports Card Tracker Startup Script

echo "Starting Sports Card Tracker..."
echo "================================"

# Activate virtual environment
source venv/bin/activate

# Check if all dependencies are installed
echo "Checking dependencies..."
python -c "import flask, flask_sqlalchemy, sqlalchemy, datetime, requests" 2>/dev/null
if [ $? -eq 0 ]; then
    echo "✓ All dependencies are installed"
else
    echo "✗ Missing dependencies. Installing..."
    pip install -r requirements.txt
fi

# Start the application
echo "Starting Flask application on http://localhost:5000"
echo "Press Ctrl+C to stop the server"
echo "================================"
python app.py