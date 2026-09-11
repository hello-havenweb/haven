/**
 * HAVEN Templates Filter
 * Handles template category filtering with smooth animations
 */

(function() {
    'use strict';

    const filterTabs = document.querySelectorAll('.filter-tab');
    const templateCards = document.querySelectorAll('.template-card');
    const noTemplatesMessage = document.getElementById('noTemplatesMessage');

    if (!filterTabs.length || !templateCards.length) return;

    // Filter templates
    function filterTemplates(category) {
        let visibleCount = 0;

        templateCards.forEach((card, index) => {
            const cardCategory = card.getAttribute('data-category');
            
            if (category === 'all' || cardCategory === category) {
                card.classList.remove('hidden');
                card.style.animation = `fadeInUp 0.5s ease ${index * 0.05}s forwards`;
                visibleCount++;
            } else {
                card.classList.add('hidden');
            }
        });

        // Show/hide no results message
        if (noTemplatesMessage) {
            if (visibleCount === 0) {
                noTemplatesMessage.style.display = 'flex';
            } else {
                noTemplatesMessage.style.display = 'none';
            }
        }

        // Track filter (if analytics)
        if (window.gtag) {
            window.gtag('event', 'filter_templates', {
                event_category: 'Templates',
                event_label: category
            });
        }
    }

    // Update active tab
    function updateActiveTab(activeTab) {
        filterTabs.forEach(tab => {
            tab.classList.remove('active');
            tab.setAttribute('aria-selected', 'false');
        });
        activeTab.classList.add('active');
        activeTab.setAttribute('aria-selected', 'true');
    }

    // Click handlers
    filterTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const category = this.getAttribute('data-category');
            updateActiveTab(this);
            filterTemplates(category);
        });
    });

    // Keyboard navigation
    filterTabs.forEach((tab, index) => {
        tab.addEventListener('keydown', function(e) {
            let newIndex;

            if (e.key === 'ArrowRight') {
                e.preventDefault();
                newIndex = (index + 1) % filterTabs.length;
                filterTabs[newIndex].focus();
                filterTabs[newIndex].click();
            } else if (e.key === 'ArrowLeft') {
                e.preventDefault();
                newIndex = (index - 1 + filterTabs.length) % filterTabs.length;
                filterTabs[newIndex].focus();
                filterTabs[newIndex].click();
            } else if (e.key === 'Home') {
                e.preventDefault();
                filterTabs[0].focus();
                filterTabs[0].click();
            } else if (e.key === 'End') {
                e.preventDefault();
                filterTabs[filterTabs.length - 1].focus();
                filterTabs[filterTabs.length - 1].click();
            }
        });
    });

    // Add CSS animation
    const style = document.createElement('style');
    style.textContent = `
        @keyframes fadeInUp {
            from {
                opacity: 0;
                transform: translateY(30px);
            }
            to {
                opacity: 1;
                transform: translateY(0);
            }
        }

        .template-card.hidden {
            display: none;
        }

        .no-templates-message {
            display: none;
            justify-content: center;
            align-items: center;
            padding: 4rem 2rem;
            text-align: center;
        }

        .no-templates-content {
            max-width: 400px;
        }

        .no-templates-content svg {
            width: 64px;
            height: 64px;
            color: var(--color-text-muted);
            margin: 0 auto 1.5rem;
        }

        .no-templates-content h3 {
            font-size: 1.5rem;
            margin-bottom: 0.5rem;
        }

        .no-templates-content p {
            color: var(--color-text-secondary);
        }
    `;
    document.head.appendChild(style);

    console.log('✓ Template filter initialized');

})();
