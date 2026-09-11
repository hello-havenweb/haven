/**
 * HAVEN Configuration
 * Central configuration for pricing, currency, and global settings
 */

const HAVEN_CONFIG = {
    // Base Prices (in PKR)
    pricing: {
        websiteBase: 25000,      // Base website design + development
        domain: 3000,            // Domain registration (average)
        hosting: 5000,           // Annual hosting
        
        // Template-specific pricing adjustments
        templates: {
            nexus: 0,            // No additional cost (uses base price)
            vintage: 0,
            lumiere: 5000,       // +5000 for advanced features
            nova: 0,
            aura: 3000,          // +3000 for portfolio gallery
            pulse: 7000          // +7000 for SaaS features
        }
    },
    
    // Currency Configuration
    currencies: {
        PKR: {
            symbol: 'Rs.',
            rate: 1,
            name: 'Pakistani Rupee',
            format: 'symbol_amount'  // Rs. 25,000
        },
        USD: {
            symbol: '$',
            rate: 0.0036,
            name: 'US Dollar',
            format: 'symbol_amount'  // $90
        },
        EUR: {
            symbol: '€',
            rate: 0.0033,
            name: 'Euro',
            format: 'symbol_amount'  // €83
        },
        GBP: {
            symbol: '£',
            rate: 0.0028,
            name: 'British Pound',
            format: 'symbol_amount'  // £71
        },
        AED: {
            symbol: 'AED',
            rate: 0.013,
            name: 'UAE Dirham',
            format: 'amount_symbol'  // 330 AED
        },
        SAR: {
            symbol: 'SAR',
            rate: 0.013,
            name: 'Saudi Riyal',
            format: 'amount_symbol'  // 330 SAR
        }
    },
    
    // Country to Currency Mapping
    countryToCurrency: {
        'PK': 'PKR',
        'US': 'USD',
        'GB': 'GBP',
        'DE': 'EUR',
        'FR': 'EUR',
        'IT': 'EUR',
        'ES': 'EUR',
        'NL': 'EUR',
        'AE': 'AED',
        'SA': 'SAR',
        'IN': 'USD',  // India uses USD for international services
        'CA': 'USD',
        'AU': 'USD'
    },
    
    // Default currency
    defaultCurrency: 'PKR',
    
    // Contact Information
    contact: {
        email: 'hello@haven.pntr.dev',
        website: 'https://haven.pntr.dev'
    },
    
    // Domain & Hosting Providers (configurable)
    providers: {
        domain: ['Namecheap', 'GoDaddy', 'Cloudflare'],
        hosting: ['Hostinger', 'Cloudflare Pages', 'Vercel']
    },
    
    // Features
    features: {
        autoDetectCurrency: true,
        showPriceDisclaimer: true,
        allowManualCurrencySwitch: true
    }
};

// Price Calculation Functions
const PriceCalculator = {
    /**
     * Calculate total price based on options
     */
    calculate(options = {}) {
        const {
            template = null,
            includeDomain = false,
            includeHosting = false,
            currency = HAVEN_CONFIG.defaultCurrency
        } = options;
        
        let total = HAVEN_CONFIG.pricing.websiteBase;
        
        // Add template-specific cost
        if (template && HAVEN_CONFIG.pricing.templates[template]) {
            total += HAVEN_CONFIG.pricing.templates[template];
        }
        
        // Add domain cost
        if (includeDomain) {
            total += HAVEN_CONFIG.pricing.domain;
        }
        
        // Add hosting cost
        if (includeHosting) {
            total += HAVEN_CONFIG.pricing.hosting;
        }
        
        // Convert to selected currency
        return this.convertPrice(total, currency);
    },
    
    /**
     * Convert price from PKR to target currency
     */
    convertPrice(amountPKR, targetCurrency) {
        const currencyData = HAVEN_CONFIG.currencies[targetCurrency];
        if (!currencyData) return amountPKR;
        
        const converted = Math.round(amountPKR * currencyData.rate);
        return converted;
    },
    
    /**
     * Format price with currency symbol
     */
    formatPrice(amount, currency) {
        const currencyData = HAVEN_CONFIG.currencies[currency];
        if (!currencyData) return amount.toLocaleString();
        
        const formatted = amount.toLocaleString();
        
        if (currencyData.format === 'symbol_amount') {
            return `${currencyData.symbol} ${formatted}`;
        } else {
            return `${formatted} ${currencyData.symbol}`;
        }
    },
    
    /**
     * Get price range for display
     */
    getPriceRange(currency = HAVEN_CONFIG.defaultCurrency) {
        const basePrice = this.convertPrice(HAVEN_CONFIG.pricing.websiteBase, currency);
        const maxAddon = Math.max(...Object.values(HAVEN_CONFIG.pricing.templates));
        const maxPrice = this.convertPrice(
            HAVEN_CONFIG.pricing.websiteBase + HAVEN_CONFIG.pricing.domain + HAVEN_CONFIG.pricing.hosting + maxAddon,
            currency
        );
        
        return {
            min: this.formatPrice(basePrice, currency),
            max: this.formatPrice(maxPrice, currency)
        };
    }
};

// Currency Detection
const CurrencyDetector = {
    /**
     * Detect user's currency based on location
     */
    async detectCurrency() {
        if (!HAVEN_CONFIG.features.autoDetectCurrency) {
            return HAVEN_CONFIG.defaultCurrency;
        }
        
        try {
            // Try to get country from IP
            const response = await fetch('https://ipapi.co/json/');
            const data = await response.json();
            const countryCode = data.country_code;
            
            // Map country to currency
            return HAVEN_CONFIG.countryToCurrency[countryCode] || HAVEN_CONFIG.defaultCurrency;
        } catch (error) {
            console.warn('Currency detection failed, using default:', error);
            return HAVEN_CONFIG.defaultCurrency;
        }
    },
    
    /**
     * Get currency from session storage
     */
    getSavedCurrency() {
        return sessionStorage.getItem('haven_currency') || null;
    },
    
    /**
     * Save currency to session storage
     */
    saveCurrency(currency) {
        sessionStorage.setItem('haven_currency', currency);
    },
    
    /**
     * Initialize currency (detect or use saved)
     */
    async initCurrency() {
        const saved = this.getSavedCurrency();
        if (saved && HAVEN_CONFIG.currencies[saved]) {
            return saved;
        }
        
        const detected = await this.detectCurrency();
        this.saveCurrency(detected);
        return detected;
    }
};

// Export for use in other scripts
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { HAVEN_CONFIG, PriceCalculator, CurrencyDetector };
}
