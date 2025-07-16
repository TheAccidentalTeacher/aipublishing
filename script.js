document.addEventListener('DOMContentLoaded', function() {
    // Initialize sidebar navigation
    initSidebar();
    
    // Initialize accordion functionality
    initAccordions();
    
    // Initialize tabs
    initTabs();
    
    // Initialize search functionality
    initSearch();
    
    // Initialize back to top button
    initBackToTop();
});

// Sidebar functionality
function initSidebar() {
    // Toggle mobile sidebar
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const sidebar = document.querySelector('.sidebar');
    
    if (sidebarToggle && sidebar) {
        sidebarToggle.addEventListener('click', function() {
            sidebar.classList.toggle('active');
        });
    }
    
    // Highlight current page in sidebar
    const currentPath = window.location.pathname;
    const sidebarLinks = document.querySelectorAll('.sidebar-nav a');
    
    sidebarLinks.forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
            
            // Expand parent sections if needed
            const parentSection = link.closest('.sidebar-subnav');
            if (parentSection) {
                const parentHeader = parentSection.previousElementSibling;
                if (parentHeader && parentHeader.classList.contains('sidebar-section-title')) {
                    parentHeader.classList.add('active');
                    parentSection.style.display = 'block';
                }
            }
        }
    });
    
    // Toggle sidebar subsections
    const sectionTitles = document.querySelectorAll('.sidebar-section-title');
    
    sectionTitles.forEach(title => {
        title.addEventListener('click', function() {
            const subnav = this.nextElementSibling;
            if (subnav && subnav.classList.contains('sidebar-subnav')) {
                this.classList.toggle('active');
                subnav.style.display = subnav.style.display === 'block' ? 'none' : 'block';
            }
        });
    });
}

// Accordion functionality
function initAccordions() {
    const accordionHeaders = document.querySelectorAll('.accordion-header');
    
    accordionHeaders.forEach(header => {
        header.addEventListener('click', function() {
            this.classList.toggle('active');
            
            // Close other accordions if needed
            if (this.dataset.exclusive === 'true') {
                const siblings = document.querySelectorAll('.accordion-header');
                siblings.forEach(sibling => {
                    if (sibling !== this) {
                        sibling.classList.remove('active');
                    }
                });
            }
        });
    });
}

// Tabs functionality
function initTabs() {
    const tabHeaders = document.querySelectorAll('.tab-header');
    
    tabHeaders.forEach(header => {
        header.addEventListener('click', function() {
            // Get the tab group
            const tabGroup = this.closest('.tabs');
            
            // Remove active class from all headers and contents in this group
            const groupHeaders = tabGroup.querySelectorAll('.tab-header');
            const groupContents = tabGroup.querySelectorAll('.tab-content');
            
            groupHeaders.forEach(h => h.classList.remove('active'));
            groupContents.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked header
            this.classList.add('active');
            
            // Get the target content and activate it
            const targetId = this.dataset.target;
            const targetContent = document.getElementById(targetId);
            if (targetContent) {
                targetContent.classList.add('active');
            }
        });
    });
}

// Search functionality
function initSearch() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    
    if (searchInput && searchResults) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            
            if (query.length < 2) {
                searchResults.innerHTML = '';
                searchResults.style.display = 'none';
                return;
            }
            
            // Get all searchable content
            const searchableElements = document.querySelectorAll('[data-searchable]');
            const results = [];
            
            searchableElements.forEach(element => {
                const text = element.textContent.toLowerCase();
                const title = element.getAttribute('data-title') || '';
                const url = element.getAttribute('data-url') || '#';
                
                if (text.includes(query)) {
                    results.push({
                        title: title,
                        url: url,
                        text: text
                    });
                }
            });
            
            // Display results
            if (results.length > 0) {
                searchResults.innerHTML = '';
                results.forEach(result => {
                    const resultItem = document.createElement('div');
                    resultItem.classList.add('search-result-item');
                    
                    const resultLink = document.createElement('a');
                    resultLink.href = result.url;
                    resultLink.textContent = result.title;
                    
                    resultItem.appendChild(resultLink);
                    searchResults.appendChild(resultItem);
                });
                
                searchResults.style.display = 'block';
            } else {
                searchResults.innerHTML = '<div class="search-no-results">No results found</div>';
                searchResults.style.display = 'block';
            }
        });
        
        // Close search results when clicking outside
        document.addEventListener('click', function(event) {
            if (!searchInput.contains(event.target) && !searchResults.contains(event.target)) {
                searchResults.style.display = 'none';
            }
        });
    }
}

