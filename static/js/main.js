// ============================================
// PREMIUM BANYANA JAVASCRIPT 2025
// Все анимации и интеракции
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

    // ========== MOBILE MENU ==========
    const mobileMenuBtn = document.getElementById('mobileMenuBtn');
    const mainNav = document.getElementById('mainNav');

    if (mobileMenuBtn && mainNav) {
        mobileMenuBtn.addEventListener('click', () => {
            mobileMenuBtn.classList.toggle('active');
            mainNav.classList.toggle('active');
            document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
        });

        // Close menu on link click
        mainNav.querySelectorAll('a').forEach(link => {
            link.addEventListener('click', () => {
                mobileMenuBtn.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.style.overflow = '';
            });
        });

        // Close menu on outside click
        document.addEventListener('click', (e) => {
            if (!mainNav.contains(e.target) && !mobileMenuBtn.contains(e.target) && mainNav.classList.contains('active')) {
                mobileMenuBtn.classList.remove('active');
                mainNav.classList.remove('active');
                document.body.style.overflow = '';
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
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, observerOptions);

    // Observe all animated elements
    document.querySelectorAll('.fade-in, .scale-in, .slide-in-left').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(30px)';
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
                img.style.opacity = '0';
                img.style.transition = 'opacity 0.6s ease';

                if (img.dataset.src) {
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                }

                img.addEventListener('load', () => {
                    img.style.opacity = '1';
                });

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
    backToTopBtn.innerHTML = `
        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5">
            <path d="M18 15l-6-6-6 6"/>
        </svg>
    `;
    backToTopBtn.style.cssText = `
        position: fixed;
        bottom: 2rem;
        right: 2rem;
        width: 56px;
        height: 56px;
        background: linear-gradient(135deg, #2E7D32, #FF6F00);
        border: none;
        border-radius: 50%;
        color: white;
        cursor: pointer;
        opacity: 0;
        visibility: hidden;
        transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1);
        box-shadow: 0 4px 20px rgba(46, 125, 50, 0.3);
        z-index: 999;
        display: flex;
        align-items: center;
        justify-content: center;
    `;
    document.body.appendChild(backToTopBtn);

    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 500) {
            backToTopBtn.style.opacity = '1';
            backToTopBtn.style.visibility = 'visible';
        } else {
            backToTopBtn.style.opacity = '0';
            backToTopBtn.style.visibility = 'hidden';
        }
    });

    backToTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    backToTopBtn.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.15) translateY(-4px)';
    });

    backToTopBtn.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1)';
    });

    // ========== CONSOLE MESSAGE ==========
    console.log('%c🏡 Гарант Групп - Бани под ключ', 'color: #2E7D32; font-size: 20px; font-weight: bold;');
    console.log('%cРазработано с ❤️ в 2025', 'color: #FF6F00; font-size: 14px;');

});
// Добавьте этот код в конец функции calculate()
// Он добавляет анимацию при обновлении цены

