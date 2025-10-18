from django.db import models


class Product(models.Model):
    title = models.CharField('Название', max_length=200)
    price = models.DecimalField('Цена', max_digits=10, decimal_places=0)
    description = models.TextField('Описание')
    image = models.ImageField('Главное изображение', upload_to='products/', blank=True, null=True)

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Товар'
        verbose_name_plural = 'Товары'


class ProductPrice(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='prices', verbose_name='Товар')
    name = models.CharField('Название размера/услуги', max_length=200)
    price = models.DecimalField('Цена', max_digits=10, decimal_places=0)
    description = models.TextField('Описание размера', blank=True)
    order = models.PositiveIntegerField('Порядок', default=0)

    class Meta:
        verbose_name = 'Цена товара'
        verbose_name_plural = 'Цены товара'
        ordering = ['order', 'price']

    def __str__(self):
        return f"{self.product.title} - {self.name}"

    def formatted_price(self):
        return f"{self.price:,} ₽".replace(',', ' ')


class ProductImage(models.Model):
    product = models.ForeignKey(Product, on_delete=models.CASCADE, related_name='gallery', verbose_name='Товар')
    image = models.ImageField('Дополнительное изображение', upload_to='products/gallery/')
    alt_text = models.CharField('Описание изображения', max_length=200, blank=True)
    order = models.PositiveIntegerField('Порядок', default=0)

    def __str__(self):
        return f'{self.product.title} - Фото {self.order}'

    class Meta:
        verbose_name = 'Дополнительное фото товара'
        verbose_name_plural = 'Дополнительные фото товара'
        ordering = ['order']


class AdditionalService(models.Model):
    """Дополнительные услуги - общие для всех товаров"""
    title = models.CharField('Название услуги', max_length=200)
    emoji = models.CharField('Эмодзи', max_length=10, default='✨', help_text='Например: 🔥, 💧, 🌿')
    description = models.TextField('Описание услуги')
    price = models.DecimalField('Цена', max_digits=10, decimal_places=0, null=True, blank=True,
                                help_text='Оставьте пустым, если цена не фиксирована')
    order = models.PositiveIntegerField('Порядок отображения', default=0)
    is_active = models.BooleanField('Активна', default=True)

    def __str__(self):
        return f'{self.emoji} {self.title}'

    def formatted_price(self):
        if self.price:
            return f"{self.price:,} ₽".replace(',', ' ')
        return "Уточняйте цену"

    class Meta:
        verbose_name = 'Дополнительная услуга'
        verbose_name_plural = 'Дополнительные услуги'
        ordering = ['order']


class ServiceImage(models.Model):
    """Фотографии для дополнительных услуг"""
    service = models.ForeignKey(AdditionalService, on_delete=models.CASCADE, related_name='images',
                                verbose_name='Услуга')
    image = models.ImageField('Фото услуги', upload_to='services/')
    alt_text = models.CharField('Описание изображения', max_length=200, blank=True)
    order = models.PositiveIntegerField('Порядок', default=0)

    def __str__(self):
        return f'{self.service.title} - Фото {self.order}'

    class Meta:
        verbose_name = 'Фото услуги'
        verbose_name_plural = 'Фото услуг'
        ordering = ['order']


class WorkPhoto(models.Model):
    title = models.CharField('Название работы', max_length=200, blank=True)
    image = models.ImageField('Фотография', upload_to='works/')
    created_at = models.DateTimeField('Создано', auto_now_add=True)

    def __str__(self):
        return self.title or f'Фото #{self.pk}'

    class Meta:
        verbose_name = 'Фотография работы'
        verbose_name_plural = 'Галерея работ'


class OrderRequest(models.Model):
    fio = models.CharField('ФИО', max_length=200)
    phone = models.CharField('Телефон', max_length=20)
    email = models.EmailField('Email')
    message = models.TextField('Сообщение')
    created_at = models.DateTimeField('Дата создания', auto_now_add=True)

    def __str__(self):
        return f'Заказ от {self.fio} - {self.created_at.strftime("%d.%m.%Y")}'

    class Meta:
        verbose_name = 'Заказ'
        verbose_name_plural = 'Заказы'
        ordering = ['-created_at']


class CompanyInfo(models.Model):
    title = models.CharField('Заголовок', max_length=200, default="О компании")
    description = models.TextField('Описание')

    def __str__(self):
        return self.title

    class Meta:
        verbose_name = 'Информация о компании'
        verbose_name_plural = 'Информация о компании'
