// ============================================
// ГАРАНТ ГРУПП - ОБЪЕДИНЕННЫЙ JAVASCRIPT 2025
// Все стили перенесены в CSS, JS управляет только классами
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // ========== PRELOADER ==========
    const preloader = document.querySelector('.preloader');
    if (preloader) {
        window.addEventListener('load', () => {
            setTimeout(() => {
                preloader.classList.add('loaded');
                setTimeout(() => {
                    preloader.style.display = 'none';
                }, 600);
            }, 500);
        });
    }

    // ========== HEADER SCROLL EFFECTS ==========
    const header = document.querySelector('.header');
    if (header) {
        let lastScrollY = window.scrollY;
        let ticking = false;

        function updateHeaderOnScroll() {
            const currentScrollY = window.scrollY;

            // Add scrolled class
            if (currentScrollY > 50) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }

            // Hide/show header on scroll direction
            if (currentScrollY > lastScrollY && currentScrollY > 200) {
                header.style.transform = 'translateY(-100%)';
            } else {
                header.style.transform = 'translateY(0)';
            }

            lastScrollY = currentScrollY;
            ticking = false;
        }

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(updateHeaderOnScroll);
                ticking = true;
            }
        }, { passive: true });
    }

    // ========== MOBILE MENU ==========
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');

    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            mainNav.classList.toggle('active');
            document.body.classList.toggle('no-scroll', mainNav.classList.contains('active'));
        });

        // Close menu on link click
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.classList.remove('no-scroll');
            });
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!mainNav.contains(e.target) &&
                !mobileMenuBtn.contains(e.target) &&
                mainNav.classList.contains('active')) {
                mobileMenuBtn.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.classList.remove('no-scroll');
            }
        });
    }

    // ========== ACTIVE NAV LINK ==========
    const currentPath = window.location.pathname;
    document.querySelectorAll('.nav-link').forEach(link => {
        if (link.getAttribute('href') === currentPath) {
            link.classList.add('active');
        }
    });

    // ========== SCROLL ANIMATIONS ==========
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('animated');
            }
        });
    }, observerOptions);

    // Observe all animated elements
    document.querySelectorAll('.fade-in, .scale-in, .slide-in-left').forEach(el => {
        observer.observe(el);
    });

    // ========== SMOOTH SCROLL ==========
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            if (href !== '#') {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });

    // ========== IMAGE LAZY LOAD WITH ANIMATION ==========
    const imageObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const img = entry.target;
                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    img.addEventListener('load', () => {
                        img.classList.add('loaded');
                    });
                }
                imageObserver.unobserve(img);
            }
        });
    }, { rootMargin: '50px' });

    document.querySelectorAll('img[data-src]').forEach(img => {
        imageObserver.observe(img);
    });

    // ========== BUTTON RIPPLE EFFECT ==========
    document.querySelectorAll('.btn').forEach(button => {
        button.addEventListener('click', function(e) {
            const ripple = document.createElement('span');
            const rect = this.getBoundingClientRect();
            const size = Math.max(rect.width, rect.height);
            const x = e.clientX - rect.left - size / 2;
            const y = e.clientY - rect.top - size / 2;

            ripple.style.width = ripple.style.height = size + 'px';
            ripple.style.left = x + 'px';
            ripple.style.top = y + 'px';
            ripple.classList.add('ripple');

            this.appendChild(ripple);
            setTimeout(() => ripple.remove(), 600);
        });
    });

    // ========== PARALLAX EFFECT ON HERO ==========
    const heroShapes = document.querySelectorAll('.floating-shape');
    if (heroShapes.length > 0) {
        let parallaxTicking = false;

        window.addEventListener('scroll', () => {
            if (!parallaxTicking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;
                    heroShapes.forEach((shape, index) => {
                        const speed = 0.1 + (index * 0.05);
                        shape.style.transform = `translateY(${scrolled * speed}px)`;
                    });
                    parallaxTicking = false;
                });
                parallaxTicking = true;
            }
        }, { passive: true });
    }

    // ========== CARD TILT EFFECT ==========
    document.querySelectorAll('.card').forEach(card => {
        card.addEventListener('mousemove', function(e) {
            const rect = this.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const centerX = rect.width / 2;
            const centerY = rect.height / 2;
            const rotateX = (y - centerY) / 20;
            const rotateY = (centerX - x) / 20;

            this.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateY(-8px)`;
        });

        card.addEventListener('mouseleave', function() {
            this.style.transform = '';
        });
    });

    // ========== NUMBER COUNTER ANIMATION ==========
    const animateValue = (element, start, end, duration) => {
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            const value = Math.floor(progress * (end - start) + start);
            element.textContent = value.toLocaleString('ru-RU');
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    };

    const counterObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && !entry.target.classList.contains('counted')) {
                const target = parseInt(entry.target.dataset.count);
                animateValue(entry.target, 0, target, 2000);
                entry.target.classList.add('counted');
            }
        });
    }, { threshold: 0.5 });

    document.querySelectorAll('[data-count]').forEach(el => {
        counterObserver.observe(el);
    });

    // ========== BACK TO TOP BUTTON ==========
    const backToTopBtn = document.createElement('button');
    backToTopBtn.className = 'back-to-top';
    backToTopBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
        </svg>
    `;
    backToTopBtn.setAttribute('aria-label', 'Наверх');
    document.body.appendChild(backToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // ========== FAQ ACCORDION ==========
    document.querySelectorAll('.faq-question').forEach(question => {
        question.addEventListener('click', () => {
            const faqItem = question.closest('.faq-item');
            const isActive = faqItem.classList.contains('active');

            // Close all FAQ items
            document.querySelectorAll('.faq-item').forEach(item => {
                item.classList.remove('active');
            });

            // Open clicked item if it wasn't active
            if (!isActive) {
                faqItem.classList.add('active');
            }
        });
    });

    // ========== PRICE UPDATE ANIMATION ==========
    window.animatePriceUpdate = function(element) {
        if (element) {
            element.classList.remove('updated');
            void element.offsetWidth;
            element.classList.add('updated');
            setTimeout(() => {
                element.classList.remove('updated');
            }, 300);
        }
    };

    // ========== REVIEW MODAL ==========
    const openReviewModalBtn = document.getElementById('openReviewModal');
    const closeReviewModalBtn = document.getElementById('closeReviewModal');
    const reviewModalOverlay = document.getElementById('reviewModalOverlay');
    const reviewForm = document.getElementById('reviewForm');

    if (openReviewModalBtn && reviewModalOverlay) {
        openReviewModalBtn.addEventListener('click', () => {
            reviewModalOverlay.style.display = 'flex';
        });
    }

    if (closeReviewModalBtn && reviewModalOverlay) {
        closeReviewModalBtn.addEventListener('click', () => {
            reviewModalOverlay.style.display = 'none';
        });
    }

    if (reviewModalOverlay) {
        reviewModalOverlay.addEventListener('click', (event) => {
            if (event.target === reviewModalOverlay) {
                reviewModalOverlay.style.display = 'none';
            }
        });
    }

    if (reviewForm) {
        reviewForm.addEventListener('submit', (event) => {
            event.preventDefault();

            reviewModalOverlay.style.display = 'none';
            reviewForm.reset();

            const notification = document.getElementById('successNotification');
            if (notification) {
                notification.style.display = 'flex';
                setTimeout(() => {
                    notification.style.display = 'none';
                }, 5000);
            }
        });
    }

    // ========== CREDIT MODAL ==========
    const openCreditBtn = document.getElementById('openCreditModal');
    const closeCreditBtn = document.getElementById('closeCreditModal');
    const creditModalOverlay = document.getElementById('creditModalOverlay');
    const creditForm = document.getElementById('creditForm');
    const errorContainer = document.getElementById('credit-form-errors');

    if (openCreditBtn && creditModalOverlay) {
        openCreditBtn.addEventListener('click', () => {
            creditModalOverlay.style.display = 'flex';
        });
    }

    const closeCreditModal = () => {
        if (creditModalOverlay) {
            creditModalOverlay.style.display = 'none';
        }
        if (errorContainer) {
            errorContainer.style.display = 'none';
            errorContainer.innerHTML = '';
        }
    };

    if (closeCreditBtn) {
        closeCreditBtn.addEventListener('click', closeCreditModal);
    }

    if (creditModalOverlay) {
        creditModalOverlay.addEventListener('click', (e) => {
            if (e.target === creditModalOverlay) closeCreditModal();
        });
    }

    if (creditForm) {
        creditForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const formData = new FormData(this);

            fetch(this.action, {
                method: 'POST',
                body: formData,
                headers: {
                    'X-CSRFToken': formData.get('csrfmiddlewaretoken')
                }
            })
            .then(response => response.json())
            .then(data => {
                if (data.success) {
                    closeCreditModal();
                    const notification = document.getElementById('successNotification');
                    if (notification) {
                        notification.style.display = 'flex';
                        setTimeout(() => {
                            notification.style.display = 'none';
                        }, 5000);
                    }
                } else {
                    const errors = JSON.parse(data.errors);
                    let errorHtml = '<ul>';
                    for (let field in errors) {
                        errors[field].forEach(error => {
                            errorHtml += `<li>${error}</li>`;
                        });
                    }
                    errorHtml += '</ul>';
                    errorContainer.innerHTML = errorHtml;
                    errorContainer.style.display = 'block';
                }
            })
            .catch(error => {
                console.error('Ошибка:', error);
                errorContainer.innerHTML = '<ul><li>Произошла ошибка при отправке формы</li></ul>';
                errorContainer.style.display = 'block';
            });
        });
    }
// ============================================
// УЛУЧШЕННЫЙ JAVASCRIPT ДЛЯ ГАРАНТ ГРУПП
// Конвейер отзывов и анимации блоков
// ============================================

document.addEventListener('DOMContentLoaded', () => {

    // ========== TESTIMONIALS INFINITE CAROUSEL ==========
    function initTestimonialsCarousel() {
        const carousel = document.querySelector('.testimonial-carousel');
        if (!carousel) return;

        // Клонируем все карточки для бесконечной прокрутки
        const cards = carousel.querySelectorAll('.testimonial-card');
        if (cards.length === 0) return;

        // Дублируем карточки для seamless loop
        cards.forEach(card => {
            const clone = card.cloneNode(true);
            carousel.appendChild(clone);
        });

        // Пауза при наведении на любую карточку
        carousel.addEventListener('mouseenter', () => {
            carousel.style.animationPlayState = 'paused';
        });

        carousel.addEventListener('mouseleave', () => {
            carousel.style.animationPlayState = 'running';
        });
    }

    // ========== SMOOTH SCROLL REVEAL ANIMATIONS ==========
    function initScrollReveal() {
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -100px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach((entry, index) => {
                if (entry.isIntersecting) {
                    // Добавляем задержку для эффекта каскада
                    setTimeout(() => {
                        entry.target.classList.add('animated');
                    }, index * 100);
                }
            });
        }, observerOptions);

        // Наблюдаем за карточками
        document.querySelectorAll('.product-card, .advantage-card, .stage-item').forEach(el => {
            el.classList.add('fade-in');
            observer.observe(el);
        });
    }

    // ========== CARD TILT EFFECT (3D) ==========
    function initCardTilt() {
        document.querySelectorAll('.product-card, .advantage-card').forEach(card => {
            card.addEventListener('mousemove', function(e) {
                const rect = this.getBoundingClientRect();
                const x = e.clientX - rect.left;
                const y = e.clientY - rect.top;

                const centerX = rect.width / 2;
                const centerY = rect.height / 2;

                const rotateX = (y - centerY) / 15;
                const rotateY = (centerX - x) / 15;

                this.style.transform = `
                    perspective(1000px)
                    rotateX(${rotateX}deg)
                    rotateY(${rotateY}deg)
                    translateY(-12px)
                `;
            });

            card.addEventListener('mouseleave', function() {
                this.style.transform = '';
            });
        });
    }

    // ========== BUTTON RIPPLE EFFECT ==========
    function initButtonRipple() {
        document.querySelectorAll('.btn').forEach(button => {
            button.addEventListener('click', function(e) {
                const ripple = document.createElement('span');
                const rect = this.getBoundingClientRect();
                const size = Math.max(rect.width, rect.height);
                const x = e.clientX - rect.left - size / 2;
                const y = e.clientY - rect.top - size / 2;

                ripple.style.cssText = `
                    position: absolute;
                    width: ${size}px;
                    height: ${size}px;
                    left: ${x}px;
                    top: ${y}px;
                    border-radius: 50%;
                    background: rgba(255, 255, 255, 0.6);
                    transform: scale(0);
                    animation: ripple-animation 0.6s ease-out;
                    pointer-events: none;
                `;

                this.appendChild(ripple);
                setTimeout(() => ripple.remove(), 600);
            });
        });
    }

    // ========== PARALLAX ON SCROLL ==========
    function initParallax() {
        const parallaxElements = document.querySelectorAll('[data-parallax]');
        if (parallaxElements.length === 0) return;

        let ticking = false;

        window.addEventListener('scroll', () => {
            if (!ticking) {
                window.requestAnimationFrame(() => {
                    const scrolled = window.pageYOffset;

                    parallaxElements.forEach(el => {
                        const speed = el.dataset.parallax || 0.5;
                        el.style.transform = `translateY(${scrolled * speed}px)`;
                    });

                    ticking = false;
                });
                ticking = true;
            }
        }, { passive: true });
    }

    // ========== ИНИЦИАЛИЗАЦИЯ ВСЕХ ФУНКЦИЙ ==========
    initTestimonialsCarousel();
    initScrollReveal();
    initCardTilt();
    initButtonRipple();
    initParallax();

    console.log('%c🏡 Гарант Групп - Бани под ключ', 'color: #E07B39; font-size: 20px; font-weight: bold;');
    console.log('%c✨ Анимации загружены успешно!', 'color: #697565; font-size: 14px;');
});
// Ripple-эффект для CTA кнопки (добавьте в конец main.js)
document.addEventListener('DOMContentLoaded', () => {
    const ctaButton = document.querySelector('.cta-fixed-button');
    if (ctaButton) {
        ctaButton.addEventListener('click', (e) => {
            // Предотвращаем стандартное поведение только если нужно (здесь ссылка работает)
            createRipple(e, ctaButton);
        });
    }
});

function createRipple(event, button) {
    // Удаляем предыдущий ripple, если есть
    const ripple = button.getElementsByClassName('ripple')[0];
    if (ripple) {
        ripple.remove();
    }

    // Создаём новый круг
    const circle = document.createElement('span');
    const diameter = Math.max(button.clientWidth, button.clientHeight);
    const radius = diameter / 2;

    circle.style.width = circle.style.height = `${diameter}px`;
    circle.style.left = `${event.clientX - (button.offsetLeft + radius)}px`;
    circle.style.top = `${event.clientY - (button.offsetTop + radius)}px`;
    circle.classList.add('ripple');

    // Стили для ripple (добавьте в CSS ниже)
    const rippleStyle = `
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.6);
        transform: scale(0);
        animation: ripple-animation 0.6s linear;
        pointer-events: none;
    `;
    circle.style.cssText = rippleStyle;

    button.appendChild(circle);

    // Удаляем после анимации
    setTimeout(() => {
        if (circle.parentNode) {
            circle.remove();
        }
    }, 600);
}

    // ========== CONSOLE MESSAGE ==========
    console.log('%c🏡 Гарант Групп - Бани под ключ', 'color: #2E7D32; font-size: 20px; font-weight: bold;');
    console.log('%cРазработано с ❤️ в 2025', 'color: #FF6F00; font-size: 14px;');
});
