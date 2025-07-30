# Sports Card Tracker - Complete Setup Guide

This guide will help you download all necessary dependencies and get the website running on your system.

## Prerequisites

- Linux system (Ubuntu/Debian recommended)
- Internet connection for downloading packages
- Terminal/Command line access
- sudo privileges (for installing system packages)

## Quick Setup (Automated)

The easiest way to get started is to run the automated setup script:

```bash
# Make setup script executable and run it
chmod +x setup.sh
./setup.sh
```

This script will:
1. Check for Python 3 installation
2. Install pip if needed
3. Install system dependencies (python3-venv, python3-dev)
4. Create a Python virtual environment
5. Install all required Python packages

## Manual Setup (Step by Step)

If you prefer to set things up manually or the automated script doesn't work:

### 1. Install System Dependencies

```bash
# Update package list
sudo apt update

# Install Python virtual environment support and development headers
sudo apt install -y python3.13-venv python3-dev python3-pip
```

### 2. Create Virtual Environment

```bash
# Create a Python virtual environment
python3 -m venv venv

# Activate the virtual environment
source venv/bin/activate
```

### 3. Install Python Dependencies

```bash
# Install required packages
pip install -r requirements.txt
```

### 4. Verify Installation

```bash
# Test that all packages are installed correctly
python -c "import flask, flask_sqlalchemy, sqlalchemy, datetime, requests; print('All dependencies installed successfully!')"
```

## Running the Application

### Option 1: Using the Run Script (Recommended)

```bash
# Make the run script executable (if not already done)
chmod +x run.sh

# Start the application
./run.sh
```

### Option 2: Manual Start

```bash
# Activate virtual environment
source venv/bin/activate

# Start the Flask application
python app.py
```

## Accessing the Website

Once the application is running, you'll see output similar to:

```
 * Running on all addresses (0.0.0.0)
 * Running on http://127.0.0.1:5000
 * Running on http://172.30.0.2:5000
```

Open your web browser and navigate to:
- **http://localhost:5000** (most common)
- **http://127.0.0.1:5000** (alternative)
- **http://0.0.0.0:5000** (if the above don't work)

## What the Application Does

The Sports Card Tracker is a web application that allows you to:

- 📋 **Manage Sports Cards**: Add and track your sports card collection
- 💰 **Record Sales**: Track sales transactions for each card
- 📊 **View History**: See complete sales history for any card
- 🏆 **Multiple Sports**: Support for Basketball, Football, Baseball, Hockey, Soccer
- 📱 **Responsive Design**: Works on desktop and mobile devices

## Default Data

The application comes with sample data including:
- Michael Jordan 1991 Upper Deck #44
- Tom Brady 2000 Playoff Contenders #144 (Rookie)
- Wayne Gretzky 1979 O-Pee-Chee #18 (Rookie)

## Stopping the Application

To stop the application:
1. Go to the terminal where the app is running
2. Press `Ctrl + C`

## Troubleshooting

### Common Issues:

1. **Permission Denied Errors**
   ```bash
   # If you get permission errors, make sure scripts are executable:
   chmod +x setup.sh run.sh
   ```

2. **Python Version Issues**
   ```bash
   # Check your Python version (should be 3.8 or higher):
   python3 --version
   ```

3. **Virtual Environment Issues**
   ```bash
   # If virtual environment creation fails, install venv:
   sudo apt install python3.13-venv
   ```

4. **Port Already in Use**
   - If port 5000 is busy, edit `app.py` and change the port number in the last line
   - Or kill the process using port 5000: `sudo lsof -t -i:5000 | xargs kill -9`

5. **Package Installation Errors**
   ```bash
   # Update pip if you encounter installation issues:
   pip install --upgrade pip
   ```

### Getting Help

If you encounter any issues:
1. Check the terminal output for error messages
2. Ensure all dependencies are installed correctly
3. Try running the setup script again
4. Make sure you have an active internet connection

## File Structure

```
sports-card-tracker/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── setup.sh              # Automated setup script
├── run.sh                # Application startup script
├── sports_cards.db       # SQLite database (created automatically)
├── venv/                 # Python virtual environment
├── templates/
│   └── index.html        # Main HTML template
├── static/
│   ├── css/             # CSS stylesheets
│   └── js/              # JavaScript files
└── README.md            # Project documentation
```

## Development Notes

- The application runs in debug mode by default
- Database is automatically created on first run
- Sample data is loaded automatically if the database is empty
- All data is stored in SQLite database file `sports_cards.db`

## Security Notes

- This is a development server - not suitable for production
- The application runs on all network interfaces (0.0.0.0)
- No authentication is implemented - suitable for personal use only