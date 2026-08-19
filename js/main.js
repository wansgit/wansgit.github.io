// Main JavaScript File

function escapeHtml(text) {
    var div = document.createElement('div');
    div.appendChild(document.createTextNode(text));
    return div.innerHTML;
}

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const nav = document.querySelector('.nav');
    
    if (mobileMenuBtn && nav) {
        mobileMenuBtn.addEventListener('click', function() {
            nav.classList.toggle('active');
        });
    }

    // Search Functionality
    const searchInput = document.getElementById('searchInput');
    const searchBtn = document.getElementById('searchBtn');
    
    if (searchInput && searchBtn) {
        searchBtn.addEventListener('click', function() {
            performSearch();
        });
        
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });
    }

    // FAQ Accordion
    const faqQuestions = document.querySelectorAll('.faq-question');
    faqQuestions.forEach(function(question) {
        question.addEventListener('click', function() {
            const faqItem = this.parentElement;
            const isActive = faqItem.classList.contains('active');
            
            document.querySelectorAll('.faq-item').forEach(function(item) {
                item.classList.remove('active');
            });
            
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });

    // Load Popular Extensions
    const popularContainer = document.getElementById('popularExtensions');
    if (popularContainer) {
        loadPopularExtensions(popularContainer);
    }

    // Load Extension Detail Page
    const extensionDetail = document.getElementById('extensionDetail');
    if (extensionDetail) {
        loadExtensionDetail(extensionDetail);
    }

    // Load Extensions List
    const extensionsList = document.getElementById('extensionsList');
    if (extensionsList) {
        loadExtensionsList(extensionsList);
    }

    // Load Category Page
    const categoryPage = document.getElementById('categoryPage');
    if (categoryPage) {
        loadCategoryPage(categoryPage);
    }

    // Filter Buttons
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(function(btn) {
        btn.addEventListener('click', function() {
            filterBtns.forEach(function(b) {
                b.classList.remove('active');
            });
            this.classList.add('active');
            filterExtensions(this.dataset.category);
        });
    });

    // Contact Form
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            alert('Thank you! Your message has been sent.');
            this.reset();
        });
    }
});

// Search Function
function performSearch() {
    const searchInput = document.getElementById('searchInput');
    const query = searchInput.value.trim().toLowerCase();
    
    if (query) {
        window.location.href = 'pages/extensions.html?search=' + encodeURIComponent(query);
    }
}

// Get relative path based on current page
function getBasePath() {
    const path = window.location.pathname;
    if (path.includes('/pages/')) {
        return '../';
    }
    return '';
}

// Load Popular Extensions
function loadPopularExtensions(container) {
    const popular = fileExtensions
        .filter(function(e) { return e.popular; })
        .sort(function(a, b) { return (b.popularity || 0) - (a.popularity || 0); })
        .slice(0, 8);
    
    if (popular.length === 0) {
        popular = fileExtensions.slice(0, 8);
    }
    
    container.innerHTML = popular.map(function(ext) {
        return createExtensionCard(ext, true);
    }).join('');
}

// Create Extension Card HTML
function createExtensionCard(ext, fromRoot) {
    const basePath = fromRoot ? 'pages/' : '';
    const link = basePath + 'extension.html?ext=' + encodeURIComponent(ext.extension);
    
    return '<a href="' + link + '" class="ext-card">' +
        '<div class="ext-card-header">' +
            '<span class="ext-badge">' + ext.extension + '</span>' +
            '<span class="ext-category-tag">' + ext.categoryName + '</span>' +
        '</div>' +
        '<h3>' + ext.name + '</h3>' +
        '<p>' + escapeHtml(ext.description) + '</p>' +
        '<div class="ext-card-footer">' +
            '<span><i class="fas fa-folder"></i> ' + ext.categoryName + '</span>' +
            '<span><i class="fas fa-fire"></i> Popular</span>' +
        '</div>' +
    '</a>';
}

