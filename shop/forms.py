# forms.py
from django import forms
from captcha.fields import CaptchaField

class OrderForm(forms.Form):
    fio = forms.CharField(
        max_length=200,
        label="ФИО *",
        widget=forms.TextInput(attrs={
            'placeholder': 'Введите ваше полное имя',
            'class': 'form-control'
        })
    )
    phone = forms.CharField(
        max_length=20,
        label="Телефон *",
        widget=forms.TextInput(attrs={
            'placeholder': '+7 (XXX) XXX-XX-XX',
            'class': 'form-control'
        })
    )
    email = forms.EmailField(
        label="Email *",
        widget=forms.EmailInput(attrs={
            'placeholder': 'example@mail.ru',
            'class': 'form-control'
        })
    )
    message = forms.CharField(
        widget=forms.Textarea(attrs={
            'placeholder': 'Здесь вы можете добавить дополнительные пожелания или вопросы...',
            'class': 'form-control',
            'rows': 4
        }),
        label="Дополнительный комментарий",
        required=False
    )
    captcha = CaptchaField()