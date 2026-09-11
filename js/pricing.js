/**
 * HAVEN Pricing Page
 * Handles currency detection and price calculation
 */

(function() {
    'use strict';

    let currentCurrency = 'PKR';

    // Initialize pricing
    async function initPricing() {
        // Detect or load saved currency
        currentCurrency = await CurrencyDetector.initCurrency();
        
        // Update currency selector
        const currencySelect = document.getElementById('currencySelect');
        if (currencySelect) {
            currencySelect.value = currentCurrency;
            
            // Listen for manual currency changes
            currencySelect.addEventListener('change', function() {
                currentCurrency = this.value;
                CurrencyDetector.saveCurrency(currentCurrency);
                updateAllPrices();
            });
        }
        
        // Calculate and display all prices
        updateAllPrices();
    }

    // Update all prices on page
    function updateAllPrices() {
        updatePrice('priceWebsiteOnly', {
            includeDomain: false,
            includeHosting: false
        });
        
        updatePrice('priceWebsiteDomain', {
            includeDomain: true,
            includeHosting: false
        });
        
        updatePrice('priceWebsiteHosting', {
            includeDomain: false,
            includeHosting: true
        });
        
        updatePrice('priceComplete', {
            includeDomain: true,
            includeHosting: true
        });
    }

    // Update individual price
    function updatePrice(elementId, options) {
        const element = document.getElementById(elementId);
        if (!element) return;
        
        const price = PriceCalculator.calculate({
            ...options,
            currency: currentCurrency
        });
        
        const formattedPrice = PriceCalculator.formatPrice(price, currentCurrency);
        element.innerHTML = formattedPrice;
    }

    // Initialize when DOM is ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initPricing);
    } else {
        initPricing();
    }

})();
