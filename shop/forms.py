# shop/forms.py
from django import forms
from django.core.validators import RegexValidator
from captcha.fields import CaptchaField


class OrderForm(forms.Form):
    """Форма заказа с улучшенной валидацией"""

    fio = forms.CharField(
        max_length=200,
        label="ФИО *",
        widget=forms.TextInput(attrs={
            'placeholder': 'Введите ваше полное имя',
            'class': 'form-control',
            'autocomplete': 'name'
        }),
        error_messages={
            'required': 'Пожалуйста, укажите ваше имя',
            'max_length': 'Имя не может быть длиннее 200 символов'
        }
    )

    phone_validator = RegexValidator(
        regex=r'^\+?[78][\d\s\(\)\-]{9,15}$',
        message='Введите корректный номер телефона (например: +7 999 123-45-67 или 8 (999) 123-45-67)'
    )

    phone = forms.CharField(
        max_length=20,
        label="Телефон *",
        validators=[phone_validator],
        widget=forms.TextInput(attrs={
            'placeholder': '+7 (999) 123-45-67',
            'class': 'form-control',
            'type': 'tel',
            'autocomplete': 'tel'
        }),
        error_messages={
            'required': 'Пожалуйста, укажите номер телефона'
        }
    )

    email = forms.EmailField(
        label="Email *",
        widget=forms.EmailInput(attrs={
            'placeholder': 'example@mail.ru',
            'class': 'form-control',
            'autocomplete': 'email'
        }),
        error_messages={
            'required': 'Пожалуйста, укажите email',
            'invalid': 'Введите корректный email адрес'
        }
    )

    message = forms.CharField(
        widget=forms.Textarea(attrs={
            'placeholder': 'Здесь вы можете добавить дополнительные пожелания или вопросы...',
            'class': 'form-control',
            'rows': 4,
            'maxlength': 1000
        }),
        label="Дополнительный комментарий",
        required=False,
        max_length=1000
    )

    captcha = CaptchaField(
        error_messages={
            'invalid': 'Неверный ответ. Попробуйте еще раз.',
            'required': 'Пожалуйста, решите пример'
        }
    )

    def clean_fio(self):
        """Дополнительная проверка ФИО"""
        fio = self.cleaned_data.get('fio', '').strip()
        if len(fio) < 3:
            raise forms.ValidationError('ФИО должно содержать минимум 3 символа')
        return fio

    def clean_phone(self):
        """Нормализация номера телефона"""
        phone = self.cleaned_data.get('phone', '')
        # Убираем все лишние символы, оставляем только цифры и +
        phone = ''.join(c for c in phone if c.isdigit() or c == '+')
        return phone

class CreditForm(forms.Form):
    """Форма для заявки на консультацию по кредиту."""
    fio = forms.CharField(
        label="Ваше ФИО *",
        widget=forms.TextInput(attrs={'placeholder': 'Иванов Иван Иванович', 'class': 'form-control'})
    )
    phone = forms.CharField(
        label="Ваш телефон *",
        validators=[
            RegexValidator(
                regex=r'^\+?[78][\d\s\(\)\-]{9,15}$',
                message='Введите корректный номер телефона'
            )
        ],
        widget=forms.TextInput(attrs={'placeholder': '+7 (999) 123-45-67', 'class': 'form-control', 'type': 'tel'})
    )
    captcha = CaptchaField(label="Проверка *")
