#!/usr/bin/env python3

print("🚀 Starting Sports Card Tracker...")
print("⏳ Initializing database and loading sample data...")

import os
import sys
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app, db, SportsCard, Sale
from datetime import datetime

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        
        # Add sample data if database is empty
        if SportsCard.query.count() == 0:
            print("📊 Loading sample data...")
            
            sample_cards = [
                {
                    'player_name': 'Michael Jordan',
                    'card_set': 'Upper Deck',
                    'year': 1991,
                    'card_number': '44',
                    'sport': 'Basketball',
                    'condition': 'Near Mint',
                    'card_variant': 'Base',
                    'grading_service': 'PSA',
                    'grade': '9',
                    'description': 'Classic MJ card from his championship year'
                },
                {
                    'player_name': 'Tom Brady',
                    'card_set': 'Playoff Contenders',
                    'year': 2000,
                    'card_number': '144',
                    'sport': 'Football',
                    'condition': 'Mint',
                    'card_variant': 'Rookie Ticket Autograph',
                    'grading_service': 'BGS',
                    'grade': '9.5',
                    'description': 'Rookie card autograph'
                },
                {
                    'player_name': 'Wayne Gretzky',
                    'card_set': 'O-Pee-Chee',
                    'year': 1979,
                    'card_number': '18',
                    'sport': 'Hockey',
                    'condition': 'Excellent',
                    'card_variant': 'Rookie',
                    'grading_service': 'SGC',
                    'grade': '8',
                    'description': 'The Great One rookie card'
                },
                {
                    'player_name': 'LeBron James',
                    'card_set': 'Topps Chrome',
                    'year': 2003,
                    'card_number': '111',
                    'sport': 'Basketball',
                    'condition': 'Mint',
                    'card_variant': 'Refractor',
                    'grading_service': 'PSA',
                    'grade': '10',
                    'description': 'LeBron James rookie refractor'
                },
                {
                    'player_name': 'Patrick Mahomes',
                    'card_set': 'Panini Prizm',
                    'year': 2017,
                    'card_number': '252',
                    'sport': 'Football',
                    'condition': 'Mint',
                    'card_variant': 'Silver Prizm',
                    'grading_service': 'PSA',
                    'grade': '10',
                    'description': 'Mahomes rookie silver prizm'
                },
                {
                    'player_name': 'Connor McDavid',
                    'card_set': 'Upper Deck Young Guns',
                    'year': 2015,
                    'card_number': '201',
                    'sport': 'Hockey',
                    'condition': 'Mint',
                    'card_variant': 'Base',
                    'grading_service': 'Ungraded',
                    'grade': 'N/A',
                    'description': 'McDavid Young Guns rookie'
                }
            ]
            
            for card_data in sample_cards:
                card = SportsCard(**card_data)
                db.session.add(card)
            
            db.session.commit()
            
            # Add sample sales
            sample_sales = [
                {'card_id': 1, 'sale_price': 850.00, 'platform': 'eBay', 'sale_date': datetime(2024, 1, 15)},
                {'card_id': 1, 'sale_price': 920.00, 'platform': 'PWCC', 'sale_date': datetime(2024, 2, 22)},
                {'card_id': 2, 'sale_price': 15000.00, 'platform': 'Heritage Auctions', 'sale_date': datetime(2024, 1, 8)},
                {'card_id': 3, 'sale_price': 1200.00, 'platform': 'eBay', 'sale_date': datetime(2024, 1, 30)},
                {'card_id': 4, 'sale_price': 8500.00, 'platform': 'PWCC', 'sale_date': datetime(2024, 2, 10)},
                {'card_id': 5, 'sale_price': 3200.00, 'platform': 'eBay', 'sale_date': datetime(2024, 2, 5)},
                {'card_id': 6, 'sale_price': 450.00, 'platform': 'COMC', 'sale_date': datetime(2024, 1, 25)}
            ]
            
            for sale_data in sample_sales:
                sale = Sale(**sale_data)
                db.session.add(sale)
            
            db.session.commit()
            print("✅ Sample data loaded successfully!")
    
    print("")
    print("🌐 Sports Card Tracker is now running!")
    print("📱 Access your application at:")
    print("   • Local:   http://localhost:5000")
    print("   • Network: http://0.0.0.0:5000")
    print("")
    print("✨ Features available:")
    print("   • Search players by name")
    print("   • Filter by sport, variant, grading service, and grade")
    print("   • Add new cards with grading information")
    print("   • View sales history")
    print("   • Real-time search and filtering")
    print("")
    print("Press Ctrl+C to stop the server")
    print("="*50)
    
    app.run(debug=True, host='0.0.0.0', port=5000)