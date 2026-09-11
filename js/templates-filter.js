/**
 * HAVEN - Templates Filter
 * Handles template filtering functionality on the templates page
 */

(function() {
    'use strict';

    // Get filter elements
    const filterTabs = document.querySelectorAll('.filter-tab');
    const templateCards = document.querySelectorAll('.template-card');
    const templatesContainer = document.getElementById('templatesContainer');

    if (!filterTabs.length || !templateCards.length) {
        return; // Exit if not on templates page
    }

    // ========================================
    // FILTER FUNCTIONALITY
    // ========================================

    function filterTemplates(category) {
        let visibleCount = 0;

        templateCards.forEach(function(card) {
            const cardCategory = card.getAttribute('data-category');
            
            if (category === 'all' || cardCategory === category) {
                // Show card with animation
                card.classList.remove('hidden');
                card.style.animation = 'fadeIn 0.5s ease forwards';
                visibleCount++;
            } else {
                // Hide card
                card.classList.add('hidden');
            }
        });

        // Show message if no templates found
        showNoResultsMessage(visibleCount);

        // Update URL without reloading page
        updateURL(category);

        // Track filter change (if analytics is set up)
        if (window.gtag) {
            window.gtag('event', 'filter_templates', {
                event_category: 'Templates',
                event_label: category
            });
        }

        console.log(`✓ Filtered to: ${category} (${visibleCount} templates)`);
    }

    // ========================================
    // NO RESULTS MESSAGE
    // ========================================

    function showNoResultsMessage(count) {
        let messageEl = document.getElementById('noResultsMessage');

        if (count === 0) {
            if (!messageEl) {
                messageEl = document.createElement('div');
                messageEl.id = 'noResultsMessage';
                messageEl.className = 'no-results-message';
                messageEl.innerHTML = `
                    <div style="text-align: center; padding: 4rem 2rem;">
                        <svg style="width: 64px; height: 64px; color: var(--color-text-muted); margin: 0 auto 1rem;" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                            <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
                            <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            <path d="M11 8V14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                            <path d="M8 11H14" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                        </svg>
                        <h3 style="font-size: 1.5rem; margin-bottom: 0.5rem; color: var(--color-text-primary);">No templates found</h3>
                        <p style="color: var(--color-text-secondary);">Try selecting a different category.</p>
                    </div>
                `;
                templatesContainer.appendChild(messageEl);
            }
            messageEl.style.display = 'block';
        } else {
            if (messageEl) {
                messageEl.style.display = 'none';
            }
        }
    }

    // ========================================
    // UPDATE ACTIVE TAB
    // ========================================

    function updateActiveTab(activeTab) {
        filterTabs.forEach(function(tab) {
            tab.classList.remove('active');
        });
        activeTab.classList.add('active');
    }

    // ========================================
    // EVENT LISTENERS
    // ========================================

    filterTabs.forEach(function(tab) {
        tab.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            updateActiveTab(this);
            filterTemplates(category);
        });
    });

    // ========================================
    // KEYBOARD NAVIGATION FOR TABS
    // ========================================

    filterTabs.forEach(function(tab, index) {
        tab.addEventListener('keydown', function(e) {
            let newIndex;

            if (e.key === 'ArrowRight') {
                e.preventDefault();
                newIndex = (index + 1) % filterTabs.length;
                filterTabs[newIndex].focus();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                newIndex = (index - 1 + filterTabs.length) % filterTabs.length;
                filterTabs[newIndex].focus();
            } else if (e.key === 'Home') {
                e.preventDefault();
                filterTabs[0].focus();
            } else if (e.key === 'End') {
                e.preventDefault();
                filterTabs[filterTabs.length - 1].focus();
            }
        });
    });

    // ========================================
    // URL PARAMETERS
    // ========================================

    function updateURL(category) {
        if (category === 'all') {
            // Remove category parameter
            const url = new URL(window.location);
            url.searchParams.delete('category');
            window.history.replaceState({}, '', url);
        } else {
            // Add category parameter
            const url = new URL(window.location);
            url.searchParams.set('category', category);
            window.history.replaceState({}, '', url);
        }
    }

    function loadFromURL() {
        const urlParams = new URLSearchParams(window.location.search);
        const category = urlParams.get('category');

        if (category) {
            // Find and activate the matching tab
            const matchingTab = Array.from(filterTabs).find(function(tab) {
                return tab.getAttribute('data-category') === category;
            });

            if (matchingTab) {
                updateActiveTab(matchingTab);
                filterTemplates(category);
            }
        }
    }

    // Load filter from URL on page load
    loadFromURL();

    // ========================================
    // TEMPLATE CARD INTERACTIONS
    // ========================================

    templateCards.forEach(function(card) {
        // Add ripple effect on click (optional visual enhancement)
        card.addEventListener('click', function(e) {
            if (e.target.tagName !== 'A' && e.target.tagName !== 'BUTTON') {
                const primaryBtn = this.querySelector('.btn-primary');
                if (primaryBtn) {
                    primaryBtn.click();
                }
            }
        });

        // Track template card clicks
        const buttons = card.querySelectorAll('.btn');
        buttons.forEach(function(btn) {
            btn.addEventListener('click', function() {
                const templateName = card.querySelector('.template-title').textContent;
                
                if (window.gtag) {
                    window.gtag('event', 'template_interaction', {
                        event_category: 'Templates',
                        event_label: templateName
                    });
                }
            });
        });
    });

    // ========================================
    // SEARCH FUNCTIONALITY (OPTIONAL)
    // ========================================

    function createSearchBox() {
        const filterSection = document.querySelector('.template-filter');
        if (!filterSection) return;

        const searchContainer = document.createElement('div');
        searchContainer.className = 'template-search';
        searchContainer.style.cssText = `
            max-width: 400px;
            margin: 2rem auto 0;
        `;

        searchContainer.innerHTML = `
            <div style="position: relative;">
                <input 
                    type="text" 
                    id="templateSearch" 
                    placeholder="Search templates..."
                    style="
                        width: 100%;
                        padding: 0.875rem 1rem 0.875rem 3rem;
                        background: var(--color-card);
                        border: 1px solid var(--color-border);
                        border-radius: var(--radius-md);
                        color: var(--color-text-primary);
                        font-size: 0.9375rem;
                        transition: all var(--transition-fast);
                    "
                >
                <svg 
                    style="
                        position: absolute;
                        left: 1rem;
                        top: 50%;
                        transform: translateY(-50%);
                        width: 20px;
                        height: 20px;
                        color: var(--color-text-muted);
                        pointer-events: none;
                    "
                    viewBox="0 0 24 24" 
                    fill="none" 
                    xmlns="http://www.w3.org/2000/svg"
                >
                    <circle cx="11" cy="11" r="8" stroke="currentColor" stroke-width="2"/>
                    <path d="M21 21L16.65 16.65" stroke="currentColor" stroke-width="2" stroke-linecap="round"/>
                </svg>
            </div>
        `;

        filterSection.appendChild(searchContainer);

        const searchInput = document.getElementById('templateSearch');
        
        searchInput.addEventListener('input', debounce(function() {
            const searchTerm = this.value.toLowerCase().trim();
            searchTemplates(searchTerm);
        }, 300));

        searchInput.addEventListener('focus', function() {
            this.style.borderColor = 'var(--color-violet-primary)';
            this.style.boxShadow = '0 0 0 3px rgba(139, 92, 255, 0.1)';
        });

        searchInput.addEventListener('blur', function() {
            this.style.borderColor = 'var(--color-border)';
            this.style.boxShadow = 'none';
        });
    }

    function searchTemplates(searchTerm) {
        let visibleCount = 0;
        const activeCategory = document.querySelector('.filter-tab.active').getAttribute('data-category');

        templateCards.forEach(function(card) {
            const cardCategory = card.getAttribute('data-category');
            const templateName = card.querySelector('.template-title').textContent.toLowerCase();
            const templateDesc = card.querySelector('.template-description').textContent.toLowerCase();
            
            const matchesCategory = activeCategory === 'all' || cardCategory === activeCategory;
            const matchesSearch = searchTerm === '' || templateName.includes(searchTerm) || templateDesc.includes(searchTerm);

            if (matchesCategory && matchesSearch) {
                card.classList.remove('hidden');
                card.style.animation = 'fadeIn 0.5s ease forwards';
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        showNoResultsMessage(visibleCount);
    }

    // Initialize search box
    createSearchBox();

    // ========================================
    // ANIMATE ON SCROLL
    // ========================================

    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const cardObserver = new IntersectionObserver(function(entries) {
        entries.forEach(function(entry) {
            if (entry.isIntersecting && !entry.target.classList.contains('hidden')) {
                entry.target.style.animation = 'fadeIn 0.5s ease forwards';
            }
        });
    }, observerOptions);

    templateCards.forEach(function(card) {
        cardObserver.observe(card);
    });

    // ========================================
    // UTILITY: DEBOUNCE
    // ========================================

    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // ========================================
    // ADD FADEIN ANIMATION
    // ========================================

    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeIn {
            from {
                opacity: 0;
                transform: translateY(20px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .template-card.hidden {
            display: none;
        }

        .template-search input:focus {
            outline: none;
        }
    `;
    document.head.appendChild(style);

    console.log('✓ Template filter initialized');

})();
