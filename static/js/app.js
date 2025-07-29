// Global variables
let cardsData = [];
let filteredCards = [];
let searchTimeout;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadCards();
    
    // Set today's date as default for sale date
    document.getElementById('saleDate').valueAsDate = new Date();
    
    // Add event listeners for real-time search
    document.getElementById('searchPlayer').addEventListener('input', debounceSearch);
    document.getElementById('searchSport').addEventListener('change', searchCards);
    document.getElementById('searchVariant').addEventListener('change', searchCards);
    document.getElementById('searchGradingService').addEventListener('change', searchCards);
    document.getElementById('searchGrade').addEventListener('change', searchCards);
    
    // Add event listener for grading service change in add card form
    document.getElementById('gradingService').addEventListener('change', updateGradeOptions);
});

// Load all cards
async function loadCards() {
    try {
        const response = await fetch('/api/cards');
        cardsData = await response.json();
        filteredCards = cardsData;
        displayCards();
        updateCardCount();
    } catch (error) {
        console.error('Error loading cards:', error);
        showAlert('Error loading cards', 'danger');
    }
}

// Display cards in the table
function displayCards() {
    const tbody = document.getElementById('cardsTableBody');
    tbody.innerHTML = '';
    
    filteredCards.forEach(card => {
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
        
        // Format grading info
        let gradingHtml = '';
        if (card.grading_service === 'Ungraded') {
            gradingHtml = '<span class="badge bg-secondary">Ungraded</span>';
        } else {
            const gradeClass = getGradeClass(card.grade);
            gradingHtml = `
                <div>
                    <span class="badge ${gradeClass}">${card.grading_service} ${card.grade}</span>
                </div>
            `;
        }
        
        // Format variant
        const variantClass = getVariantClass(card.card_variant);
        
        row.innerHTML = `
            <td><strong>${card.player_name}</strong></td>
            <td>${card.card_set}</td>
            <td>${card.year}</td>
            <td>${card.card_number}</td>
            <td>${card.sport}</td>
            <td><span class="badge ${variantClass}">${card.card_variant}</span></td>
            <td>${gradingHtml}</td>
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

// Get CSS class for grade badge
function getGradeClass(grade) {
    const gradeNum = parseFloat(grade);
    if (gradeNum >= 10) return 'grade-gem-mint';
    if (gradeNum >= 9.5) return 'grade-mint-plus';
    if (gradeNum >= 9) return 'grade-mint';
    if (gradeNum >= 8.5) return 'grade-near-mint-plus';
    if (gradeNum >= 8) return 'grade-near-mint';
    if (gradeNum >= 7) return 'grade-good';
    return 'grade-poor';
}

// Get CSS class for variant badge
function getVariantClass(variant) {
    const variantMap = {
        'Base': 'variant-base',
        'Rookie': 'variant-rookie',
        'Refractor': 'variant-refractor',
        'Prizm': 'variant-prizm',
        'Silver Prizm': 'variant-prizm',
        'Gold Prizm': 'variant-prizm-special',
        'Rainbow Prizm': 'variant-prizm-special',
        'Autograph': 'variant-autograph',
        'Rookie Ticket Autograph': 'variant-autograph',
        'Jersey': 'variant-memorabilia',
        'Patch': 'variant-memorabilia',
        'One of One': 'variant-rare',
        'Serial Numbered': 'variant-numbered'
    };
    return `variant-badge ${variantMap[variant] || 'bg-info'}`;
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
        card_variant: document.getElementById('cardVariant').value,
        grading_service: document.getElementById('gradingService').value,
        grade: document.getElementById('grade').value,
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

// Search functionality
async function searchCards() {
    const playerName = document.getElementById('searchPlayer').value;
    const sport = document.getElementById('searchSport').value;
    const variant = document.getElementById('searchVariant').value;
    const gradingService = document.getElementById('searchGradingService').value;
    const grade = document.getElementById('searchGrade').value;
    
    // Build query parameters
    const params = new URLSearchParams();
    if (playerName) params.append('player_name', playerName);
    if (sport && sport !== 'all') params.append('sport', sport);
    if (variant && variant !== 'all') params.append('card_variant', variant);
    if (gradingService && gradingService !== 'all') params.append('grading_service', gradingService);
    if (grade && grade !== 'all') params.append('grade', grade);
    
    try {
        const response = await fetch(`/api/cards/search?${params.toString()}`);
        filteredCards = await response.json();
        displayCards();
        updateCardCount();
    } catch (error) {
        console.error('Error searching cards:', error);
        showAlert('Error searching cards', 'danger');
    }
}

// Debounced search for player name input
function debounceSearch() {
    clearTimeout(searchTimeout);
    searchTimeout = setTimeout(searchCards, 300);
}

// Clear all search filters
function clearSearch() {
    document.getElementById('searchPlayer').value = '';
    document.getElementById('searchSport').value = 'all';
    document.getElementById('searchVariant').value = 'all';
    document.getElementById('searchGradingService').value = 'all';
    document.getElementById('searchGrade').value = 'all';
    
    filteredCards = cardsData;
    displayCards();
    updateCardCount();
}

// Update card count display
function updateCardCount() {
    const countElement = document.getElementById('cardCount');
    const count = filteredCards.length;
    countElement.textContent = `${count} card${count !== 1 ? 's' : ''}`;
}

// Update grade options based on grading service
function updateGradeOptions() {
    const gradingService = document.getElementById('gradingService').value;
    const gradeSelect = document.getElementById('grade');
    
    // Clear current options
    gradeSelect.innerHTML = '';
    
    if (gradingService === 'Ungraded') {
        gradeSelect.innerHTML = '<option value="N/A">N/A (Ungraded)</option>';
    } else {
        // Standard grading scale for most services
        const gradeOptions = [
            { value: '10', text: '10 (Gem Mint)' },
            { value: '9.5', text: '9.5 (Mint+)' },
            { value: '9', text: '9 (Mint)' },
            { value: '8.5', text: '8.5 (NM-MT+)' },
            { value: '8', text: '8 (Near Mint-Mint)' },
            { value: '7.5', text: '7.5 (NM+)' },
            { value: '7', text: '7 (Near Mint)' },
            { value: '6.5', text: '6.5 (EX-NM+)' },
            { value: '6', text: '6 (Excellent-Mint)' },
            { value: '5.5', text: '5.5 (EX+)' },
            { value: '5', text: '5 (Excellent)' },
            { value: '4', text: '4 (Very Good-Excellent)' },
            { value: '3', text: '3 (Very Good)' },
            { value: '2', text: '2 (Good)' },
            { value: '1', text: '1 (Poor-Fair)' }
        ];
        
        // Add authentic option for certain services
        if (['PSA', 'SGC', 'JSA'].includes(gradingService)) {
            gradeOptions.push({ value: 'A', text: 'A (Authentic)' });
        }
        
        gradeOptions.forEach(option => {
            const optionElement = document.createElement('option');
            optionElement.value = option.value;
            optionElement.textContent = option.text;
            gradeSelect.appendChild(optionElement);
        });
    }
}