// Load Extension Detail
function loadExtensionDetail(container) {
    const urlParams = new URLSearchParams(window.location.search);
    const extParam = urlParams.get('ext');
    
    if (!extParam) {
        container.innerHTML = '<div style="padding: 100px 0; text-align: center;"><p style="color: var(--text-muted);">File extension not found.</p></div>';
        return;
    }
    
    const ext = fileExtensions.find(function(e) {
        return e.extension === extParam;
    });
    
    if (!ext) {
        container.innerHTML = '<div style="padding: 100px 0; text-align: center;"><p style="color: var(--text-muted);">File extension "' + extParam + '" was not found in our database.</p></div>';
        return;
    }
    
    document.title = ext.name + ' (' + ext.extension + ') - FileExt';

    // Dynamic SEO meta tags
    const extUrl = 'https://fileext.id/pages/extension.html?ext=' + encodeURIComponent(ext.extension);
    const metaDesc = ext.description + ' Full details: supporting programs, how to open, and alternative formats.';
    document.querySelector('meta[name="description"]').setAttribute('content', metaDesc);

    const ogTitle = document.getElementById('ogTitle');
    const ogDesc = document.getElementById('ogDescription');
    const ogUrl = document.getElementById('ogUrl');
    const twTitle = document.getElementById('twitterTitle');
    const twDesc = document.getElementById('twitterDescription');
    const canonical = document.getElementById('canonicalLink');

    if (ogTitle) ogTitle.setAttribute('content', ext.name + ' (' + ext.extension + ') - FileExt');
    if (ogDesc) ogDesc.setAttribute('content', metaDesc);
    if (ogUrl) ogUrl.setAttribute('content', extUrl);
    if (twTitle) twTitle.setAttribute('content', ext.name + ' (' + ext.extension + ') - FileExt');
    if (twDesc) twDesc.setAttribute('content', metaDesc);
    if (canonical) canonical.setAttribute('href', extUrl);

    // Dynamic JSON-LD
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "WebPage",
        "name": ext.name + ' (' + ext.extension + ')',
        "description": metaDesc,
        "url": extUrl,
        "isPartOf": {
            "@type": "WebSite",
            "name": "FileExt",
            "url": "https://fileext.id"
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://fileext.id" },
                { "@type": "ListItem", "position": 2, "name": ext.categoryName, "item": "https://fileext.id/pages/category.html?cat=" + ext.category },
                { "@type": "ListItem", "position": 3, "name": ext.extension, "item": extUrl }
            ]
        }
    };
    const jsonLdScript = document.getElementById('pageJsonLd');
    if (jsonLdScript) jsonLdScript.textContent = JSON.stringify(jsonLd);
    
    // Build programs list from free/paid software arrays
    var programsList = [];
    var freeSw = ext.freeSoftware || [];
    var paidSw = ext.paidSoftware || [];
    freeSw.forEach(function(name) { programsList.push({ name: name, free: true }); });
    paidSw.forEach(function(name) { programsList.push({ name: name, free: false }); });

    var programsHtml = programsList.map(function(p) {
        return '<li style="padding: 14px 0; border-bottom: 1px solid var(--border); display: flex; align-items: center; justify-content: space-between;">' +
            '<span><strong>' + p.name + '</strong></span>' +
            (p.free ? ' <span class="badge-free">Free</span>' : ' <span class="badge-paid">Paid</span>') +
        '</li>';
    }).join('');
    
    var compatFormats = ext.compatibleFormats || ext.alternatives || [];
    var alternativesHtml = compatFormats.map(function(alt) {
        return '<a href="extension.html?ext=' + encodeURIComponent(alt) + '" class="alternative-item">' + alt + '</a>';
    }).join('');
    
    const mimeHtml = ext.mimeTypes.map(function(mime) {
        return '<li><i class="fas fa-code"></i> ' + mime + '</li>';
    }).join('');
    
    container.innerHTML = 
        '<div class="page-header">' +
            '<div class="container">' +
                '<div class="breadcrumb">' +
                    '<a href="../index.html">Home</a>' +
                    '<i class="fas fa-chevron-right"></i>' +
                    '<a href="category.html?cat=' + ext.category + '">' + ext.categoryName + '</a>' +
                    '<i class="fas fa-chevron-right"></i>' +
                    '<span>' + ext.extension + '</span>' +
                '</div>' +
                '<h1>' + ext.extension + ' - ' + ext.name + '</h1>' +
                '<p>' + escapeHtml(ext.description) + '</p>' +
            '</div>' +
        '</div>' +
        '<div class="detail-section">' +
            '<div class="container">' +
                '<div class="detail-grid">' +
                    '<div class="detail-main">' +
                        '<h2>About ' + ext.extension + '</h2>' +
                        '<p>' + escapeHtml(Array.isArray(ext.details) ? ext.details.join(' ') : ext.details) + '</p>' +
                        '<h2>Supported Software</h2>' +
                        '<ul style="list-style: none; padding: 0;">' + programsHtml + '</ul>' +
                        '<h2 style="margin-top: 32px;">Alternative Formats</h2>' +
                        '<div class="alternatives-list">' + alternativesHtml + '</div>' +
                    '</div>' +
                    '<div class="detail-sidebar">' +
                        '<div class="sidebar-card">' +
                            '<h3>Information</h3>' +
                            '<ul>' +
                                '<li><i class="fas fa-calendar"></i> Developed: ' + ext.developed + '</li>' +
                                '<li><i class="fas fa-building"></i> Developer: ' + (ext.developer || ext.developedBy || '-') + '</li>' +
                                '<li><i class="fas fa-folder"></i> Category: ' + ext.categoryName + '</li>' +
                                '<li><i class="fas fa-file"></i> Extension: ' + ext.extension + '</li>' +
                            '</ul>' +
                        '</div>' +
                        '<div class="sidebar-card">' +
                            '<h3>MIME Types</h3>' +
                            '<ul>' + mimeHtml + '</ul>' +
                        '</div>' +
                        '<div class="sidebar-card">' +
                            '<h3>Related Category</h3>' +
                            '<a href="category.html?cat=' + ext.category + '" class="category-link">' +
                                '<i class="' + categories[ext.category].icon + '"></i> ' +
                                ext.categoryName +
                            '</a>' +
                        '</div>' +
                    '</div>' +
                '</div>' +
            '</div>' +
        '</div>';
}

