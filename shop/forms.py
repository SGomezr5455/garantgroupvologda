from django import forms
from captcha.fields import CaptchaField

class OrderForm(forms.Form):
    fio = forms.CharField(max_length=200, label="ФИО")
    phone = forms.CharField(max_length=20, label="Телефон")
    email = forms.EmailField(label="Email")
    message = forms.CharField(widget=forms.Textarea, label="Сообщение")
    captcha = CaptchaField()
