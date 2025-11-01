(function() {
    'use strict';

    // Класс для управления FAQ аккордеоном
    class FAQAccordion {
        constructor() {
            this.faqQuestions = document.querySelectorAll('.faq-question');
            this.init();
        }

        // Открыть конкретный вопрос
        openQuestion(questionElement) {
            const answer = questionElement.nextElementSibling;
            questionElement.classList.add('active');
            answer.classList.add('active');
            questionElement.setAttribute('aria-expanded', 'true');
        }

        // Закрыть конкретный вопрос
        closeQuestion(questionElement) {
            const answer = questionElement.nextElementSibling;
            questionElement.classList.remove('active');
            answer.classList.remove('active');
            questionElement.setAttribute('aria-expanded', 'false');
        }

        // Закрыть все вопросы
        closeAllQuestions() {
            this.faqQuestions.forEach(question => {
                this.closeQuestion(question);
            });
        }

        // Обработчик клика по вопросу
        handleQuestionClick(questionElement) {
            const isActive = questionElement.classList.contains('active');

            // Закрываем все вопросы
            this.closeAllQuestions();

            // Если вопрос не был активен, открываем его
            if (!isActive) {
                this.openQuestion(questionElement);

                // Плавная прокрутка к открытому вопросу
                setTimeout(() => {
                    questionElement.scrollIntoView({
                        behavior: 'smooth',
                        block: 'nearest'
                    });
                }, 300);
            }
        }

        // Обработка клавиатуры для доступности
        handleKeyboard(event, questionElement) {
            // Enter или Space - открыть/закрыть
            if (event.key === 'Enter' || event.key === ' ') {
                event.preventDefault();
                this.handleQuestionClick(questionElement);
            }

            // Arrow Down - следующий вопрос
            if (event.key === 'ArrowDown') {
                event.preventDefault();
                const nextQuestion = this.getNextQuestion(questionElement);
                if (nextQuestion) {
                    nextQuestion.focus();
                }
            }

            // Arrow Up - предыдущий вопрос
            if (event.key === 'ArrowUp') {
                event.preventDefault();
                const prevQuestion = this.getPreviousQuestion(questionElement);
                if (prevQuestion) {
                    prevQuestion.focus();
                }
            }

            // Home - первый вопрос
            if (event.key === 'Home') {
                event.preventDefault();
                if (this.faqQuestions.length > 0) {
                    this.faqQuestions[0].focus();
                }
            }

            // End - последний вопрос
            if (event.key === 'End') {
                event.preventDefault();
                if (this.faqQuestions.length > 0) {
                    this.faqQuestions[this.faqQuestions.length - 1].focus();
                }
            }
        }

        // Получить следующий вопрос
        getNextQuestion(currentQuestion) {
            const currentItem = currentQuestion.closest('.faq-item');
            const nextItem = currentItem.nextElementSibling;
            return nextItem ? nextItem.querySelector('.faq-question') : null;
        }

        // Получить предыдущий вопрос
        getPreviousQuestion(currentQuestion) {
            const currentItem = currentQuestion.closest('.faq-item');
            const prevItem = currentItem.previousElementSibling;
            return prevItem ? prevItem.querySelector('.faq-question') : null;
        }

        // Инициализация
        init() {
            if (this.faqQuestions.length === 0) {
                console.warn('FAQ questions not found');
                return;
            }

            console.log(`FAQ initialized with ${this.faqQuestions.length} questions`);

            this.faqQuestions.forEach((question, index) => {
                // Добавляем атрибуты для доступности
                question.setAttribute('role', 'button');
                question.setAttribute('aria-expanded', 'false');
                question.setAttribute('tabindex', '0');
                question.setAttribute('id', `faq-question-${index + 1}`);

                const answer = question.nextElementSibling;
                if (answer) {
                    answer.setAttribute('id', `faq-answer-${index + 1}`);
                    answer.setAttribute('role', 'region');
                    answer.setAttribute('aria-labelledby', `faq-question-${index + 1}`);
                }

                // Обработчик клика
                question.addEventListener('click', () => {
                    this.handleQuestionClick(question);
                });

                // Обработчик клавиатуры
                question.addEventListener('keydown', (e) => {
                    this.handleKeyboard(e, question);
                });
            });

            // Опционально: открыть первый вопрос по умолчанию
            // this.openQuestion(this.faqQuestions[0]);
        }

        // Метод для программного открытия вопроса по индексу
        openByIndex(index) {
            if (index >= 0 && index < this.faqQuestions.length) {
                this.handleQuestionClick(this.faqQuestions[index]);
            }
        }

        // Метод для поиска по тексту вопроса
        searchQuestion(searchText) {
            const searchLower = searchText.toLowerCase();
            let found = false;

            this.faqQuestions.forEach(question => {
                const questionText = question.textContent.toLowerCase();
                const answer = question.nextElementSibling;
                const answerText = answer ? answer.textContent.toLowerCase() : '';

                if (questionText.includes(searchLower) || answerText.includes(searchLower)) {
                    question.closest('.faq-item').style.display = 'block';
                    found = true;
                } else {
                    question.closest('.faq-item').style.display = 'none';
                }
            });

            return found;
        }

        // Сброс поиска
        resetSearch() {
            this.faqQuestions.forEach(question => {
                question.closest('.faq-item').style.display = 'block';
            });
        }

        // Открыть все вопросы
        openAll() {
            this.faqQuestions.forEach(question => {
                this.openQuestion(question);
            });
        }

        // Закрыть все вопросы
        closeAll() {
            this.closeAllQuestions();
        }
    }

    // Инициализация при загрузке DOM
    document.addEventListener('DOMContentLoaded', function() {
        const faqAccordion = new FAQAccordion();

        // Экспортируем для глобального доступа
        window.FAQAccordion = faqAccordion;

        // Опционально: добавляем поиск по FAQ
        const searchInput = document.getElementById('faq-search');
        if (searchInput) {
            let searchTimeout;
            searchInput.addEventListener('input', function(e) {
                clearTimeout(searchTimeout);
                searchTimeout = setTimeout(() => {
                    const searchText = e.target.value.trim();
                    if (searchText.length > 0) {
                        const found = faqAccordion.searchQuestion(searchText);
                        if (!found) {
                            console.log('Ничего не найдено по запросу:', searchText);
                        }
                    } else {
                        faqAccordion.resetSearch();
                    }
                }, 300);
            });
        }

        console.log('FAQ Accordion успешно инициализирован');
    });

})();