// Load Extensions List
function loadExtensionsList(container) {
    const urlParams = new URLSearchParams(window.location.search);
    const searchQuery = urlParams.get('search');
    const categoryFilter = urlParams.get('cat');
    
    let filteredExtensions = fileExtensions;
    
    if (searchQuery) {
        filteredExtensions = fileExtensions.filter(function(ext) {
            return ext.extension.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   ext.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                   ext.description.toLowerCase().includes(searchQuery.toLowerCase());
        });
        
        const searchResults = document.getElementById('searchResults');
        if (searchResults) {
            searchResults.textContent = 'Search results for "' + searchQuery + '" (' + filteredExtensions.length + ' found)';
        }
    }
    
    if (categoryFilter) {
        filteredExtensions = fileExtensions.filter(function(ext) {
            return ext.category === categoryFilter;
        });
    }
    
    container.innerHTML = filteredExtensions.map(function(ext) {
        return createExtensionCard(ext, false);
    }).join('');
    
    if (filteredExtensions.length === 0) {
        container.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 60px 0; color: var(--text-muted);"><i class="fas fa-search" style="font-size: 3rem; margin-bottom: 16px; display: block;"></i>No file extensions found.</div>';
    }
}

// Filter Extensions
function filterExtensions(category) {
    const container = document.getElementById('extensionsList');
    if (!container) return;
    
    let filteredExtensions = fileExtensions;
    
    if (category && category !== 'all') {
        filteredExtensions = fileExtensions.filter(function(ext) {
            return ext.category === category;
        });
    }
    
    container.innerHTML = filteredExtensions.map(function(ext) {
        return createExtensionCard(ext, false);
    }).join('');
}

