(function() {
    'use strict';

    // Класс для управления капчей
    class CaptchaManager {
        constructor(canvasId, refreshBtnId, inputId, formId) {
            this.canvas = document.getElementById(canvasId);
            this.refreshBtn = document.getElementById(refreshBtnId);
            this.input = document.getElementById(inputId);
            this.form = document.getElementById(formId);
            this.currentCode = '';

            if (!this.canvas || !this.refreshBtn || !this.input) {
                console.warn(`Captcha elements not found for ${canvasId}`);
                return;
            }

            this.ctx = this.canvas.getContext('2d');
            this.init();
        }

        // Генерация случайного кода (исключены похожие символы: I, O, 0, 1)
        generateCode() {
            const chars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
            let code = '';
            for (let i = 0; i < 6; i++) {
                code += chars.charAt(Math.floor(Math.random() * chars.length));
            }
            return code;
        }

        // Отрисовка капчи на canvas
        drawCaptcha() {
            const { canvas, ctx, currentCode } = this;

            // Очистка
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Фон с градиентом
            const gradient = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
            gradient.addColorStop(0, '#f0f0f0');
            gradient.addColorStop(1, '#e8e8e8');
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, canvas.width, canvas.height);

            // Линии помех
            for (let i = 0; i < 5; i++) {
                ctx.strokeStyle = `rgba(200, 200, 200, ${Math.random() * 0.5 + 0.3})`;
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
                ctx.shadowColor = 'rgba(0, 0, 0, 0.3)';
                ctx.shadowBlur = 2;
                ctx.shadowOffsetX = 2;
                ctx.shadowOffsetY = 2;

                // Случайный цвет для каждой буквы
                const colors = ['#333', '#555', '#444', '#222'];
                ctx.fillStyle = colors[Math.floor(Math.random() * colors.length)];

                ctx.translate(x, y);
                ctx.rotate(angle);
                ctx.fillText(currentCode[i], 0, 0);
                ctx.restore();
            }

            // Точки помех
            for (let i = 0; i < 80; i++) {
                ctx.fillStyle = `rgba(150, 150, 150, ${Math.random() * 0.5})`;
                const size = Math.random() * 2 + 1;
                ctx.fillRect(
                    Math.random() * canvas.width,
                    Math.random() * canvas.height,
                    size, size
                );
            }
        }

        // Обновление капчи
        refresh() {
            this.currentCode = this.generateCode();
            this.drawCaptcha();
            this.input.value = '';
        }

        // Проверка введенного кода
        validate(userInput) {
            return userInput.toUpperCase() === this.currentCode;
        }

        // Инициализация
        init() {
            // Генерируем первую капчу
            this.refresh();

            // КРИТИЧЕСКИ ВАЖНО: Обработчик с preventDefault для кнопки обновления
            this.refreshBtn.addEventListener('click', (e) => {
                e.preventDefault(); // Предотвращаем отправку формы
                e.stopPropagation(); // Останавливаем всплытие
                this.refresh();
                console.log('Капча обновлена');
                return false;
            });

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
                    const isValid = this.validate(this.input.value);

                    if (!isValid) {
                        e.preventDefault();
                        e.stopPropagation();

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
                });
            }
        }
    }

    // Инициализация при загрузке DOM
    document.addEventListener('DOMContentLoaded', function() {

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

        console.log('CaptchaManager инициализирован');
    });

})();