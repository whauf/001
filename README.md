# Sports Card Tracker

A comprehensive web application for tracking sports cards and their sales history. This application allows you to catalog your sports card collection and monitor the sales performance of each card over time.

## Features

- **Card Management**: Add, view, and manage your sports card collection
- **Sales Tracking**: Record sales transactions for each card
- **Last Sale Display**: Easily see the most recent sale price and details for each card
- **Sales History**: View complete sales history for any card
- **Beautiful UI**: Modern, responsive web interface built with Bootstrap
- **Multiple Sports**: Support for Basketball, Football, Baseball, Hockey, Soccer, and more
- **Condition Tracking**: Track card condition with color-coded badges
- **Platform Tracking**: Record which platform/marketplace the sale occurred on

## Database Schema

### Sports Cards Table
- Player name, card set, year, card number
- Sport type and condition
- Description and creation timestamp
- Relationship to sales records

### Sales Table
- Sale price, date, and platform
- Buyer and seller information (optional)
- Notes and additional details
- Foreign key relationship to sports cards

## Installation

1. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

2. **Run the application:**
   ```bash
   python app.py
   ```

3. **Access the application:**
   Open your browser and navigate to `http://localhost:5000`

## API Endpoints

- `GET /api/cards` - Get all cards with last sale information
- `POST /api/cards` - Add a new sports card
- `GET /api/cards/<id>/sales` - Get sales history for a specific card
- `POST /api/sales` - Add a new sale record
- `GET /api/cards/<id>/last-sale` - Get the most recent sale for a card

## Usage

### Adding Cards
1. Click the "Add Card" button in the navigation
2. Fill in the card details (player, set, year, etc.)
3. Select the sport and condition
4. Add an optional description
5. Click "Add Card" to save

### Recording Sales
1. Find the card in the main table
2. Click "Add Sale" button for that card
3. Enter sale price, platform, and date
4. Add optional buyer/seller information and notes
5. Click "Add Sale" to record the transaction

### Viewing Sales History
1. Click the "History" button for any card
2. View all sales in chronological order (most recent first)
3. See detailed information including prices, dates, and platforms

## Sample Data

The application comes pre-loaded with sample data including:
- Michael Jordan 1991 Upper Deck #44
- Tom Brady 2000 Playoff Contenders #144 (Rookie)
- Wayne Gretzky 1979 O-Pee-Chee #18 (Rookie)

Each sample card includes example sales data to demonstrate the functionality.

## Technical Details

- **Backend**: Flask web framework with SQLAlchemy ORM
- **Database**: SQLite for local data storage
- **Frontend**: HTML5, CSS3, JavaScript with Bootstrap 5
- **Icons**: Font Awesome for UI icons
- **Responsive Design**: Mobile-friendly interface

## File Structure

```
sports-card-tracker/
├── app.py                 # Main Flask application
├── requirements.txt       # Python dependencies
├── sports_cards.db       # SQLite database (created on first run)
├── templates/
│   └── index.html        # Main HTML template
├── static/
│   ├── css/
│   │   └── style.css     # Custom CSS styles
│   └── js/
│       └── app.js        # JavaScript functionality
└── README.md             # This file
```

## Future Enhancements

Possible future features could include:
- Image upload for cards
- Price trend analysis and charts
- Export functionality (CSV, PDF)
- Card grading integration
- Market value estimation
- Advanced filtering and search
- User authentication and multi-user support
- Integration with external APIs (eBay, PWCC, etc.)

## License

This project is open source and available under the MIT License.