// В конце функции calculate():
const totalPriceElement = document.querySelector('.summary-total-price');
if (totalPriceElement) {
    // Убираем класс
    totalPriceElement.classList.remove('updated');

    // Триггер reflow для перезапуска анимации
    void totalPriceElement.offsetWidth;

    // Добавляем класс для анимации
    totalPriceElement.classList.add('updated');

    // Убираем класс после анимации
    setTimeout(() => {
        totalPriceElement.classList.remove('updated');
    }, 300);
}
document.addEventListener('DOMContentLoaded', function() {
    const openModalBtn = document.getElementById('openReviewModal');
    const closeModalBtn = document.getElementById('closeReviewModal');
    const modalOverlay = document.getElementById('reviewModalOverlay');
    const reviewForm = document.getElementById('reviewForm');

    if (openModalBtn && modalOverlay) {
        openModalBtn.addEventListener('click', () => {
            modalOverlay.style.display = 'flex';
        });
    }

    if (closeModalBtn && modalOverlay) {
        closeModalBtn.addEventListener('click', () => {
            modalOverlay.style.display = 'none';
        });
    }

    if (modalOverlay) {
        modalOverlay.addEventListener('click', (event) => {
            if (event.target === modalOverlay) {
                modalOverlay.style.display = 'none';
            }
        });
    }

   if (reviewForm) {
    reviewForm.addEventListener('submit', (event) => {
        event.preventDefault(); // Отменяем стандартную отправку формы

        // Скрываем модальное окно
        modalOverlay.style.display = 'none';
        reviewForm.reset(); // Очищаем поля формы

        // Показываем кастомное уведомление
        const notification = document.getElementById('successNotification');
        if (notification) {
            notification.style.display = 'flex';
            setTimeout(() => {
                notification.classList.add('show');
            }, 10); // Небольшая задержка для срабатывания анимации

            // Автоматически скрыть уведомление через 5 секунд
            setTimeout(() => {
                notification.classList.remove('show');
                setTimeout(() => {
                    notification.style.display = 'none';
                }, 500); // Даем время анимации затухания
            }, 5000);
        }
    });
}

// Добавляем обработчик для кнопки закрытия уведомления
const closeNotificationBtn = document.getElementById('closeNotification');
if (closeNotificationBtn) {
    closeNotificationBtn.addEventListener('click', () => {
        const notification = document.getElementById('successNotification');
        notification.classList.remove('show');
        setTimeout(() => {
            notification.style.display = 'none';
        }, 500);
    });
}

});
// ========== ЛОГИКА ДЛЯ МОДАЛЬНОГО ОКНА КРЕДИТА ==========
document.addEventListener('DOMContentLoaded', function() {
    const openCreditBtn = document.getElementById('openCreditModal');
    const closeCreditBtn = document.getElementById('closeCreditModal');
    const creditModalOverlay = document.getElementById('creditModalOverlay');
    const creditForm = document.getElementById('creditForm');
    const errorContainer = document.getElementById('credit-form-errors');

    if (openCreditBtn) {
        openCreditBtn.addEventListener('click', () => {
            creditModalOverlay.style.display = 'flex';
        });
    }

    const closeCreditModal = () => {
        creditModalOverlay.style.display = 'none';
        errorContainer.style.display = 'none';
        errorContainer.innerHTML = '';
    }

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
                    // Показываем уже готовое уведомление об успехе
                    const notification = document.getElementById('successNotification');
                    notification.querySelector('.notification-title').textContent = 'Заявка отправлена!';
                    notification.querySelector('.notification-message').textContent = 'Наш кредитный специалист скоро с вами свяжется.';
                    notification.style.display = 'flex';
                    setTimeout(() => notification.classList.add('show'), 10);
                    setTimeout(() => {
                        notification.classList.remove('show');
                        setTimeout(() => notification.style.display = 'none', 500);
                    }, 5000);
                } else {
                    // Показываем ошибки
                    const errors = JSON.parse(data.errors);
                    let errorHtml = '<ul>';
                    for (const field in errors) {
                        errors[field].forEach(error => {
                            errorHtml += `<li>${error.message}</li>`;
                        });
                    }
                    errorHtml += '</ul>';
                    errorContainer.innerHTML = errorHtml;
                    errorContainer.style.display = 'block';

                    // Обновляем капчу
                    const captchaImage = creditForm.querySelector('.captcha');
                    if(captchaImage) captchaImage.src = captchaImage.src + '?' + new Date().getTime();
                    creditForm.querySelector('input[name="captcha_1"]').value = '';
                }
            })
            .catch(error => {
                console.error('Error:', error);
                errorContainer.innerHTML = 'Произошла непредвиденная ошибка. Пожалуйста, попробуйте позже.';
                errorContainer.style.display = 'block';
            });
        });
    }
});

// ========== RIPPLE ANIMATION CSS ==========
const rippleStyles = document.createElement('style');
rippleStyles.textContent = `
    .ripple {
        position: absolute;
        border-radius: 50%;
        background: rgba(255, 255, 255, 0.5);
        pointer-events: none;
        transform: scale(0);
        animation: ripple-animation 0.6s ease-out;
    }

    @keyframes ripple-animation {
        to {
            transform: scale(2);
            opacity: 0;
        }
    }
`;
document.head.appendChild(rippleStyles);
