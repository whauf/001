// Global variables
let cardsData = [];

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadCards();
    
    // Set today's date as default for sale date
    document.getElementById('saleDate').valueAsDate = new Date();
});

// Load all cards
async function loadCards() {
    try {
        const response = await fetch('/api/cards');
        cardsData = await response.json();
        displayCards();
    } catch (error) {
        console.error('Error loading cards:', error);
        showAlert('Error loading cards', 'danger');
    }
}

// Display cards in the table
function displayCards() {
    const tbody = document.getElementById('cardsTableBody');
    tbody.innerHTML = '';
    
    cardsData.forEach(card => {
        const row = document.createElement('tr');
        
        // Format last sale info
        let lastSaleHtml = '<span class="text-muted">No sales</span>';
        if (card.last_sale) {
            const saleDate = new Date(card.last_sale.sale_date).toLocaleDateString();
            lastSaleHtml = `
                <div>
                    <span class="badge badge-price bg-success">$${card.last_sale.sale_price.toFixed(2)}</span>
                    <div class="small text-muted">${saleDate}</div>
                    <div class="small text-muted">${card.last_sale.platform}</div>
                </div>
            `;
        }
        
        // Get condition badge class
        const conditionClass = getConditionClass(card.condition);
        
        row.innerHTML = `
            <td><strong>${card.player_name}</strong></td>
            <td>${card.card_set}</td>
            <td>${card.year}</td>
            <td>${card.card_number}</td>
            <td>${card.sport}</td>
            <td><span class="badge ${conditionClass}">${card.condition}</span></td>
            <td>${lastSaleHtml}</td>
            <td>
                <button class="btn btn-sm btn-primary me-1" onclick="openAddSaleModal(${card.id})">
                    <i class="fas fa-dollar-sign"></i> Add Sale
                </button>
                <button class="btn btn-sm btn-info" onclick="viewSalesHistory(${card.id})">
                    <i class="fas fa-history"></i> History
                </button>
            </td>
        `;
        
        tbody.appendChild(row);
    });
}

// Get CSS class for condition badge
function getConditionClass(condition) {
    const conditionMap = {
        'Mint': 'condition-mint',
        'Near Mint': 'condition-near-mint',
        'Excellent': 'condition-excellent',
        'Very Good': 'condition-very-good',
        'Good': 'condition-good',
        'Fair': 'condition-fair',
        'Poor': 'condition-poor'
    };
    return `condition-badge ${conditionMap[condition] || 'bg-secondary'}`;
}

// Add new card
async function addCard() {
    const formData = {
        player_name: document.getElementById('playerName').value,
        card_set: document.getElementById('cardSet').value,
        year: parseInt(document.getElementById('year').value),
        card_number: document.getElementById('cardNumber').value,
        sport: document.getElementById('sport').value,
        condition: document.getElementById('condition').value,
        description: document.getElementById('description').value
    };
    
    try {
        const response = await fetch('/api/cards', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            // Close modal and reset form
            const modal = bootstrap.Modal.getInstance(document.getElementById('addCardModal'));
            modal.hide();
            document.getElementById('addCardForm').reset();
            
            // Reload cards
            await loadCards();
            showAlert('Card added successfully!', 'success');
        } else {
            showAlert('Error adding card', 'danger');
        }
    } catch (error) {
        console.error('Error adding card:', error);
        showAlert('Error adding card', 'danger');
    }
}

// Open add sale modal
function openAddSaleModal(cardId) {
    document.getElementById('saleCardId').value = cardId;
    document.getElementById('addSaleForm').reset();
    document.getElementById('saleDate').valueAsDate = new Date();
    
    const modal = new bootstrap.Modal(document.getElementById('addSaleModal'));
    modal.show();
}

// Add new sale
async function addSale() {
    const formData = {
        card_id: parseInt(document.getElementById('saleCardId').value),
        sale_price: parseFloat(document.getElementById('salePrice').value),
        sale_date: document.getElementById('saleDate').value + 'T00:00:00',
        platform: document.getElementById('platform').value,
        buyer_info: document.getElementById('buyerInfo').value,
        seller_info: document.getElementById('sellerInfo').value,
        notes: document.getElementById('saleNotes').value
    };
    
    try {
        const response = await fetch('/api/sales', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(formData)
        });
        
        if (response.ok) {
            // Close modal and reset form
            const modal = bootstrap.Modal.getInstance(document.getElementById('addSaleModal'));
            modal.hide();
            document.getElementById('addSaleForm').reset();
            
            // Reload cards to update last sale info
            await loadCards();
            showAlert('Sale added successfully!', 'success');
        } else {
            showAlert('Error adding sale', 'danger');
        }
    } catch (error) {
        console.error('Error adding sale:', error);
        showAlert('Error adding sale', 'danger');
    }
}

// View sales history for a card
async function viewSalesHistory(cardId) {
    try {
        const response = await fetch(`/api/cards/${cardId}/sales`);
        const sales = await response.json();
        
        const card = cardsData.find(c => c.id === cardId);
        const modalTitle = document.querySelector('#salesHistoryModal .modal-title');
        modalTitle.textContent = `Sales History - ${card.player_name} ${card.year} ${card.card_set} #${card.card_number}`;
        
        const content = document.getElementById('salesHistoryContent');
        
        if (sales.length === 0) {
            content.innerHTML = '<div class="no-sales">No sales recorded for this card yet.</div>';
        } else {
            content.innerHTML = sales.map(sale => {
                const saleDate = new Date(sale.sale_date).toLocaleDateString();
                return `
                    <div class="sale-item">
                        <div class="d-flex justify-content-between align-items-start">
                            <div>
                                <div class="sale-price">$${sale.sale_price.toFixed(2)}</div>
                                <div class="sale-date">${saleDate}</div>
                                ${sale.buyer_info ? `<div class="small">Buyer: ${sale.buyer_info}</div>` : ''}
                                ${sale.seller_info ? `<div class="small">Seller: ${sale.seller_info}</div>` : ''}
                                ${sale.notes ? `<div class="small mt-2">${sale.notes}</div>` : ''}
                            </div>
                            <div>
                                <span class="sale-platform">${sale.platform}</span>
                            </div>
                        </div>
                    </div>
                `;
            }).join('');
        }
        
        const modal = new bootstrap.Modal(document.getElementById('salesHistoryModal'));
        modal.show();
    } catch (error) {
        console.error('Error loading sales history:', error);
        showAlert('Error loading sales history', 'danger');
    }
}

// Show alert message
function showAlert(message, type) {
    // Remove existing alerts
    const existingAlert = document.querySelector('.alert');
    if (existingAlert) {
        existingAlert.remove();
    }
    
    // Create new alert
    const alert = document.createElement('div');
    alert.className = `alert alert-${type} alert-dismissible fade show`;
    alert.innerHTML = `
        ${message}
        <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
    `;
    
    // Insert at the top of the container
    const container = document.querySelector('.container');
    container.insertBefore(alert, container.firstChild);
    
    // Auto-dismiss after 5 seconds
    setTimeout(() => {
        if (alert && alert.parentNode) {
            alert.remove();
        }
    }, 5000);
}