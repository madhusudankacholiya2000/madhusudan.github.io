(function () {
    'use strict';
    const navbar = document.getElementById('navbar');

    if (navbar) {
        const onScroll = () => {
            if (window.scrollY > 10) {
                navbar.classList.add('scrolled');
            } else {
                navbar.classList.remove('scrolled');
            }
        };
        
        window.addEventListener('scroll', onScroll, { passive: true });
        // Run once on load in case page is pre-scrolled
        onScroll();
    }

    /* --- Mobile hamburger toggle --- */
    function initNavbar() {
        const hamburger  = document.getElementById('hamburger');
        const mobileNav  = document.getElementById('mobileNav');

        if (hamburger && mobileNav) {
            hamburger.addEventListener('click', () => {
                const isOpen = mobileNav.classList.contains('open');

                if (isOpen) {
                    mobileNav.classList.remove('open');
                    hamburger.setAttribute('aria-expanded', 'false');
                    // Animate bars back to normal
                    hamburger.querySelectorAll('span')[0].style.transform = '';
                    hamburger.querySelectorAll('span')[1].style.opacity   = '';
                    hamburger.querySelectorAll('span')[2].style.transform = '';
                } else {
                    mobileNav.classList.add('open');
                    hamburger.setAttribute('aria-expanded', 'true');
                    // Animate into X
                    hamburger.querySelectorAll('span')[0].style.transform = 'translateY(6px) rotate(45deg)';
                    hamburger.querySelectorAll('span')[1].style.opacity   = '0';
                    hamburger.querySelectorAll('span')[2].style.transform = 'translateY(-6px) rotate(-45deg)';
                }
            });

            // Close on outside click
            document.addEventListener('click', (e) => {
                if (!hamburger.contains(e.target) && !mobileNav.contains(e.target)) {
                    mobileNav.classList.remove('open');
                    hamburger.setAttribute('aria-expanded', 'false');
                    hamburger.querySelectorAll('span')[0].style.transform = '';
                    hamburger.querySelectorAll('span')[1].style.opacity   = '';
                    hamburger.querySelectorAll('span')[2].style.transform = '';
                }
            });
        }
    }

    function setActiveClass(){
        document.querySelectorAll('.nav__link').forEach(link => {
            let linkPath = link.getAttribute('href').replace('.html', '');

            if (linkPath === '/' && currentPath === '/') {
                link.classList.add('active');
            } else if (linkPath !== '/' && currentPath.includes(linkPath)) {
                link.classList.add('active');
            }
        });
    }
    /* --- Fade-in on scroll (IntersectionObserver) --- */
    const fadeEls = document.querySelectorAll('.fade-in');

    if ('IntersectionObserver' in window && fadeEls.length) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    observer.unobserve(entry.target); // fire once
                }
            });
        },{
            threshold: 0.08,
            rootMargin: '0px 0px -40px 0px',
        });

        fadeEls.forEach((el) => observer.observe(el));
    } else {
        // Fallback: show all immediately
        fadeEls.forEach((el) => el.classList.add('visible'));
    }

    /* --- Lazy-load images (native + polyfill fallback) --- */
    const lazyImages = document.querySelectorAll('img[loading="lazy"]');

    if (!('loading' in HTMLImageElement.prototype) && 'IntersectionObserver' in window) {
        // Basic polyfill for browsers without native lazy loading
        const imgObserver = new IntersectionObserver((entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                    }
                    imgObserver.unobserve(img);
                }
            });
        });
        lazyImages.forEach((img) => imgObserver.observe(img));
    }

    fetch('header.html')
        .then(res => res.text())
        .then(data => {
            document.getElementById('navbar').innerHTML = data
            initNavbar();
            setActiveClass();
        });

    fetch('footer.html')
        .then(res => res.text())
        .then(data => document.getElementById('footer').innerHTML = data)

    const currentPath = window.location.pathname.replace('.html', '');



})();
