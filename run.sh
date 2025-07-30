#!/bin/bash

# Activate virtual environment and run the Flask app
echo "Starting Sports Card Collection Manager..."
echo "Virtual environment: $(pwd)/venv"
echo "Application will be available at: http://localhost:5000"
echo ""

source venv/bin/activate
python app.py