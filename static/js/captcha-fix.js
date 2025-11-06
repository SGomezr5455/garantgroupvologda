(function() {
    'use strict';

    console.log('🔧 CaptchaManager: Инициализация модуля...');

    // Класс для управления капчей
    class CaptchaManager {
        constructor(canvasId, refreshBtnId, inputId, formId) {
            console.log(`📋 CaptchaManager: Поиск элементов для ${canvasId}`);

            this.canvas = document.getElementById(canvasId);
            this.refreshBtn = document.getElementById(refreshBtnId);
            this.input = document.getElementById(inputId);
            this.form = document.getElementById(formId);
            this.currentCode = '';

            // Проверка наличия элементов
            if (!this.canvas) {
                console.warn(`⚠️ Canvas не найден: ${canvasId}`);
                return;
            }
            if (!this.refreshBtn) {
                console.warn(`⚠️ Кнопка обновления не найдена: ${refreshBtnId}`);
                return;
            }
            if (!this.input) {
                console.warn(`⚠️ Поле ввода не найдено: ${inputId}`);
                return;
            }

            console.log(`✅ Все элементы найдены для ${canvasId}`);

            this.ctx = this.canvas.getContext('2d');
            this.init();
        }

        // Генерация случайного кода (исключены похожие символы)
        generateCode() {
            const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
            let code = '';
            for (let i = 0; i < 6; i++) {
                code += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            console.log(`🔑 Новый код капчи сгенерирован: ${code}`);
            return code;
        }

        // Отрисовка капчи на canvas
        drawCaptcha() {
            const { canvas, ctx, currentCode } = this;

            // Очистка
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Фон с градиентом
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#2d3748');
            gradient.addColorStop(1, '#1a202c');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Линии помех
            for (let i = 0; i < 5; i++) {
                ctx.strokeStyle = `rgba(255, 107, 0, ${Math.random() * 0.3 + 0.1})`;
                ctx.lineWidth = Math.random() * 2 + 1;
                ctx.beginPath();
                ctx.moveTo(Math.random() * canvas.width, Math.random() * canvas.height);
                ctx.lineTo(Math.random() * canvas.width, Math.random() * canvas.height);
                ctx.stroke();
            }

            // Отрисовка букв с эффектами
            ctx.font = 'bold 32px Arial';
            ctx.textAlign = 'center';
            ctx.textBaseline = 'middle';

            const letterSpacing = canvas.width / (currentCode.length + 1);

            for (let i = 0; i < currentCode.length; i++) {
                ctx.save();

                const x = letterSpacing * (i + 1);
                const y = canvas.height / 2 + (Math.random() - 0.5) * 10;
                const angle = (Math.random() - 0.5) * 0.4;

                // Тень для букв
                ctx.shadowColor = 'rgba(255, 107, 0, 0.5)';
                ctx.shadowBlur = 3;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;

                // Цвет букв
                ctx.fillStyle = '#ffffff';

                ctx.translate(x, y);
                ctx.rotate(angle);
                ctx.fillText(currentCode[i], 0, 0);
                ctx.restore();
            }

            // Точки помех
            for (let i = 0; i < 80; i++) {
                ctx.fillStyle = `rgba(255, 107, 0, ${Math.random() * 0.3})`;
                const size = Math.random() * 2 + 1;
                ctx.fillRect(
                    Math.random() * canvas.width,
                    Math.random() * canvas.height,
                    size, size
                );
            }

            console.log('🎨 Капча отрисована');
        }

        // Обновление капчи
        refresh() {
            this.currentCode = this.generateCode();
            this.drawCaptcha();
            this.input.value = '';
            console.log('🔄 Капча обновлена');
        }

        // Проверка введенного кода
        validate(userInput) {
            const isValid = userInput.toUpperCase() === this.currentCode;
            console.log(`🔍 Проверка капчи: ${isValid ? '✅ Верно' : '❌ Неверно'}`);
            return isValid;
        }

        // Инициализация
        init() {
            console.log('🚀 Инициализация CaptchaManager');

            // Генерируем первую капчу
            this.refresh();

            // КРИТИЧЕСКИ ВАЖНО: Обработчик с preventDefault
            this.refreshBtn.addEventListener('click', (e) => {
                console.log('🖱️ Клик по кнопке обновления капчи');
                e.preventDefault();
                e.stopPropagation();
                this.refresh();
                return false;
            });

            console.log('✅ Обработчик кнопки обновления установлен');

            // Убираем сообщение об ошибке при вводе
            this.input.addEventListener('input', () => {
                this.input.classList.remove('error');
                const errorMsg = this.input.parentElement.querySelector('.error-message');
                if (errorMsg) {
                    errorMsg.style.display = 'none';
                }
            });

            // Валидация формы
            if (this.form) {
                this.form.addEventListener('submit', (e) => {
                    console.log('📤 Попытка отправки формы');
                    const isValid = this.validate(this.input.value);

                    if (!isValid) {
                        e.preventDefault();
                        e.stopPropagation();

                        console.log('❌ Капча неверна, форма не отправлена');

                        // Показываем ошибку
                        this.input.classList.add('error');
                        const errorMsg = this.input.parentElement.querySelector('.error-message');
                        if (errorMsg) {
                            errorMsg.style.display = 'block';
                            errorMsg.textContent = 'Неверный код капчи. Попробуйте еще раз.';
                        } else {
                            alert('Неверный код капчи. Попробуйте еще раз.');
                        }

                        // Обновляем капчу
                        this.refresh();

                        // Прокручиваем к капче
                        this.input.scrollIntoView({ behavior: 'smooth', block: 'center' });

                        return false;
                    }

                    console.log('✅ Капча верна, форма отправляется');
                });

                console.log('✅ Валидация формы установлена');
            }
        }
    }

    // Инициализация при загрузке DOM
    document.addEventListener('DOMContentLoaded', function() {
        console.log('📄 DOM загружен, запуск инициализации капчи');

        // Небольшая задержка для полной загрузки
        setTimeout(() => {
            console.log('⏰ Инициализация капчи через 100мс после загрузки DOM');

            // Капча для формы консультации на кредит (главная страница)
            const consultationCaptcha = new CaptchaManager(
                'captcha-canvas-1',
                'refresh-captcha-1',
                'captcha-input-1',
                'consultation-form'
            );

            // Капча для формы оформления заказа
            const orderCaptcha = new CaptchaManager(
                'captcha-canvas-2',
                'refresh-captcha-2',
                'captcha-input-2',
                'order-form'
            );

            console.log('✅ CaptchaManager инициализирован для всех форм');
        }, 100);
    });

    // Дополнительная проверка при полной загрузке страницы
    window.addEventListener('load', function() {
        console.log('🌐 Страница полностью загружена');

        // Проверяем наличие кнопок капчи
        const refreshButtons = document.querySelectorAll('[id^="refresh-captcha"]');
        console.log(`🔍 Найдено кнопок обновления капчи: ${refreshButtons.length}`);

        refreshButtons.forEach((btn, index) => {
            console.log(`  ${index + 1}. ID: ${btn.id}, type: ${btn.type || 'не указан'}`);
            if (!btn.type || btn.type === 'submit') {
                console.warn(`  ⚠️ ПРЕДУПРЕЖДЕНИЕ: У кнопки ${btn.id} нет type="button"!`);
            }
        });
    });

})();