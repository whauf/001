from flask import Flask, render_template, request, jsonify
from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os

app = Flask(__name__)

# Database configuration
basedir = os.path.abspath(os.path.dirname(__file__))
app.config['SQLALCHEMY_DATABASE_URI'] = f'sqlite:///{os.path.join(basedir, "sports_cards.db")}'
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)

# Database Models
class SportsCard(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    player_name = db.Column(db.String(100), nullable=False)
    card_set = db.Column(db.String(100), nullable=False)
    year = db.Column(db.Integer, nullable=False)
    card_number = db.Column(db.String(20), nullable=False)
    sport = db.Column(db.String(50), nullable=False)
    condition = db.Column(db.String(20), nullable=False)
    description = db.Column(db.Text)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)
    
    # Relationship to sales
    sales = db.relationship('Sale', backref='card', lazy=True, order_by='Sale.sale_date.desc()')
    
    def to_dict(self):
        return {
            'id': self.id,
            'player_name': self.player_name,
            'card_set': self.card_set,
            'year': self.year,
            'card_number': self.card_number,
            'sport': self.sport,
            'condition': self.condition,
            'description': self.description,
            'created_at': self.created_at.isoformat() if self.created_at else None
        }

class Sale(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    card_id = db.Column(db.Integer, db.ForeignKey('sports_card.id'), nullable=False)
    sale_price = db.Column(db.Float, nullable=False)
    sale_date = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)
    platform = db.Column(db.String(50), nullable=False)  # eBay, PWCC, etc.
    buyer_info = db.Column(db.String(100))
    seller_info = db.Column(db.String(100))
    notes = db.Column(db.Text)
    
    def to_dict(self):
        return {
            'id': self.id,
            'card_id': self.card_id,
            'sale_price': self.sale_price,
            'sale_date': self.sale_date.isoformat() if self.sale_date else None,
            'platform': self.platform,
            'buyer_info': self.buyer_info,
            'seller_info': self.seller_info,
            'notes': self.notes
        }

# Routes
@app.route('/')
def index():
    return render_template('index.html')

@app.route('/api/cards', methods=['GET'])
def get_cards():
    cards = SportsCard.query.all()
    cards_data = []
    
    for card in cards:
        card_dict = card.to_dict()
        # Get last sale
        last_sale = Sale.query.filter_by(card_id=card.id).order_by(Sale.sale_date.desc()).first()
        card_dict['last_sale'] = last_sale.to_dict() if last_sale else None
        cards_data.append(card_dict)
    
    return jsonify(cards_data)

@app.route('/api/cards', methods=['POST'])
def add_card():
    data = request.get_json()
    
    card = SportsCard(
        player_name=data['player_name'],
        card_set=data['card_set'],
        year=data['year'],
        card_number=data['card_number'],
        sport=data['sport'],
        condition=data['condition'],
        description=data.get('description', '')
    )
    
    db.session.add(card)
    db.session.commit()
    
    return jsonify(card.to_dict()), 201

@app.route('/api/cards/<int:card_id>/sales', methods=['GET'])
def get_card_sales(card_id):
    sales = Sale.query.filter_by(card_id=card_id).order_by(Sale.sale_date.desc()).all()
    return jsonify([sale.to_dict() for sale in sales])

@app.route('/api/sales', methods=['POST'])
def add_sale():
    data = request.get_json()
    
    sale = Sale(
        card_id=data['card_id'],
        sale_price=data['sale_price'],
        sale_date=datetime.fromisoformat(data['sale_date']) if 'sale_date' in data else datetime.utcnow(),
        platform=data['platform'],
        buyer_info=data.get('buyer_info', ''),
        seller_info=data.get('seller_info', ''),
        notes=data.get('notes', '')
    )
    
    db.session.add(sale)
    db.session.commit()
    
    return jsonify(sale.to_dict()), 201

@app.route('/api/cards/<int:card_id>/last-sale', methods=['GET'])
def get_last_sale(card_id):
    last_sale = Sale.query.filter_by(card_id=card_id).order_by(Sale.sale_date.desc()).first()
    if last_sale:
        return jsonify(last_sale.to_dict())
    return jsonify({'message': 'No sales found for this card'}), 404

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
        
        # Add sample data if database is empty
        if SportsCard.query.count() == 0:
            sample_cards = [
                {
                    'player_name': 'Michael Jordan',
                    'card_set': 'Upper Deck',
                    'year': 1991,
                    'card_number': '44',
                    'sport': 'Basketball',
                    'condition': 'Near Mint',
                    'description': 'Classic MJ card from his championship year'
                },
                {
                    'player_name': 'Tom Brady',
                    'card_set': 'Playoff Contenders',
                    'year': 2000,
                    'card_number': '144',
                    'sport': 'Football',
                    'condition': 'Mint',
                    'description': 'Rookie card autograph'
                },
                {
                    'player_name': 'Wayne Gretzky',
                    'card_set': 'O-Pee-Chee',
                    'year': 1979,
                    'card_number': '18',
                    'sport': 'Hockey',
                    'condition': 'Excellent',
                    'description': 'The Great One rookie card'
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
                {'card_id': 3, 'sale_price': 1200.00, 'platform': 'eBay', 'sale_date': datetime(2024, 1, 30)}
            ]
            
            for sale_data in sample_sales:
                sale = Sale(**sale_data)
                db.session.add(sale)
            
            db.session.commit()
    
    app.run(debug=True, host='0.0.0.0', port=5000)