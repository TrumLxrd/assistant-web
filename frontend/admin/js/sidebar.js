// Sidebar Category Toggle Functionality
document.addEventListener('DOMContentLoaded', function () {
    const categoryHeaders = document.querySelectorAll('.category-header');

    // Load saved category states from localStorage
    const savedStates = JSON.parse(localStorage.getItem('sidebarCategoryStates') || '{}');

    // Get current page to auto-expand its category
    const currentPage = window.location.pathname.split('/').pop();

    categoryHeaders.forEach((header, index) => {
        const categoryItems = header.nextElementSibling;
        const categoryName = header.querySelector('.category-title span').textContent;

        // Check if this category contains the active page
        const hasActivePage = categoryItems.querySelector('.nav-item.active') !== null;

        // Determine if category should be collapsed
        let isCollapsed = savedStates[categoryName] === false;

        // Always expand category with active page
        if (hasActivePage) {
            isCollapsed = false;
        }

        // Apply initial state
        if (isCollapsed) {
            header.classList.add('collapsed');
        }

        // Toggle on click
        header.addEventListener('click', function () {
            const isNowCollapsed = header.classList.toggle('collapsed');

            // Save state to localStorage
            savedStates[categoryName] = !isNowCollapsed;
            localStorage.setItem('sidebarCategoryStates', JSON.stringify(savedStates));
        });
    });
});