// Back to top button
function initBackToTop() {
    const backToTopButton = document.querySelector('.back-to-top');
    
    if (backToTopButton) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        });
        
        backToTopButton.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
}

// Function to generate table of contents
function generateTOC(containerSelector, targetSelector) {
    const container = document.querySelector(containerSelector);
    const target = document.querySelector(targetSelector);
    
    if (!container || !target) return;
    
    const headings = container.querySelectorAll('h2, h3, h4');
    const toc = document.createElement('ul');
    toc.classList.add('toc-list');
    
    let currentLevel2Item = null;
    let currentLevel3Item = null;
    let currentLevel2List = null;
    let currentLevel3List = null;
    
    headings.forEach((heading, index) => {
        // Create an ID if the heading doesn't have one
        if (!heading.id) {
            heading.id = 'heading-' + index;
        }
        
        const link = document.createElement('a');
        link.textContent = heading.textContent;
        link.href = '#' + heading.id;
        
        const listItem = document.createElement('li');
        listItem.appendChild(link);
        
        if (heading.tagName === 'H2') {
            toc.appendChild(listItem);
            currentLevel2Item = listItem;
            
            // Create a new list for potential H3 children
            currentLevel2List = document.createElement('ul');
            currentLevel2Item.appendChild(currentLevel2List);
        } else if (heading.tagName === 'H3') {
            if (currentLevel2List) {
                currentLevel2List.appendChild(listItem);
                currentLevel3Item = listItem;
                
                // Create a new list for potential H4 children
                currentLevel3List = document.createElement('ul');
                currentLevel3Item.appendChild(currentLevel3List);
            } else {
                toc.appendChild(listItem);
            }
        } else if (heading.tagName === 'H4') {
            if (currentLevel3List) {
                currentLevel3List.appendChild(listItem);
            } else if (currentLevel2List) {
                currentLevel2List.appendChild(listItem);
            } else {
                toc.appendChild(listItem);
            }
        }
    });
    
    target.appendChild(toc);
}

// Function to create breadcrumbs
function updateBreadcrumbs() {
    const breadcrumbsContainer = document.querySelector('.breadcrumbs');
    if (!breadcrumbsContainer) return;
    
    // Get current page information
    const currentPage = document.querySelector('title').textContent;
    const pathParts = window.location.pathname.split('/').filter(part => part);
    
    // Create home link
    const homeLi = document.createElement('li');
    const homeLink = document.createElement('a');
    homeLink.href = '/';
    homeLink.textContent = 'Home';
    homeLi.appendChild(homeLink);
    breadcrumbsContainer.appendChild(homeLi);
    
    // Create intermediate links if needed
    if (pathParts.length > 1) {
        let currentPath = '';
        for (let i = 0; i < pathParts.length - 1; i++) {
            currentPath += '/' + pathParts[i];
            
            const li = document.createElement('li');
            const link = document.createElement('a');
            link.href = currentPath;
            
            // Convert path to readable name
            let name = pathParts[i].replace(/-/g, ' ');
            name = name.charAt(0).toUpperCase() + name.slice(1);
            
            link.textContent = name;
            li.appendChild(link);
            breadcrumbsContainer.appendChild(li);
        }
    }
    
    // Add current page (no link)
    const currentLi = document.createElement('li');
    currentLi.textContent = currentPage;
    breadcrumbsContainer.appendChild(currentLi);
}