// Load Category Page
function loadCategoryPage(container) {
    const urlParams = new URLSearchParams(window.location.search);
    const catParam = urlParams.get('cat');
    
    if (!catParam || !categories[catParam]) {
        container.innerHTML = '<div style="padding: 100px 0; text-align: center;"><p style="color: var(--text-muted);">Category not found.</p></div>';
        return;
    }
    
    const category = categories[catParam];
    const categoryExtensions = fileExtensions.filter(function(ext) {
        return ext.category === catParam;
    });
    
    document.title = category.name + ' - FileExt';

    // Dynamic SEO meta tags
    const catUrl = 'https://fileext.id/pages/category.html?cat=' + catParam;
    const catDesc = category.description + ' (' + categoryExtensions.length + ' extensions). Find complete information about ' + category.name.toLowerCase() + ' file formats.';
    document.querySelector('meta[name="description"]').setAttribute('content', catDesc);

    const ogTitle = document.getElementById('ogTitle');
    const ogDesc = document.getElementById('ogDescription');
    const ogUrl = document.getElementById('ogUrl');
    const twTitle = document.getElementById('twitterTitle');
    const twDesc = document.getElementById('twitterDescription');
    const canonical = document.getElementById('canonicalLink');

    if (ogTitle) ogTitle.setAttribute('content', category.name + ' - FileExt');
    if (ogDesc) ogDesc.setAttribute('content', catDesc);
    if (ogUrl) ogUrl.setAttribute('content', catUrl);
    if (twTitle) twTitle.setAttribute('content', category.name + ' - FileExt');
    if (twDesc) twDesc.setAttribute('content', catDesc);
    if (canonical) canonical.setAttribute('href', catUrl);

    // Dynamic JSON-LD
    const jsonLd = {
        "@context": "https://schema.org",
        "@type": "CollectionPage",
        "name": category.name + ' - FileExt',
        "description": catDesc,
        "url": catUrl,
        "isPartOf": {
            "@type": "WebSite",
            "name": "FileExt",
            "url": "https://fileext.id"
        },
        "breadcrumb": {
            "@type": "BreadcrumbList",
            "itemListElement": [
                { "@type": "ListItem", "position": 1, "name": "Home", "item": "https://fileext.id" },
                { "@type": "ListItem", "position": 2, "name": "Categories", "item": "https://fileext.id/pages/categories.html" },
                { "@type": "ListItem", "position": 3, "name": category.name, "item": catUrl }
            ]
        }
    };
    const jsonLdScript = document.getElementById('pageJsonLd');
    if (jsonLdScript) jsonLdScript.textContent = JSON.stringify(jsonLd);
    
    const extensionsHtml = categoryExtensions.map(function(ext) {
        return createExtensionCard(ext, false);
    }).join('');
    
    container.innerHTML = 
        '<div class="category-header">' +
            '<div class="container">' +
                '<div class="breadcrumb">' +
                    '<a href="../index.html">Home</a>' +
                    '<i class="fas fa-chevron-right"></i>' +
                    '<a href="categories.html">Categories</a>' +
                    '<i class="fas fa-chevron-right"></i>' +
                    '<span>' + category.name + '</span>' +
                '</div>' +
                '<div class="category-icon-large">' +
                    '<i class="' + category.icon + '"></i>' +
                '</div>' +
                '<h1>' + category.name + '</h1>' +
                '<p>' + category.description + ' (' + categoryExtensions.length + ' extensions)</p>' +
            '</div>' +
        '</div>' +
        '<div class="extensions-page">' +
            '<div class="container">' +
                '<div class="extensions-grid">' + extensionsHtml + '</div>' +
            '</div>' +
        '</div>';
}
