document.addEventListener('DOMContentLoaded', function() {
    const menuItems = document.querySelectorAll('.menu-item');
    const sections = document.querySelectorAll('.doc-section');

    const menuToggle = document.getElementById('menuToggle');
    const sidebar = document.querySelector('.sidebar');

    if (menuToggle) {
      menuToggle.addEventListener('click', function() {
        sidebar.classList.toggle('active');
        document.body.classList.toggle('menu-open');
      });

      // Close menu when clicking on menu items on mobile
      const menuItems = document.querySelectorAll('.menu-item');
      menuItems.forEach(item => {
        item.addEventListener('click', function() {
          if (window.innerWidth <= 768) {
            sidebar.classList.remove('active');
            document.body.classList.remove('menu-open');
          }
        });
      });
    }

    // Function to load and render markdown
    async function loadMarkdown(url, sectionId) {
        const sectionElement = document.getElementById(sectionId);

        try {
            const response = await fetch(url);
            if (!response.ok) {
                throw new Error(`Failed to load ${url}: ${response.status} ${response.statusText}`);
            }
            const markdown = await response.text();
            sectionElement.innerHTML = marked.parse(markdown);
        } catch (error) {
            console.error(error);
            sectionElement.innerHTML = `<div class="error">Failed to load content: ${error.message}</div>`;
        }
    }

    // Load all content at once
    async function loadAllContent() {
        const loadPromises = [];

        menuItems.forEach(item => {
            const mdFile = item.getAttribute('data-md');
            const targetId = item.getAttribute('href').substring(1); // Remove # from href
            loadPromises.push(loadMarkdown(mdFile, targetId));
        });

        await Promise.all(loadPromises);

        // After loading, set up intersection observer for section tracking
        setupIntersectionObserver();
    }

    // Set up observation of which section is currently in view
    function setupIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    // Find the menu item for this section
                    const sectionId = entry.target.id;
                    updateActiveMenuItem(`#${sectionId}`);

                    // Update URL hash without scrolling
                    history.replaceState(null, null, `#${sectionId}`);
                }
            });
        }, { threshold: 0.2 }); // 20% of the section is visible

        // Observe all sections
        sections.forEach(section => {
            observer.observe(section);
        });
    }

    // Update active menu item
    function updateActiveMenuItem(hash) {
        menuItems.forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('href') === hash) {
                item.classList.add('active');
            }
        });
    }

    // Add click handlers to menu items for smooth scrolling
    menuItems.forEach(item => {
        item.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            targetElement.scrollIntoView({
                behavior: 'smooth'
            });

            updateActiveMenuItem(targetId);
        });
    });

    // Handle initial load with hash
    function handleInitialLoad() {
        const hash = window.location.hash || '#section1';

        // Load all content first
        loadAllContent().then(() => {
            // Then scroll to the correct section
            const targetElement = document.querySelector(hash);
            if (targetElement) {
                setTimeout(() => {
                    targetElement.scrollIntoView();
                    updateActiveMenuItem(hash);
                }, 100);
            }
        });
    }

    // Initial load
    handleInitialLoad();
});