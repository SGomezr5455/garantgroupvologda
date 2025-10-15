document.addEventListener("DOMContentLoaded", () => {

// Preloader
const preloader = document.querySelector('.preloader');
if (preloader) {
window.addEventListener('load', () => {
setTimeout(() => {
preloader.classList.add('loaded');
setTimeout(() => {
preloader.style.display = 'none';
}, 600);
}, 1000);
});
}

// Header scroll effect
const header = document.querySelector('.header');
let lastScrollY = window.scrollY;
window.addEventListener('scroll', () => {
// Header background on scroll
if (window.scrollY > 100) {
header.classList.add('scrolled');
} else {
header.classList.remove('scrolled');
}

// Header hide/show on scroll direction
if (window.scrollY > lastScrollY && window.scrollY > 200) {
header.style.transform = 'translateY(-100%)';
} else {
header.style.transform = 'translateY(0)';
}

lastScrollY = window.scrollY;
});

// Mobile menu functionality
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const mobileMenu = document.querySelector('.mobile-menu');
if (mobileMenuBtn && mobileMenu) {
mobileMenuBtn.addEventListener('click', () => {
mobileMenuBtn.classList.toggle('active');
mobileMenu.classList.toggle('active');
document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
});

// Close mobile menu when clicking on links
const mobileLinks = mobileMenu.querySelectorAll('.mobile-nav-link');
mobileLinks.forEach(link => {
link.addEventListener('click', () => {
mobileMenuBtn.classList.remove('active');
mobileMenu.classList.remove('active');
document.body.style.overflow = '';
});
});
}

// Back to top button
const backToTop = document.querySelector('.back-to-top');
window.addEventListener('scroll', () => {
if (window.scrollY > 500) {
backToTop.classList.add('visible');
} else {
backToTop.classList.remove('visible');
}
});

backToTop.addEventListener('click', (e) => {
e.preventDefault();
window.scrollTo({
top: 0,
behavior: 'smooth'
});
});

// Enhanced button hover effects
const buttons = document.querySelectorAll('.btn, .btn-secondary, .btn-outline');
buttons.forEach(btn => {
btn.addEventListener('mouseenter', function() {
this.style.transform = 'translateY(-3px)';
this.style.boxShadow = 'var(--shadow-hover)';
});
btn.addEventListener('mouseleave', function() {
this.style.transform = 'translateY(0)';
this.style.boxShadow = '';
});
});

// Form enhancements
const forms = document.querySelectorAll('form');
forms.forEach(form => {
const submitBtn = form.querySelector('button[type="submit"]');
if (submitBtn) {
form.addEventListener('submit', function() {
const originalText = submitBtn.innerHTML;
submitBtn.innerHTML = `
<i class="fas fa-spinner fa-spin"></i> Отправка...
`;
submitBtn.disabled = true;
});
}

// Add focus effects to form inputs
const inputs = form.querySelectorAll('input, textarea, select');
inputs.forEach(input => {
input.addEventListener('focus', function() {
this.parentElement.classList.add('focused');
});
input.addEventListener('blur', function() {
if (this.value === '') {
this.parentElement.classList.remove('focused');
}
});
});
});

// Image lazy loading with fade-in effect
const images = document.querySelectorAll('img');
const imageObserver = new IntersectionObserver((entries, observer) => {
entries.forEach(entry => {
if (entry.isIntersecting) {
const img = entry.target;
img.style.opacity = '0';
img.style.transition = 'opacity 0.6s ease';

// Ensure image is loaded
if (img.complete) {
img.style.opacity = '1';
} else {
img.addEventListener('load', () => {
img.style.opacity = '1';
});
}

observer.unobserve(img);
}
});
}, {
rootMargin: '50px 0px',
threshold: 0.1
});

images.forEach(img => {
imageObserver.observe(img);
});

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
anchor.addEventListener('click', function (e) {
e.preventDefault();
const target = document.querySelector(this.getAttribute('href'));
if (target) {
const headerHeight = header.offsetHeight;
const targetPosition = target.getBoundingClientRect().top + window.pageYOffset - headerHeight;
window.scrollTo({
top: targetPosition,
behavior: 'smooth'
});
}
});
});

// Add CSS for loading spinner
const style = document.createElement('style');
style.textContent = `
.loading-spinner {
display: flex;
align-items: center;
gap: 8px;
}

.fa-spin {
animation: spin 1s linear infinite;
}

@keyframes spin {
from { transform: rotate(0deg); }
to { transform: rotate(360deg); }
}

.form-group.focused .form-label {
transform: translateY(-25px) scale(0.85);
color: var(--primary);
}
`;
document.head.appendChild(style);

// Initialize animations on scroll
const animateOnScroll = () => {
const elements = document.querySelectorAll('.feature-card, .product-card, .work-card, .value-card');
elements.forEach(element => {
const elementTop = element.getBoundingClientRect().top;
const elementVisible = 150;
if (elementTop < window.innerHeight - elementVisible) {
element.style.opacity = "1";
element.style.transform = "translateY(0)";
}
});
};

// Set initial state for animated elements
const animatedElements = document.querySelectorAll('.feature-card, .product-card, .work-card, .value-card');
animatedElements.forEach(element => {
element.style.opacity = "0";
element.style.transform = "translateY(30px)";
element.style.transition = "opacity 0.6s ease, transform 0.6s ease";
});

window.addEventListener('scroll', animateOnScroll);
animateOnScroll(); // Initial check

});

// Product card interactions
function initProductInteractions() {
const productCards = document.querySelectorAll('.product-card');
productCards.forEach(card => {
card.addEventListener('mouseenter', function() {
const image = this.querySelector('.product-image');
if (image) {
image.style.transform = 'scale(1.05)';
}
});
card.addEventListener('mouseleave', function() {
const image = this.querySelector('.product-image');
if (image) {
image.style.transform = 'scale(1)';
}
});
});
}

// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
initProductInteractions();
});

// Performance optimization: Debounce scroll events
function debounce(func, wait) {
let timeout;
return function executedFunction(...args) {
const later = () => {
clearTimeout(timeout);
func(...args);
};
clearTimeout(timeout);
timeout = setTimeout(later, wait);
};
}

// Optimized scroll handler
const optimizedScrollHandler = debounce(() => {
// Scroll-based animations and effects
}, 10);

window.addEventListener('scroll', optimizedScrollHandler);
