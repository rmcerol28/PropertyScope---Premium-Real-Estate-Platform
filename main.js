// PropertyScope - Main JavaScript File
// Handles animations, interactions, and data visualization

class PropertyScopeApp {
    constructor() {
        this.properties = [];
        this.filteredProperties = [];
        this.currentFilters = {
            type: 'all',
            priceRange: 'all',
            location: ''
        };
        this.init();
    }

    init() {
        this.initializeAnimations();
        this.setupEventListeners();
        this.initializeChart();
        this.loadProperties();
        this.setupScrollReveal();
    }

    // Initialize entrance animations
    initializeAnimations() {
        // Hero section animations
        anime.timeline({
            easing: 'easeOutExpo',
            duration: 1000
        })
        .add({
            targets: '.reveal-element',
            opacity: [0, 1],
            translateY: [50, 0],
            delay: anime.stagger(200)
        });

        // Property cards stagger animation
        this.animatePropertyCards();
    }

    // Animate property cards on load
    animatePropertyCards() {
        const cards = document.querySelectorAll('.property-card');
        
        anime({
            targets: cards,
            opacity: [0, 1],
            translateY: [30, 0],
            scale: [0.9, 1],
            delay: anime.stagger(100, {start: 500}),
            duration: 800,
            easing: 'easeOutExpo'
        });
    }

