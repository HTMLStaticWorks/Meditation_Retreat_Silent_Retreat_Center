document.addEventListener('DOMContentLoaded', function () {
    // Sidebar Toggle
    const sidebar = document.getElementById('sidebar');
    const sidebarToggle = document.getElementById('sidebar-toggle');
    const closeSidebar = document.getElementById('close-sidebar');
    
    if (sidebarToggle) {
        sidebarToggle.addEventListener('click', () => {
            sidebar.classList.toggle('active');
        });
    }
    
    if (closeSidebar) {
        closeSidebar.addEventListener('click', () => {
            sidebar.classList.remove('active');
        });
    }

    // Chart.js Initialization
    let engagementChartInstance = null;
    const initialIsLightTheme = localStorage.getItem('theme') === 'light';
    const initialEngagementTickColor = initialIsLightTheme ? '#5A5A5A' : '#8FAE9D';
    const initialEngagementGridColor = initialIsLightTheme ? 'rgba(42, 42, 42, 0.1)' : 'rgba(217, 217, 217, 0.05)';

    const engagementCtx = document.getElementById('engagementChart');
    if (engagementCtx) {
        engagementChartInstance = new Chart(engagementCtx, {
            type: 'line',
            data: {
                labels: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
                datasets: [{
                    label: 'Mindful Minutes',
                    data: [20, 45, 30, 60, 50, 90, 75],
                    borderColor: '#2F5D50',
                    backgroundColor: 'rgba(47, 93, 80, 0.1)',
                    fill: true,
                    tension: 0.4,
                    borderWidth: 3,
                    pointBackgroundColor: '#2F5D50',
                    pointBorderColor: '#101917',
                    pointBorderWidth: 2,
                    pointRadius: 5,
                    pointHoverRadius: 7
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: { display: false }
                },
                scales: {
                    y: {
                        grid: { color: initialEngagementGridColor },
                        ticks: { color: initialEngagementTickColor }
                    },
                    x: {
                        grid: { display: false },
                        ticks: { color: initialEngagementTickColor }
                    }
                }
            }
        });
    }

    const deviceCtx = document.getElementById('deviceChart');
    if (deviceCtx) {
        new Chart(deviceCtx, {
            type: 'doughnut',
            data: {
                labels: ['Meditation', 'Silent Reflection', 'Yoga & Movement'],
                datasets: [{
                    data: [50, 30, 20],
                    backgroundColor: ['#2F5D50', '#DCC7A1', '#8FAE9D'],
                    borderWidth: 0,
                    hoverOffset: 10
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '70%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: '#8FAE9D',
                            padding: 20,
                            font: { size: 12 }
                        }
                    }
                }
            }
        });
    }

    // Theme Toggle and Logo Swapping
    const themeToggle = document.getElementById('theme-toggle');
    const savedTheme = localStorage.getItem('theme');

    function updateLogoTheme(isLight) {
        document.querySelectorAll('img').forEach(img => {
            if (isLight && img.src.includes('logo.svg')) {
                img.src = img.src.replace('logo.svg', 'logo-dark.svg');
            } else if (!isLight && img.src.includes('logo-dark.svg')) {
                img.src = img.src.replace('logo-dark.svg', 'logo.svg');
            }
        });
    }

    if (savedTheme === 'light') {
        document.body.classList.add('light-theme');
        if (themeToggle) themeToggle.querySelector('i').classList.replace('bi-moon-stars', 'bi-sun');
        updateLogoTheme(true);
    } else {
        updateLogoTheme(false);
    }

    if (themeToggle) {
        themeToggle.addEventListener('click', () => {
            document.body.classList.toggle('light-theme');
            const isLight = document.body.classList.contains('light-theme');
            localStorage.setItem('theme', isLight ? 'light' : 'dark');
            updateLogoTheme(isLight);

            const icon = themeToggle.querySelector('i');
            if (isLight) {
                icon.classList.replace('bi-moon-stars', 'bi-sun');
            } else {
                icon.classList.replace('bi-sun', 'bi-moon-stars');
            }

            if (engagementChartInstance) {
                const tickColor = isLight ? '#5A5A5A' : '#8FAE9D';
                const gridColor = isLight ? 'rgba(42, 42, 42, 0.1)' : 'rgba(217, 217, 217, 0.05)';
                engagementChartInstance.options.scales.y.ticks.color = tickColor;
                engagementChartInstance.options.scales.x.ticks.color = tickColor;
                engagementChartInstance.options.scales.y.grid.color = gridColor;
                engagementChartInstance.update();
            }
        });
    }

    // RTL Toggle
    const rtlToggle = document.getElementById('rtl-toggle');
    const savedDir = localStorage.getItem('dir');

    if (savedDir === 'rtl') {
        document.documentElement.setAttribute('dir', 'rtl');
    }

    if (rtlToggle) {
        rtlToggle.addEventListener('click', () => {
            const currentDir = document.documentElement.getAttribute('dir');
            const newDir = currentDir === 'rtl' ? 'ltr' : 'rtl';
            document.documentElement.setAttribute('dir', newDir);
            localStorage.setItem('dir', newDir);
        });
    }

    // Back to Top
    let backToTopButton = document.getElementById('back-to-top');
    if (!backToTopButton) {
        backToTopButton = document.createElement('button');
        backToTopButton.type = 'button';
        backToTopButton.id = 'back-to-top';
        backToTopButton.className = 'back-to-top';
        backToTopButton.setAttribute('aria-label', 'Back to top');
        backToTopButton.innerHTML = '<i class="bi bi-arrow-up"></i>';
        document.body.appendChild(backToTopButton);
    }

    const toggleBackToTop = () => {
        if (window.scrollY > 280) {
            backToTopButton.classList.add('show');
        } else {
            backToTopButton.classList.remove('show');
        }
    };

    backToTopButton.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    window.addEventListener('scroll', toggleBackToTop, { passive: true });
    toggleBackToTop();

    // Scroll Animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('reveal');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);

    // Password Visibility Toggle
    document.querySelectorAll('.toggle-password').forEach(toggle => {
        toggle.addEventListener('click', function () {
            const input = this.parentElement.querySelector('input');
            const icon = this.querySelector('i');

            if (input.type === 'password') {
                input.type = 'text';
                icon.classList.replace('bi-eye', 'bi-eye-slash');
            } else {
                input.type = 'password';
                icon.classList.replace('bi-eye-slash', 'bi-eye');
            }
        });
    });

    // Section Switching Logic
    window.showSection = function (sectionId) {
        // Hide all sections
        document.querySelectorAll('.content-section').forEach(section => {
            section.classList.add('d-none');
        });

        // Show target section
        const targetSection = document.getElementById(sectionId + '-section');
        if (targetSection) {
            targetSection.classList.remove('d-none');
        }

        // Update sidebar active state
        document.querySelectorAll('.sidebar-link').forEach(link => {
            link.classList.remove('active');
        });

        // Handle case where link might not have been clicked directly (if called via code)
        const activeLink = document.querySelector(`.sidebar-link[onclick="showSection('${sectionId}')"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }

        // Dynamic title update disabled to keep static 'Dashboard' header

        // Close sidebar on mobile/tablet after selection
        if (window.innerWidth <= 1024 && sidebar.classList.contains('active')) {
            sidebar.classList.remove('active');
        }
    };

    // Navbar Menu Scroll Lock and Auto-close
    const navbarCollapse = document.getElementById('navbarNav');
    if (navbarCollapse) {
        navbarCollapse.addEventListener('show.bs.collapse', () => {
            document.body.style.overflow = 'hidden';
        });
        
        navbarCollapse.addEventListener('hidden.bs.collapse', () => {
            document.body.style.overflow = '';
        });

        const navLinks = navbarCollapse.querySelectorAll('.nav-link');
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                if (navbarCollapse.classList.contains('show')) {
                    document.body.style.overflow = '';
                    if (typeof bootstrap !== 'undefined') {
                        const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                        if (bsCollapse) {
                            bsCollapse.hide();
                        }
                    }
                }
            });
        });

        window.addEventListener('resize', () => {
            if (window.innerWidth >= 1200 && document.body.style.overflow === 'hidden') {
                document.body.style.overflow = '';
                if (typeof bootstrap !== 'undefined') {
                    const bsCollapse = bootstrap.Collapse.getInstance(navbarCollapse);
                    if (bsCollapse && navbarCollapse.classList.contains('show')) {
                        bsCollapse.hide();
                    }
                }
            }
        });
    }
});

// Helper for scroll reveal
document.addEventListener('DOMContentLoaded', () => {
    const revealObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('revealed');
            }
        });
    }, {
        threshold: 0.05,
        rootMargin: '0px 0px -30px 0px'
    });

    document.querySelectorAll('[data-reveal]').forEach(el => {
        revealObserver.observe(el);
    });

    // Backward compatibility for standard .reveal elements
    document.querySelectorAll('.reveal').forEach(el => {
        if (!el.hasAttribute('data-reveal')) {
            el.setAttribute('data-reveal', 'fade-up');
        }
        revealObserver.observe(el);
    });
});
