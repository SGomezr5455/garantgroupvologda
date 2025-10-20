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


# НОВАЯ МОДЕЛЬ: Дополнительные опции для всех товаров
class GlobalOption(models.Model):
    name = models.CharField('Название опции', max_length=200)
    price = models.DecimalField('Цена', max_digits=10, decimal_places=0)
    description = models.TextField('Описание опции', blank=True)
    image = models.ImageField('Фото опции', upload_to='options/', blank=True, null=True)
    category = models.CharField('Категория', max_length=100, default='general',
                               choices=[
                                   ('architecture', '🏛️ Архитектурные элементы'),
                                   ('plumbing', '🚿 Сантехника'),
                                   ('electrical', '💡 Электрика'),
                                   ('furniture', '🪑 Мебель и интерьер'),
                                   ('other', '✨ Другое')
                               ])
    order = models.PositiveIntegerField('Порядок отображения', default=0)
    is_active = models.BooleanField('Активна', default=True)

    def __str__(self):
        return f"{self.name} - {self.formatted_price()}"

    def formatted_price(self):
        return f"{self.price:,} ₽".replace(',', ' ')

    class Meta:
        verbose_name = 'Глобальная опция'
        verbose_name_plural = 'Глобальные опции'
        ordering = ['category', 'order', 'name']


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