    // Setup all event listeners
    setupEventListeners() {
        // Filter buttons
        document.querySelectorAll('.filter-button').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleFilterClick(e.target);
            });
        });

        // Property card hover effects
        document.querySelectorAll('.property-card').forEach(card => {
            card.addEventListener('mouseenter', this.handleCardHover);
            card.addEventListener('mouseleave', this.handleCardLeave);
        });

        // Search form
        const searchForm = document.querySelector('.search-input');
        if (searchForm) {
            searchForm.addEventListener('input', this.handleSearchInput);
        }

        // Navigation smooth scrolling
        document.querySelectorAll('a[href^="#"]').forEach(anchor => {
            anchor.addEventListener('click', this.handleSmoothScroll);
        });

        // Window scroll for reveal animations
        window.addEventListener('scroll', this.handleScrollReveal);
    }

    // Handle filter button clicks
    handleFilterClick(button) {
        // Remove active class from all buttons
        document.querySelectorAll('.filter-button').forEach(btn => {
            btn.classList.remove('active');
        });
        
        // Add active class to clicked button
        button.classList.add('active');
        
        // Animate button click
        anime({
            targets: button,
            scale: [1, 0.95, 1],
            duration: 200,
            easing: 'easeInOutQuad'
        });

        // Filter properties
        const filterType = button.textContent.trim().toLowerCase();
        this.filterProperties(filterType);
    }

    // Filter properties based on type
    filterProperties(type) {
        const propertiesGrid = document.getElementById('properties-grid');
        const cards = propertiesGrid.querySelectorAll('.property-card');
        
        // Animate out
        anime({
            targets: cards,
            opacity: 0,
            scale: 0.8,
            duration: 300,
            complete: () => {
                // Filter logic here
                cards.forEach(card => {
                    const cardType = card.querySelector('h3').textContent.toLowerCase();
                    const shouldShow = type === 'houses' && cardType.includes('house') ||
                                     type === 'apartments' && cardType.includes('apartment') ||
                                     type === 'condos' && cardType.includes('condo') ||
                                     type === 'townhouses' && cardType.includes('townhouse') ||
                                     type === 'waterfront' && cardType.includes('beach') ||
                                     type === 'mountain' && cardType.includes('mountain') ||
                                     type === 'houses'; // Default to houses if no match
                    
                    card.style.display = shouldShow ? 'block' : 'none';
                });

                // Animate in visible cards
                const visibleCards = Array.from(cards).filter(card => 
                    card.style.display !== 'none'
                );
                
                anime({
                    targets: visibleCards,
                    opacity: 1,
                    scale: 1,
                    delay: anime.stagger(100),
                    duration: 500,
                    easing: 'easeOutExpo'
                });
            }
        });
    }

    // Handle property card hover
    handleCardHover(e) {
        const card = e.currentTarget;
        
        anime({
            targets: card,
            translateY: -12,
            scale: 1.02,
            boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
            duration: 300,
            easing: 'easeOutExpo'
        });

        // Animate price badge
        const priceBadge = card.querySelector('.price-badge');
        if (priceBadge) {
            anime({
                targets: priceBadge,
                scale: [1, 1.1, 1],
                duration: 400,
                easing: 'easeInOutQuad'
            });
        }
    }

    // Handle property card leave
    handleCardLeave(e) {
        const card = e.currentTarget;
        
        anime({
            targets: card,
            translateY: 0,
            scale: 1,
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)',
            duration: 300,
            easing: 'easeOutExpo'
        });
    }

    // Handle search input
    handleSearchInput(e) {
        const query = e.target.value.toLowerCase();
        const propertiesGrid = document.getElementById('properties-grid');
        const cards = propertiesGrid.querySelectorAll('.property-card');
        
        cards.forEach(card => {
            const title = card.querySelector('h3').textContent.toLowerCase();
            const location = card.querySelector('.text-gray-600').textContent.toLowerCase();
            const shouldShow = title.includes(query) || location.includes(query);
            
            card.style.display = shouldShow ? 'block' : 'none';
            
            if (shouldShow) {
                anime({
                    targets: card,
                    opacity: [0, 1],
                    scale: [0.9, 1],
                    duration: 300,
                    easing: 'easeOutExpo'
                });
            }
        });
    }

    // Smooth scroll for navigation links
    handleSmoothScroll(e) {
        e.preventDefault();
        const targetId = e.target.getAttribute('href').substring(1);
        const targetElement = document.getElementById(targetId);
        
        if (targetElement) {
            anime({
                targets: document.documentElement,
                scrollTop: targetElement.offsetTop - 80,
                duration: 1000,
                easing: 'easeInOutQuad'
            });
        }
    }

    // Setup scroll reveal animations
    setupScrollReveal() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                }
            });
        }, observerOptions);

        document.querySelectorAll('.reveal-element').forEach(el => {
            observer.observe(el);
        });
    }

    // Handle scroll reveal
    handleScrollReveal() {
        const reveals = document.querySelectorAll('.reveal-element');
        
        reveals.forEach(element => {
            const elementTop = element.getBoundingClientRect().top;
            const elementVisible = 150;
            
            if (elementTop < window.innerHeight - elementVisible) {
                element.classList.add('revealed');
            }
        });
    }

    // Initialize market trend chart
    initializeChart() {
        const chartElement = document.getElementById('price-chart');
        if (!chartElement) return;

        const chart = echarts.init(chartElement);
        
        const option = {
            tooltip: {
                trigger: 'axis',
                backgroundColor: 'rgba(255, 255, 255, 0.95)',
                borderColor: '#8B7355',
                borderWidth: 1,
                textStyle: {
                    color: '#2C3E50'
                }
            },
            grid: {
                left: '3%',
                right: '4%',
                bottom: '3%',
                containLabel: true
            },
            xAxis: {
                type: 'category',
                boundaryGap: false,
                data: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                axisLine: {
                    lineStyle: {
                        color: '#E5E7EB'
                    }
                },
                axisLabel: {
                    color: '#6B7280'
                }
            },
            yAxis: {
                type: 'value',
                axisLine: {
                    lineStyle: {
                        color: '#E5E7EB'
                    }
                },
                axisLabel: {
                    color: '#6B7280',
                    formatter: '${value}K'
                },
                splitLine: {
                    lineStyle: {
                        color: '#F3F4F6'
                    }
                }
            },
            series: [
                {
                    name: 'Median Price',
                    type: 'line',
                    smooth: true,
                    symbol: 'circle',
                    symbolSize: 8,
                    lineStyle: {
                        color: '#8B7355',
                        width: 3
                    },
                    itemStyle: {
                        color: '#8B7355'
                    },
                    areaStyle: {
                        color: {
                            type: 'linear',
                            x: 0,
                            y: 0,
                            x2: 0,
                            y2: 1,
                            colorStops: [{
                                offset: 0, color: 'rgba(139, 115, 85, 0.3)'
                            }, {
                                offset: 1, color: 'rgba(139, 115, 85, 0.05)'
                            }]
                        }
                    },
                    data: [485, 492, 498, 510, 525, 538, 542, 548, 555, 562, 570, 575],
                    animationDuration: 2000,
                    animationEasing: 'cubicOut'
                }
            ]
        };

        chart.setOption(option);
        
        // Make chart responsive
        window.addEventListener('resize', () => {
            chart.resize();
        });
    }

    // Load properties data
    loadProperties() {
        // Mock property data - in a real app, this would come from an API
        this.properties = [
            {
                id: 1,
                title: 'Modern Luxury Estate',
                location: 'Beverly Hills, CA',
                price: 2450000,
                type: 'house',
                bedrooms: 5,
                bathrooms: 4,
                sqft: 4200,
                image: 'https://kimi-web-img.moonshot.cn/img/philkeandesigns.com/c60f15dfaf579b0310bb9b28f139b044353b63e1.jpg',
                description: 'Contemporary 5-bedroom home with stunning city views'
            },
            {
                id: 2,
                title: 'Urban Townhouse',
                location: 'Manhattan, NY',
                price: 1850000,
                type: 'townhouse',
                bedrooms: 3,
                bathrooms: 3,
                sqft: 2800,
                image: 'https://kimi-web-img.moonshot.cn/img/cdn.homedit.com/e72834163d81e2483a1f96fac20fc83f74790a58.jpg',
                description: 'Sophisticated 3-bedroom townhouse in prime location'
            },
            {
                id: 3,
                title: 'Beachfront Villa',
                location: 'Malibu, CA',
                price: 3200000,
                type: 'house',
                bedrooms: 4,
                bathrooms: 5,
                sqft: 3600,
                image: 'https://kimi-web-img.moonshot.cn/img/cloudfront.wheretostay.com/6179acbd53f13a245e5287588731c26664aee442.jpg',
                description: 'Stunning oceanfront property with private beach access'
            }
        ];

        this.filteredProperties = [...this.properties];
    }

    // Utility function to format price
    formatPrice(price) {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        }).format(price);
    }

    // Show loading state
    showLoading() {
        const loadingHTML = `
            <div class="fixed inset-0 bg-white/90 backdrop-blur-sm z-50 flex items-center justify-center">
                <div class="text-center">
                    <div class="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900 mx-auto mb-4"></div>
                    <p class="text-gray-600">Loading properties...</p>
                </div>
            </div>
        `;
        document.body.insertAdjacentHTML('beforeend', loadingHTML);
    }

    // Hide loading state
    hideLoading() {
        const loading = document.querySelector('.fixed.inset-0');
        if (loading) {
            loading.remove();
        }
    }
}

// Initialize app when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    const app = new PropertyScopeApp();
    
    // Add some additional interactive features
    
    // Heart icon toggle for favorites
    document.querySelectorAll('.property-card button').forEach(button => {
        if (button.querySelector('svg')) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const icon = button.querySelector('svg');
                const isFavorited = icon.classList.contains('text-red-500');
                
                if (isFavorited) {
                    icon.classList.remove('text-red-500');
                    icon.classList.add('text-gray-600');
                } else {
                    icon.classList.remove('text-gray-600');
                    icon.classList.add('text-red-500');
                }
                
                // Animate heart
                anime({
                    targets: icon,
                    scale: [1, 1.3, 1],
                    duration: 300,
                    easing: 'easeInOutQuad'
                });
            });
        }
    });

    // Add click handlers for "View Details" buttons
    document.querySelectorAll('.property-card button').forEach(button => {
        if (button.textContent.includes('View Details')) {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                // In a real app, this would navigate to the property details page
                window.location.href = 'property-details.html';
            });
        }
    });

    // Add parallax effect to hero section
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const hero = document.querySelector('.hero-gradient');
        if (hero) {
            hero.style.transform = `translateY(${scrolled * 0.5}px)`;
        }
    });

    // Add counter animation for statistics
    const animateCounters = () => {
        const counters = document.querySelectorAll('.stats-card .text-3xl');
        counters.forEach(counter => {
            const target = counter.textContent;
            const isNumber = !isNaN(parseFloat(target.replace(/[^0-9.]/g, '')));
            
            if (isNumber) {
                const finalValue = parseFloat(target.replace(/[^0-9.]/g, ''));
                let currentValue = 0;
                const increment = finalValue / 50;
                
                const timer = setInterval(() => {
                    currentValue += increment;
                    if (currentValue >= finalValue) {
                        currentValue = finalValue;
                        clearInterval(timer);
                    }
                    
                    if (target.includes('$')) {
                        counter.textContent = '$' + Math.floor(currentValue) + 'K';
                    } else if (target.includes('%')) {
                        counter.textContent = Math.floor(currentValue) + '%';
                    } else {
                        counter.textContent = Math.floor(currentValue);
                    }
                }, 50);
            }
        });
    };

    // Trigger counter animation when stats section is visible
    const statsSection = document.querySelector('.stats-card');
    if (statsSection) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(statsSection);
    }
});

// Export for use in other modules
window.PropertyScopeApp = PropertyScopeApp;